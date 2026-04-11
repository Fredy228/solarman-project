import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { GoodsCategory, Prisma, ProductStatus } from '@prisma/client';
import { generatePrismaIntFilter } from 'src/helpers/prisma/generate-prisma-int-filter';
import { Language } from '../../../common/enums/language.enum';
import { GoodsErrorMessage } from '../../../common/messages/error/goods.message';
import {
  TCategoryFilterFields,
  TFilterValue,
  TGoodsCategoryFiltersMap,
} from '../../../common/types/goods/goods-filters.type';
import { CustomHttpExceptionUtil } from '../../../helpers/custom-http-exection.util';
import { generatePrismaPaginateOption } from '../../../helpers/prisma/generate-prisma-paginate-option';
import { PrismaService } from '../../../libs/prisma/prisma.service';
import { GoodsGetManyQueryDto } from '../dto/goods-get-many.query.dto';

const CATEGORY_FILTER_FIELDS = {
  PANEL: ['type', 'power', 'country', 'brand'],
  INVERTOR: ['type', 'power', 'phase', 'country', 'brand'],
  BATTERY: ['type', 'capacity', 'voltage', 'country', 'brand'],
  FASTENER: ['type', 'material', 'country', 'brand'],
  COMPONENT: ['type', 'country', 'brand'],
  CHARGE_STATION: ['power', 'country', 'brand'],
  READY_MADE_SOLUTION: ['power', 'country', 'brand'],
} as const satisfies TCategoryFilterFields;

const NUMERIC_SPEC_FIELDS = new Set(['power', 'capacity', 'voltage', 'phase']);

const normalizeQueryValueToArray = (
  value: string | number | string[] | number[] | undefined,
): Array<string | number> => {
  if (value === undefined || value === null) return [];

  if (Array.isArray(value)) {
    return value.filter((item) => item !== undefined && item !== null);
  }

  return [value];
};

@Injectable()
export class GoodsPublicService implements OnModuleInit {
  private readonly logger = new Logger(GoodsPublicService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.ensureSpecsIndexes();
  }

