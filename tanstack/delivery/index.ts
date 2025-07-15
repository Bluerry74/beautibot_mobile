import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { updateDeliveryStatus, uploadProof } from "@/services/delivery";

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
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Lỗi cập nhật trạng thái',
        text2: 'Vui lòng thử lại sau.',
      });
    }
  });
}
