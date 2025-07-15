import {
    createProduct,
    getAllProducts,
    getProductDetail,
} from "@/services/product";
import { IProductCreatePayload } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
export function useProductsQuery(filters = {}) {
    return useQuery({
        queryKey: ["products", filters],
        queryFn: () => getAllProducts(filters),
    });
}

export function useProductDetailQuery(id: string) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductDetail(id),
        enabled: !!id,
    });
}

export const useCreateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: IProductCreatePayload) => createProduct(payload),

        onSuccess: (data) => {
            console.log("🟢 Create product result:", data);
            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Tạo sản phẩm thành công",
            });
            queryClient.invalidateQueries({ queryKey: ["product"] });
        },

        onError: (error) => {
            console.error("🔴 Error creating product:", error);
            console.log("📦 Error response:", error?.response?.data);
            Toast.show({
                type: "error",
                text1: "Thất bại",
                text2: "Tạo sản phẩm thất bại",
            });
        },
    });
};
