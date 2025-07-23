import { get } from "@/httpservices/httpService";
import { deleteCoupon, updateCoupon } from "@/services/coupon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useCouponsQuery = (params: Record<string, any> = {}) => {
    return useQuery<any>({
        queryKey: ["coupons", params],
        queryFn: async () => {
            const res = await get("/coupon/admin/all", { params });
            return res?.data;
        },
    });
};

export const useUpdateCouponMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
            Toast.show({ type: "success", text1: "Đã cập nhật coupon" });
        },
        onError: (error: any) => {
            console.error("🔴 Error updating coupon:", error);
            Toast.show({
                type: "error",
                text1: "Thất bại",
                text2: "Cập nhật coupon thất bại",
            });
        }
    });
};

export const useDeleteCouponMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteCoupon,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] });
            Toast.show({ type: "success", text1: "Đã xoá coupon" });
        },
    });
};
