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
