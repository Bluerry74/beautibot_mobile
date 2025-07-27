
import { get } from "@/httpservices/httpService";
import { approveReturnRequest, cancelOrder, getAllOrder, getAllReturnRequests, rejectReturnRequest, requestReturn, updateOrderStatus } from "@/services/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export const useRequestReturnMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, reason, images }: { orderId: string; reason: string; images: string[] }) =>
      requestReturn(orderId, reason, images),
    onSuccess: (_data, _variables, context: any) => {
        Toast.show({
            type: "success",
            text1: "Yêu cầu trả hàng thành công",
        });
       if (context?.onDone) {
        context.onDone();
      }
        queryClient.invalidateQueries({ queryKey: ["allOrder"] });
    },
    onError: (error: any) => {
        Toast.show({
            type: "error",
            text1: error.message || "Không thể gửi yêu cầu trả hàng",
        });
    },
  });
};

export const useAllReturnRequests = (params: { page: number; limit: number; email?: string }) =>
  useQuery({
    queryKey: ["return-requests", params],
    queryFn: () => getAllReturnRequests(params),
    select: (res: any) => res.data,
  })

  export const useApproveReturnMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      approveReturnRequest(id, body),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Yêu cầu trả hàng đã được chấp nhận",
      });
      queryClient.invalidateQueries({ queryKey: ['returnRequests'] });
    },
  });
};

export const useRejectReturnMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      rejectReturnRequest(id, body),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Yêu cầu trả hàng đã bị từ chối",
      });
      queryClient.invalidateQueries({ queryKey: ['returnRequests'] });
    },
  });
};