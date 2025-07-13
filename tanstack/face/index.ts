import { analyzeFace } from "@/services/face";
import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

export const useAnalyzeFaceMutation = () => {
  return useMutation({
    mutationFn: async (imagePath: string) => {
      return await analyzeFace(imagePath);
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'FACE++ FREE',
        text2: 'Gửi ảnh thành công',
      })
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'FACE++ FREE',
        text2: 'Vui lòng đợi thêm ít phút rồi thử lại.',
      });
    }
  });
};
