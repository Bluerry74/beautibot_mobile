
import { get } from "@/httpservices/httpService";
import { cancelOrder, getAllOrder, updateOrderStatus } from "@/services/order";
import { useMutation, useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useAllOrder = (params: Record<string, any> = {}) => {
    return useQuery({
        queryKey: ["allOrder", params],
        queryFn: () => getAllOrder(params),
    });
};

export const useAnalytics = () => {
    return useQuery<any>({
        queryKey: ["order-analytics"],
        queryFn: async () => {
            const res = await get<any>("/order/admin/analytics");
            return res.data;
        },
    });
};

export const useUpdateOrderStatusMutation = () => {
    return useMutation({
        mutationFn: async ({ orderId, orderStatus }: { orderId: string; orderStatus: string }) => {
            return await updateOrderStatus(orderId, orderStatus);
        },
        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Cập nhật trạng thái đơn hàng thành công",
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: "error",
                text1: error.message,
            });
        }
    });
};

export const useCancelOrderMutation = () => {
    return useMutation({
        mutationFn: async ({ orderId }: { orderId: string }) => {
            return await cancelOrder(orderId);
        },
        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Hủy đơn hàng thành công",
            });
        },
        onError: (error: any) => {
            Toast.show({
                type: "error",
                text1: error.message,
            });
        }
    });
};