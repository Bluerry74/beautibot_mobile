import { get } from "@/httpservices/httpService";
import { IProductDetail, IProductResponse } from "@/types/product";

export const getAllProducts = async (filters = {}) => {
    const res = await get<IProductResponse>("product", {
        params: filters,
    });
    return res.data;
};
export const getProductDetail = async (id: string) => {
    const res = await get<IProductDetail>(`/product/${id}`);
    return res.data;
};

export const getAllSkinTypesFromProducts = async () => {
    const res = await get<IProductResponse>('product');
  
    if (!res.data || !Array.isArray(res.data.data)) {
      console.error('❌ API trả về sai định dạng:', res.data.data);
      return [];
    }
  
    const skinTypes = res.data.data.flatMap(
      (product) => product.suitableForSkinTypes || []
    );
  
    const uniqueSkinTypes = Array.from(new Set(skinTypes));
    return uniqueSkinTypes;
  };