import { post } from "@/httpservices/httpService";
import { CartItem } from "@/types/cart";

export const addToCart = async (cartItem: CartItem) => {
    const res = await post<CartItem>("/cart/item", cartItem);
    return res.data;
};

