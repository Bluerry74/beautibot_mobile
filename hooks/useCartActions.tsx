// hooks/useCartActions.ts
import { CartItem, IAddress, Sku } from "@/app/types/product";
import axios from "axios";

const API = "https://be-wdp.onrender.com";

export const useCartActions = () => {
  const addToCart = async (sku: Sku) => {
    // build payload theo đúng schema backend
    const payload = {
      skuId: sku._id,
      productId: sku.productId,
      skuName: sku.variantName,
      priceSnapshot: sku.price,  // lấy giá hiện tại từ sku.price
      quantity: 1,
    };
    console.log("Adding to cart payload:", payload);
    const res = await axios.post(`${API}/cart/item`, payload);
    return res.data;
  };

  const removeFromCart = async (skuId: string) => {
    await axios.delete(`${API}/cart/item`, { data: { skuId } });
  };

  const updateQuantity = async (
    skuId: string,
    productId: string,
    quantity: number
  ) => {
    await axios.patch(`${API}/cart/item/quantity`, {
      skuId,
      productId,
      quantity,
    });
  };


  const getCart = async (): Promise<CartItem[]> => {
    const res = await axios.get(`${API}/cart`);
    console.log("📥 /cart response:", res.data);
    // Nếu backend trả mảng ngay trong res.data, hoặc trong res.data.data
    return res.data.data ?? res.data;
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
