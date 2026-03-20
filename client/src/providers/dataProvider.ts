import { DataProvider, HttpError } from "@refinedev/core";
import simpleRestProvider from "@refinedev/simple-rest";
import { isAxiosError } from "axios";

import { API_URL } from "../configs/api-routes.config";
import apiClient from "../libs/api-client";

const toHttpError = (error: unknown): HttpError => {
  if (isAxiosError(error)) {
    return {
      message: error.response?.data?.message ?? "Something went wrong!",
      statusCode: error.response?.status ?? 500,
    };
  }
  throw error;
};

const wrap = <T>(fn: () => Promise<T>): Promise<T> =>
  fn().catch((e) => {
    throw toHttpError(e);
  });

const axiosInstance = apiClient.getInstance();

const baseDataProvider = simpleRestProvider(API_URL, axiosInstance);

// Wrap all base provider methods so axios errors are converted to HttpError
// (simpleRestProvider's built-in error transform only applies to its own axios instance,
//  not the custom one we pass — so raw AxiosErrors would bubble up otherwise)
const wrappedBase: DataProvider = {
  ...baseDataProvider,
  getList: (p) => wrap(() => baseDataProvider.getList(p)),
  getOne: (p) => wrap(() => baseDataProvider.getOne(p)),
  getMany: (p) => wrap(() => baseDataProvider.getMany!(p)),
  create: (p) => wrap(() => baseDataProvider.create(p)),
  update: (p) => wrap(() => baseDataProvider.update(p)),
  deleteOne: (p) => wrap(() => baseDataProvider.deleteOne(p)),
};

const isFile = (value: unknown): value is File => {
  return value instanceof File;
};

const hasFiles = (values: Record<string, unknown>): boolean => {
  return Object.values(values).some((value) => {
    if (Array.isArray(value)) {
      return value.some(isFile);
    }
    return isFile(value);
  });
};

const createFormData = (values: Record<string, unknown>): FormData => {
  const formData = new FormData();
  for (const key in values) {
    const value = values[key];
    if (Array.isArray(value)) {
      if (value.some(isFile)) {
        value.forEach((item) => {
          if (isFile(item)) {
            formData.append(key, item);
          } else {
            formData.append(key, JSON.stringify(item));
          }
        });
      } else {
        formData.append(key, JSON.stringify(value));
      }
    } else if (isFile(value)) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  }
  return formData;
};

export const dataProvider: DataProvider = {
  ...wrappedBase,

  create: async ({ resource, variables }) => {
    if (hasFiles(variables as Record<string, unknown>)) {
      const formData = createFormData(variables as Record<string, unknown>);
      try {
        const { data } = await axiosInstance.post(
          `${API_URL}/${resource}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        return { data };
      } catch (error) {
        throw toHttpError(error);
      }
    }
    return wrappedBase.create({ resource, variables });
  },

  update: async ({ resource, id, variables }) => {
    if (hasFiles(variables as Record<string, unknown>)) {
      const formData = createFormData(variables as Record<string, unknown>);
      try {
        const { data } = await axiosInstance.patch(
          `${API_URL}/${resource}/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        return { data };
      } catch (error) {
        throw toHttpError(error);
      }
    }
    return wrappedBase.update({ resource, id, variables });
  },

  deleteOne: async ({ resource, id, variables }) => {
    return wrappedBase.deleteOne({ resource, id, variables });
  },
};
