import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CustomHttpExceptionUtil } from 'src/helpers/custom-http-exection.util';
import { PrismaService } from '../../libs/prisma/prisma.service';
import { defaultGlobalParam } from './data/default-global-param';
import { GlobalParamUpdateDto } from './dto/global-params.dto';

@Injectable()
export class GlobalParamService implements OnModuleInit {
  private readonly logger = new Logger(GlobalParamService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      const defaultParamsArray = Object.entries(defaultGlobalParam);

      const existingParams = await this.prisma.globalParam.findMany({
        where: {
          name: { in: defaultParamsArray.map(([key]) => key) },
        },
        select: { name: true },
      });

      const existingNames = new Set(existingParams.map((p) => p.name));

      const dataToCreate = defaultParamsArray
        .filter(([key]) => !existingNames.has(key))
        .map(
          ([key, value]): Prisma.GlobalParamCreateManyInput => ({
            name: key,
            value: value.value as Prisma.InputJsonValue,
            description: value.description,
            title: value.title,
          }),
        );

      if (dataToCreate.length > 0) {
        await this.prisma.globalParam.createMany({
          data: dataToCreate,
        });
      }
      this.logger.log('Global parameters initialized successfully');
    } catch (error) {
      this.logger.error('Error initializing Global Params', error.stack);
    }
  }

  async updateGlobalParam(body: GlobalParamUpdateDto) {
    const currentParam = await this.getGlobalParamByName(body.name);

    const updatedData: Prisma.GlobalParamUpdateInput = {
      value: {
        ...(currentParam.value as unknown as object),
        ...body.value,
      } as unknown as Prisma.InputJsonValue,
    };
    return this.prisma.globalParam.update({
      where: {
        name: body.name,
      },
      data: updatedData,
    });
  }

  async getGlobalParamByName(name: string) {
    const param = await this.prisma.globalParam.findUnique({
      where: {
        name,
      },
    });

    if (!param)
      throw new CustomHttpExceptionUtil(
        HttpStatus.NOT_FOUND,
        'Global param not found',
      );
    return param;
  }
}
