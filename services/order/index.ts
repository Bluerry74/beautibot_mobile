import { get, put } from "@/httpservices/httpService";
import { IOrder, IOrderResponse } from "@/types/order";

export const getAllOrder = async (filter = {}) => {
    const res = await get<IOrderResponse>("/order/admin", {
        params: filter,
    });
    return res.data;
};
export const getMyOrders = async (): Promise<IOrder[]> => {
    const res = await get<{ data: IOrder[] }>("/order/me/all");
    return res.data.data;
  };
  
  // Hủy đơn
  export const cancelOrder = async (orderId: string): Promise<void> => {
    await put<void>(`/order/${orderId}/cancel`);
  };

export const updateOrderStatus = async (orderId: string, orderStatus: string) => {
    await put(`/order/${orderId}/status`, { orderStatus });
};