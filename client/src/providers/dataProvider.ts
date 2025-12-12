import simpleRestProvider from "@refinedev/simple-rest";
import { DataProvider } from "@refinedev/core";

import { API_URL } from "../configs/api-routes.config";
import apiClient from "../libs/api-client";

const axiosInstance = apiClient.getInstance();

const baseDataProvider = simpleRestProvider(API_URL, axiosInstance);

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
  ...baseDataProvider,

  create: async ({ resource, variables }) => {
    if (hasFiles(variables as Record<string, unknown>)) {
      const formData = createFormData(variables as Record<string, unknown>);
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
    }
    return baseDataProvider.create({ resource, variables });
  },

  update: async ({ resource, id, variables }) => {
    if (hasFiles(variables as Record<string, unknown>)) {
      const formData = createFormData(variables as Record<string, unknown>);
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
    }
    return baseDataProvider.update({ resource, id, variables });
  },

  deleteOne: async ({ resource, id, variables }) => {
    return baseDataProvider.deleteOne({ resource, id, variables });
  },
};
