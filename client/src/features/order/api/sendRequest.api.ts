import { API_ROUTES } from "@/src/configs/api-routes.config";
import apiClient from "@/src/libs/api-client";
import type { IOrder, IOrderRequest } from "../types/order.type";

export async function sendRequestApi(data: IOrderRequest): Promise<IOrder> {
  const res = await apiClient
    .getInstance()
    .post<IOrder>(API_ROUTES.order.send, data);

  return res.data;
}
