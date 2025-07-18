import { assignDeliveryPersonnel, createDelivery, getDeliveries, getDeliveryDetail, getDeliveryPersonnel, updateDeliveryStatus, uploadProof } from "@/services/delivery";
import { ICreateDelivery } from "@/types/delivery";
import { useMutation, useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useUploadProofMutation = () => {
  return useMutation({
    mutationFn: async ({ imageUri, deliveryId }: { imageUri: string; deliveryId: string }) => {
      return await uploadProof(imageUri, deliveryId);
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Tải ảnh thành công',
        text2: 'Bằng chứng đã được gửi.',
      });
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Lỗi tải ảnh',
        text2: 'Vui lòng thử lại sau.',
      });
    }
  });
};

export const useUpdateDeliveryStatusMutation = () => {
  return useMutation({
    mutationFn: async ({ deliveryId, status }: { deliveryId: string; status: string }) => {
      return await updateDeliveryStatus(deliveryId, status);
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Cập nhật trạng thái thành công',
        text2: 'Trạng thái giao hàng đã được cập nhật.',
      });
    },
    onError: (err) => {
      Toast.show({
        type: 'error',
        text1: err.message,
        text2: 'Vui lòng thử lại sau.',
      });
    }
  });
}

export const useAssignDeliveryPersonnelMutation = () => {
  return useMutation({
    mutationFn: async ({ deliveryId, deliveryPersonnelId }: { deliveryId: string, deliveryPersonnelId: string }) => {
      return await assignDeliveryPersonnel(deliveryId, deliveryPersonnelId);
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Phân công thành công',
        text2: 'Đơn hàng đã được phân công cho nhân viên giao hàng.'
      });
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: 'Lỗi phân công',
        text2: err.message 
      });
    }
  });
}

export const useDeliveryQuerry = (params: { page: number; limit: number; status?: string }) => {
  return useQuery({
    queryKey: ['deliveries', params],
    queryFn: async () => {
      try {
        return await getDeliveries(params);
      } catch (error) {
        console.error('Lỗi lấy dữ liệu deliveries:', error);
        throw error;
      }
    },
  });
}

export const useCreateDeliveryMutation = () => {
  return useMutation({
    mutationFn: async (data: ICreateDelivery) => {
      return await createDelivery(data);
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Tạo giao hàng thành công',
        text2: 'Đơn giao hàng đã được khởi tạo.',
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Lỗi tạo đơn giao hàng',
        text2: error.message || 'Vui lòng thử lại sau.',
      });
    }
  });
};

export const getDeliveryDetailQuery = (deliveryId: string) => {
  return useQuery({
    queryKey: ['delivery', deliveryId],
    queryFn: async () => {
      return await getDeliveryDetail(deliveryId);
    },
  });
};

export const useDeliveryPersonnelQuery = (params?: {
  page?: number;
  limit?: number;
  email?: string;
  name?: string;
  phone?: string;
}) => {
  return useQuery({
    queryKey: ['delivery-personnel', params],
    queryFn: async () => {
      return await getDeliveryPersonnel(params);
    },
  });
};