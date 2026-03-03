"use client";

import { useNavigation, useOne, type HttpError } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CACHE_TAGS } from "@/src/configs/cache-tags.config";
import { GoodsForm, type IGoods, type IGoodsForm } from "@/src/features/goods";
import { revalidateCache } from "@/src/libs/revalidateCache";
import { goodsUpdateSchema } from "@/src/validators/goods.schema";
import { joiResolver } from "@hookform/resolvers/joi";

export default function GoodsEditPage() {
  const { id } = useParams<{ id: string }>();
  const { list } = useNavigation();
  const t = useTranslations("validation");
  const [isInitializing, setIsInitializing] = useState(true);

  const {
    query: { data, isLoading },
  } = useOne<IGoods>({
    resource: "goods",
    id,
  });

  const goodsData: IGoods | undefined = useMemo(() => {
    if (!data?.data) {
      return undefined;
    }

    return data.data;
  }, [data]);

  const {
    refineCore: { onFinish, formLoading },
    saveButtonProps,
    register,
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm<IGoodsForm, HttpError, IGoodsForm>({
    resolver: joiResolver(goodsUpdateSchema(t)),
    refineCoreProps: {
      resource: "goods",
      id,
      action: "edit",
      redirect: false,
    },
  });

  const specsWatch = watch("specs");

  useEffect(() => {
    if (goodsData) {
      reset({
        titleUk: goodsData.title.uk,
        titleRu: goodsData.title.ru,
        tag: goodsData.tag,
        descriptionUk: goodsData.description?.uk
          ? JSON.parse(goodsData.description.uk)
          : undefined,
        descriptionRu: goodsData.description?.ru
          ? JSON.parse(goodsData.description.ru)
          : undefined,
        specs: goodsData.specs,
        category: goodsData.category,
        currency: goodsData.currency,
        badge: goodsData.badge || "",
        country: goodsData.country || "",
        price: goodsData.price ? (goodsData.price / 100).toFixed(2) : "",
        discountPrice: goodsData.discountPrice
          ? (goodsData.discountPrice / 100).toFixed(2)
          : "",
        brand: goodsData.brandId || "",
      });
      setTimeout(() => setIsInitializing(false), 0);
    }
  }, [goodsData, reset]);

  const handleSave = (data: IGoodsForm) => {
    if (Object.keys(dirtyFields).length === 0) return list("goods");

    const updatedData = {} as IGoodsForm;
    (Object.keys(dirtyFields) as Array<keyof IGoodsForm>).forEach((key) => {
      if (key === "titleUk" && !dirtyFields["tag"]) {
        updatedData["titleUk"] = data["titleUk"];
        updatedData["tag"] = data["tag"];
        return;
      }
      if (["descriptionUk", "descriptionRu"].includes(key)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        updatedData[key] = JSON.stringify(data[key]);
        return;
      }
      if (key === "specs") {
        updatedData["category"] = data["category"];
        updatedData["specs"] = JSON.stringify(
          specsWatch,
        ) as unknown as IGoodsForm["specs"];
        return;
      }
      if (key === "price" || key === "discountPrice") {
        updatedData[key] = (parseFloat(data[key]) * 100) as unknown as string;
        return;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      updatedData[key] = data[key];
    });

    // Use current tag from form, or old tag if not changed
    const tagToInvalidate = data.tag || goodsData?.tag || id;
    const oldTag = goodsData?.tag;

    void onFinish(updatedData).then(async () => {
      const tagsToRevalidate = [
        CACHE_TAGS.goodsList,
        CACHE_TAGS.goodsFilters,
        CACHE_TAGS.goodsId(tagToInvalidate),
      ];

      // If tag was changed, also invalidate the old tag cache
      if (oldTag && oldTag !== tagToInvalidate) {
        tagsToRevalidate.push(CACHE_TAGS.goodsId(oldTag));
        console.log("Tag was changed, also invalidating old tag");
      }

      console.log("Revalidating tags:", tagsToRevalidate);
      await revalidateCache(tagsToRevalidate);
      console.log("Cache revalidation completed");
      list("goods");
    });
  };

  return (
    <Edit
      isLoading={isLoading || formLoading || isInitializing}
      saveButtonProps={{
        ...saveButtonProps,
        onClick: handleSubmit(handleSave, (err) => console.error(err)),
      }}
    >
      <GoodsForm
        control={control}
        errors={errors}
        registerAction={register}
        watch={watch}
        setValueAction={setValue}
        getValuesAction={getValues}
        isEdit={true}
        goods={goodsData}
      />
    </Edit>
  );
}
