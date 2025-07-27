import { get, patch, post, put } from "@/httpservices/httpService";
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
 // request return

export const requestReturn = async (orderId: string, reason: string, images: string[]) => {
  const res = await post("/return/request", {orderId,reason, images});
  return res.data;
};

export const getAllReturnRequests = (params: { page: number; limit: number; email?: string }) =>
  get("/return/admin/all", { params });

// approve return request
export const approveReturnRequest = async (returnId: string) => {
  await patch(`/return/approve/${returnId}`);
};

// reject return request
export const rejectReturnRequest = async (returnId: string) => {
  await patch(`/return/reject/${returnId}`);
}