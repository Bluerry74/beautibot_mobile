// hooks/useCartActions.ts
import { CartItem, CheckoutResponse, IAddress, Sku } from "@/app/types/product";
import { useAuthStore } from "@/store/auth";
import axios from "axios";
const API = "https://be-wdp.onrender.com";
export const useCartActions = () => {
  const token = useAuthStore.getState().accessToken;
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const addToCart = async (sku: Sku) => {
    const payload = {
      skuId: sku._id,
      productId: sku.productId,
      skuName: sku.variantName,
      priceSnapshot: sku.price,
      quantity: 1,
    };
    console.log("Adding to cart payload:", payload);
    const res = await axios.post(`${API}/cart/item`, payload, authHeader);
    return res.data;
  };

  const removeFromCart = async (skuId: string, productId: string) => {
    await axios.delete(`${API}/cart/item`, {
      data: { skuId, productId },
      ...authHeader,
    });
  };

  const updateQuantity = async (
    skuId: string,
    productId: string,
    quantity: number
  ) => {
    await axios.patch(
      `${API}/cart/item/quantity`,
      { skuId, productId, quantity },
      authHeader
    );
  };

  const getCart = async (): Promise<CartItem[]> => {
    const res = await axios.get(`${API}/cart`, authHeader);
    console.log("📥 /cart response:", res.data);
    return res.data.data ?? res.data;
  };

  const getAddresses = async (): Promise<IAddress[]> => {
    const res = await axios.get(`${API}/address`, authHeader);
    console.log("📦 Địa chỉ nhận được:", res.data);
    return res.data.data ?? res.data;
  };


  const addAddress = async (addr: Omit<IAddress, "_id" | "__v">) => {
    await axios.post(`${API}/address`, addr, authHeader);
  };
  const checkout = async (
    addressId: string,
    couponCode: string = ""
  ): Promise<CheckoutResponse> => {
    const res = await axios.post(`${API}/checkout`, { addressId, couponCode }, authHeader);
    return res.data;
  };
  const getMyCoupons = async (): Promise<string[]> => {
    const res = await axios.get(`${API}/coupon/my-coupons`, authHeader);
    return res.data?.data?.map((c: any) => c.code) || [];
  };
  
  return {
    addToCart,
    removeFromCart,
    updateQuantity,
    getCart,
    getAddresses,
    addAddress,
    checkout,
    getMyCoupons
  };
};
