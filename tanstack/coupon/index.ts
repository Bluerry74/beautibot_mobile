import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCoupon, getAllCoupons, updateCoupon } from "@/services/coupon";
import Toast from "react-native-toast-message";

export const useCouponsQuery = (filters = {}) => {
  return useQuery({
    queryKey: ["coupons", filters],
    queryFn: () => getAllCoupons(filters),
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
