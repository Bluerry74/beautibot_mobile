// hooks/useCartActions.ts
import { CartItem, IAddress, Sku } from "@/app/types/product";
import axios from "axios";

const API = "https://be-wdp.onrender.com";

export const useCartActions = () => {
  const addToCart = async (sku: Sku) => {
    await axios.post(`${API}/cart/item`, {
      skuId: sku._id,
      quantity: 1,
    });
  };

  const removeFromCart = async (skuId: string) => {
    await axios.delete(`${API}/cart/item`, { data: { skuId } });
  };

  const updateQuantity = async (skuId: string, quantity: number) => {
    await axios.patch(`${API}/cart/item/quantity`, {
      skuId,
      quantity,
    });
  };

  const getCart = async (): Promise<CartItem[]> => {
    const res = await axios.get(`${API}/cart`);
    return res.data.data;
  };

  const getAddresses = async (): Promise<IAddress[]> => {
    const res = await axios.get(`${API}/address`);
    return res.data.data;
  };

  const addAddress = async (addr: Omit<IAddress, "_id" | "__v">) => {
    await axios.post(`${API}/address`, addr);
  };

  const checkout = async (addressId: string) => {
    await axios.post(`${API}/checkout`, { addressId });
  };

  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart,
    getAddresses,
    addAddress,
    checkout,
  };
};