  private async ensureSpecsIndexes() {
    try {
      await this.prisma.$runCommandRaw({
        createIndexes: 'goods',
        indexes: [
          {
            key: { category: 1, 'specs.type': 1 },
            name: 'goods_category_specs_type_idx',
          },
          {
            key: { category: 1, 'specs.power': 1 },
            name: 'goods_category_specs_power_idx',
          },
          {
            key: { category: 1, 'specs.phase': 1 },
            name: 'goods_category_specs_phase_idx',
            partialFilterExpression: {
              category: 'INVERTOR',
            },
          },
          {
            key: { category: 1, 'specs.capacity': 1 },
            name: 'goods_category_specs_capacity_idx',
            partialFilterExpression: {
              category: 'BATTERY',
            },
          },
          {
            key: { category: 1, 'specs.voltage': 1 },
            name: 'goods_category_specs_voltage_idx',
            partialFilterExpression: {
              category: 'BATTERY',
            },
          },
          {
            key: { category: 1, 'specs.material': 1 },
            name: 'goods_category_specs_material_idx',
            partialFilterExpression: {
              category: 'FASTENER',
            },
          },
          {
            key: { category: 1, country: 1 },
            name: 'goods_category_country_idx',
          },
          {
            key: { category: 1, brandId: 1 },
            name: 'goods_category_brand_idx',
          },
        ],
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Goods specs indexes setup skipped: ${message}`);
    }
  }

  async getOneByTag(tag: string, lang: Language) {
    const foundGoods = await this.prisma.goods.findUnique({
      where: {
        tag,
        status: ProductStatus.PUBLISHED,
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!foundGoods)
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        GoodsErrorMessage[lang].NOT_FOUND,
      );

    const { title, description, ...otherFileds } = foundGoods;

    return {
      ...otherFileds,
      title: title[lang],
      description: description[lang],
    };
  }

  async getMany(query: GoodsGetManyQueryDto, lang: Language) {
    const {
      _start,
      _end,
      _sort,
      _order,
      title_like,
      price_gte,
      price_lte,
      discountPrice_gte,
      discountPrice_lte,
      type,
      power,
      phase,
      capacity,
      voltage,
      material,
      country,
      brand,
      ...simpleFilters
    } = query;

    const whereOption: Prisma.GoodsWhereInput = {
      title: {
        is: {
          [lang]: {
            contains: title_like,
            mode: 'insensitive',
          },
        },
      },
      price: generatePrismaIntFilter({
        value_gte: price_gte,
        value_lte: price_lte,
      }),
      discountPrice: generatePrismaIntFilter({
        value_gte: discountPrice_gte,
        value_lte: discountPrice_lte,
      }),
      ...simpleFilters,
    };

    // Add country filter
    if (country !== undefined) {
      const countryValues = normalizeQueryValueToArray(country);
      if (countryValues.length > 0) {
        const stringValues = countryValues
          .map((value) => String(value).trim())
          .filter((value) => value.length > 0);

        if (stringValues.length > 0) {
          whereOption.country =
            stringValues.length === 1 ? stringValues[0] : { in: stringValues };
        }
      }
    }

    // Add brand filter
    if (brand !== undefined) {
      const brandValues = normalizeQueryValueToArray(brand);
      if (brandValues.length > 0) {
        const stringValues = brandValues
          .map((value) => String(value).trim())
          .filter((value) => value.length > 0);

        if (stringValues.length > 0) {
          whereOption.brandId =
            stringValues.length === 1 ? stringValues[0] : { in: stringValues };
        }
      }
    }

    const specFilters = Object.entries({
      type,
      power,
      phase,
      capacity,
      voltage,
      material,
    })
      .map(([field, rawValue]) => {
        const values = normalizeQueryValueToArray(rawValue);

        if (values.length === 0) {
          return null;
        }

        if (NUMERIC_SPEC_FIELDS.has(field)) {
          const numericValues = values
            .map((value) => Number(value))
            .filter((value) => !Number.isNaN(value));

          if (numericValues.length === 0) {
            return null;
          }

          if (numericValues.length === 1) {
            return {
              [`specs.${field}`]: numericValues[0],
            } as Record<string, unknown>;
          }

          return {
            [`specs.${field}`]: { $in: numericValues },
          } as Record<string, unknown>;
        }

        const stringValues = values
          .map((value) => String(value).trim())
          .filter((value) => value.length > 0);

        if (stringValues.length === 0) {
          return null;
        }

        if (stringValues.length === 1) {
          return {
            [`specs.${field}`]: stringValues[0],
          } as Record<string, unknown>;
        }

        return {
          [`specs.${field}`]: { $in: stringValues },
        } as Record<string, unknown>;
      })
      .filter((item): item is Record<string, unknown> => item !== null);

    if (specFilters.length > 0) {
      const rawFilter: Record<string, unknown> =
        specFilters.length === 1 ? specFilters[0] : { $and: specFilters };

      if (simpleFilters.category) {
        rawFilter.category = simpleFilters.category;
      }

      const rawResult = await this.prisma.goods.findRaw({
        filter: rawFilter as Prisma.InputJsonValue,
        options: {
          projection: {
            _id: 1,
          },
        },
      });

      const rawItems = Array.isArray(rawResult) ? rawResult : [];
      const ids = rawItems
        .map((item) => {
          if (item && typeof item === 'object' && !Array.isArray(item)) {
            const value = (item as { _id?: unknown })._id;
            if (typeof value === 'string') return value;
            if (
              value &&
              typeof value === 'object' &&
              '$oid' in (value as Record<string, unknown>)
            ) {
              return (value as { $oid?: unknown }).$oid as string | undefined;
            }
          }

          return null;
        })
        .filter((id): id is string => typeof id === 'string');

      if (ids.length === 0) {
        return {
          data: [],
          total: 0,
        };
      }

      whereOption.id = {
        in: ids,
      };
    }

    const [goods, total] = await this.prisma.$transaction([
      this.prisma.goods.findMany({
        ...generatePrismaPaginateOption(_start, _end, _sort, _order),
        where: whereOption,
        select: {
          id: true,
          updatedAt: true,
          cover: true,
          title: true,
          tag: true,
          country: true,
          price: true,
          discountPrice: true,
          currency: true,
          badge: true,
          category: true,
          status: true,
          brand: {
            select: {
              name: true,
            },
          },
        },
      }),
      this.prisma.goods.count({
        where: whereOption,
      }),
    ]);

    return {
      data: goods,
      total,
    };
  }

  async getFiltersByCategory<C extends GoodsCategory>(
    category: C,
  ): Promise<TGoodsCategoryFiltersMap[C]> {
    const filterFields = CATEGORY_FILTER_FIELDS[category];

    const emptyResult = filterFields.reduce<Record<string, any>>(
      (acc, field) => {
        acc[field] = [];
        return acc;
      },
      {},
    );

    const facet: Record<string, Prisma.InputJsonValue> = {};
    for (const field of filterFields) {
      if (field === 'country') {
        facet[field] = [
          {
            $group: {
              _id: `$country`,
            },
          },
          {
            $match: {
              _id: { $ne: null },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ];
      } else if (field === 'brand') {
        facet[field] = [
          {
            $lookup: {
              from: 'goods_brand',
              localField: 'brandId',
              foreignField: '_id',
              as: 'brandData',
            },
          },
          {
            $unwind: {
              path: '$brandData',
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $group: {
              _id: {
                id: '$brandData._id',
                name: '$brandData.name',
              },
            },
          },
          {
            $sort: {
              '_id.name': 1,
            },
          },
        ];
      } else {
        facet[field] = [
          {
            $group: {
              _id: `$specs.${field}`,
            },
          },
          {
            $match: {
              _id: { $ne: null },
            },
          },
          {
            $sort: {
              _id: 1,
            },
          },
        ];
      }
    }

    const rawResult = await this.prisma.$runCommandRaw({
      aggregate: 'goods',
      pipeline: [
        { $match: { category: category, status: 'PUBLISHED' } },
        {
          $facet: facet as Prisma.InputJsonObject,
        },
      ],
      cursor: {},
    });

    const cursor =
      rawResult && typeof rawResult === 'object' && !Array.isArray(rawResult)
        ? (rawResult.cursor as Prisma.JsonValue)
        : null;

    if (!cursor || typeof cursor !== 'object' || Array.isArray(cursor)) {
      return emptyResult as TGoodsCategoryFiltersMap[C];
    }

    const firstBatch = cursor.firstBatch;
    if (!Array.isArray(firstBatch) || firstBatch.length === 0) {
      return emptyResult as TGoodsCategoryFiltersMap[C];
    }

    const facetedData = firstBatch[0];
    if (
      !facetedData ||
      typeof facetedData !== 'object' ||
      Array.isArray(facetedData)
    ) {
      return emptyResult as TGoodsCategoryFiltersMap[C];
    }

    return filterFields.reduce<Record<string, any>>((acc, field) => {
      const rawFieldValues = facetedData[field];
      if (!Array.isArray(rawFieldValues)) {
        acc[field] = [];
        return acc;
      }

      if (field === 'brand') {
        const brands = rawFieldValues
          .map((item) => {
            if (!item || typeof item !== 'object' || Array.isArray(item)) {
              return null;
            }

            const idObj = item._id;
            if (!idObj || typeof idObj !== 'object' || Array.isArray(idObj)) {
              return null;
            }

            const brandId = idObj.id;
            const brandName = idObj.name;

            if (typeof brandName !== 'string') {
              return null;
            }

            let id: string;
            if (typeof brandId === 'string') {
              id = brandId;
            } else if (
              brandId &&
              typeof brandId === 'object' &&
              '$oid' in (brandId as Record<string, unknown>)
            ) {
              id = (brandId as { $oid: string }).$oid;
            } else {
              return null;
            }

            return { id, name: brandName };
          })
          .filter(
            (brand): brand is { id: string; name: string } => brand !== null,
          );

        acc[field] = brands;
      } else {
        const values = rawFieldValues
          .map((item) => {
            if (!item || typeof item !== 'object' || Array.isArray(item)) {
              return null;
            }

            return item._id ?? null;
          })
          .filter(
            (value): value is TFilterValue =>
              typeof value === 'string' || typeof value === 'number',
          );

        acc[field] = values;
      }

      return acc;
    }, emptyResult) as TGoodsCategoryFiltersMap[C];
  }
}
