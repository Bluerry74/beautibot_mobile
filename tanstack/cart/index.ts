import { addToCart } from "@/services/cart";
import { useMutation } from "@tanstack/react-query";
import Toast from 'react-native-toast-message';


export const useAddToCart = () => {
    return useMutation({
        mutationFn: addToCart,
        onSuccess: () => {
            Toast.show({
                type: 'success',
                text1: 'Thêm vào giỏ hàng thành công',
            });
        },
        onError: () => {
            Toast.show({
                type: 'error',
                text1: 'Thêm vào giỏ hàng thất bại',
            });
        },
    });
};

