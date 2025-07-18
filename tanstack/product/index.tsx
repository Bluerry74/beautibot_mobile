import { remove } from "@/httpservices/httpService";
import {
  createProduct,
  createSku,
  deleteSku,
  deleteSkuImageByIndex,
  getAllProducts,
  getProductDetail,
  replaceSkuImage,
  updateProduct,
  updateSku,
  uploadSkuImages,
} from "@/services/product";
import { IProductCreatePayload } from "@/types/product";
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
      console.log("📦 Error response:", error?.response?.data);

      Toast.show({
        type: "error",
        text1: "Thất bại",
        text2: "Cập nhật SKU thất bại",
      });
    },
  });
};

export const useUploadSkuImagesMutation = () => {
  return useMutation({
    mutationFn: ({ skuId, files }: { skuId: string; files: any[] }) =>
      uploadSkuImages(skuId, files),

    onError: (error: any) => {
      console.error("❌ Error uploading SKU images:", error);

      Toast.show({
        type: "error",
        text1: "Lỗi khi tải ảnh SKU",
        text2:
          error?.response?.data?.message?.[0] ||
          error.message ||
          "Đã xảy ra lỗi không xác định.",
      });
    },

    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Tải ảnh SKU thành công!",
      });
    },
  });
};

export const useDeleteSkuImageMutation = () => {
  return useMutation({
    mutationFn: ({ skuId, index }: { skuId: string; index: number }) =>
      deleteSkuImageByIndex(skuId, index),
  });
};

export const useReplaceSkuImageMutation = () => {
  return useMutation({
    mutationFn: ({
      skuId,
      index,
      file,
    }: {
      skuId: string;
      index: number;
      file: any;
    }) => replaceSkuImage(skuId, index, file),
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
      queryClient.invalidateQueries({ queryKey: ["products"], exact: false });
    },
  });
};
