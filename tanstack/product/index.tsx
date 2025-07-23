import { post, remove } from "@/httpservices/httpService";
import {
    createProduct,
    createSku,
    deletedSkuImages,
    deleteSku,
    getAllProducts,
    getProductDetail,
    replaceSkuImage,
    updateProduct,
    updateSku,
} from "@/services/product";
import { IProductCreatePayload, ISku } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
export function useProductsQuery(filters?: Record<string, any>) {
    const hasFilters = !!filters && Object.keys(filters).length > 0;
    return useQuery({
        queryKey: hasFilters ? ["products", filters] : ["products"],
        queryFn: () => getAllProducts(filters ?? {}),
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
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },

        onError: (error: any) => {
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

export const useUpdateProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProduct,
        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Cập nhật sản phẩm thành công",
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: () => {
            Toast.show({
                type: "error",
                text1: "Thất bại",
                text2: "Cập nhật sản phẩm thất bại",
            });
        },
    });
};
export const useCreateSkuMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createSku,
        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Tạo SKU thành công",
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error: any) => {
            console.error("🔴 Error create SKU:", error);
            console.log("📦 Error response:", error?.response?.data);
            Toast.show({
                type: "error",
                text1: "Thất bại",
                text2: "Tạo SKU thất bại",
            });
        },
    });
};
export const useUpdateSkuMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSku,
        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Cập nhật SKU thành công",
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error: any) => {
            console.error("🔴 Error updating SKU:", error);
            console.log("🧱 AxiosError name:", error?.name);
            console.log("📡 Status code:", error?.response?.status);
            console.log(
                "📦 Full error response:",
                JSON.stringify(error?.response?.data, null, 2)
            );
            console.log("🔗 Request URL:", error?.config?.url);
            console.log(
                "📤 Payload:",
                JSON.stringify(error?.config?.data, null, 2)
            );
            console.log("📥 Headers:", error?.config?.headers);

            Toast.show({
                type: "error",
                text1: "Thất bại",
                text2: error?.response?.data?.message || "Lỗi máy chủ (500)",
            });
        },
    });
};

export const useUploadSkuImagesMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<ISku, Error, { skuId: string; files: any[] }>({
        mutationFn: async ({ skuId, files }) => {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files", file);
            });

            const res = await post(`/sku/${skuId}/images/add`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Accept: "*/*",
                },
            });

            return res.data as ISku;
        },
        onSuccess: (data, variables) => {
            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Tải ảnh thành công",
            });
            queryClient.invalidateQueries({
                queryKey: ["sku", variables.skuId],
            });
        },
        onError: () => {
            Toast.show({
                type: "error",
                text1: "Thất bại",
                text2: "Tải ảnh thất bại",
            });
        },
    });
};

export const useDeletedSkuImages = () => {
    const queryClient = useQueryClient();
    return useMutation<ISku, Error, { skuId: string; imageIndex: number }>({
        mutationFn: async ({ skuId, imageIndex }) => {
            const result = await deletedSkuImages(skuId, imageIndex);
            return result as ISku;
        },
        onSuccess: (data, variables) => {
            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Xóa ảnh thành công",
            });
            queryClient.invalidateQueries({
                queryKey: ["sku", variables.skuId],
            });
        },
    });
};

export const useReplaceSkuImageMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<
        ISku,
        Error,
        { skuId: string; index: number; file: File }
    >({
        mutationFn: async ({ skuId, index, file }) => {
            const res = await replaceSkuImage(skuId, index, file);
            return res as ISku;
        },
        onSuccess: (data, variables) => {
            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Cập nhật ảnh SKU thành công",
            });
            queryClient.invalidateQueries({
                queryKey: ["sku", variables.skuId],
            });
        },
        onError: () => {
            Toast.show({
                type: "error",
                text1: "Thất bại",
                text2: "Cập nhật ảnh thất bại",
            });
        },
    });
};

export const useDeleteProductSkuMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteSku,
        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Đã xoá",
                text2: "SKU đã được xoá",
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error: any) => {
            console.error("🔴 Error delete SKU:", error);
            console.log("📦 Error response:", error?.response?.data);
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Xoá SKU thất bại",
            });
        },
    });
};

export const useGetProductDetailMutation = () => {
    return useMutation({
        mutationFn: getProductDetail,
    });
};
export const useDeleteProductMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await remove(`/product/${id}`);
            return res.data;
        },
        onSuccess: () => {
            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Đã xoá sản phẩm",
            });
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
        },
    });
};
