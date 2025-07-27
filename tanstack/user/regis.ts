import { registerSystem } from '@/services/auth/regis';
import { getAllUser } from '@/services/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerSystem,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Đăng ký thành công!',
      });
      router.push('/');
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Đăng ký thất bại. Vui lòng thử lại!',
      });
    },
  });
}

export const useAllUser = (params: Record<string, any> = {}) => {
    return useQuery<any>({
        queryKey: ["allUser", params],
        queryFn: () => getAllUser(params),
    });
};
