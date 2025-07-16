import { get, patch, post, remove } from "@/httpservices/httpService";
import {
    IProductCreatePayload,
    IProductDetail,
    IProductResponse,
} from "@/types/product";

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

export const createProduct = async (payload: IProductCreatePayload) => {
    const res = await post(`/product`, payload);
    return res.data;
};

export const updateProduct = async ({
    id,
    payload,
}: {
    id: string;
    payload: any;
}) => {
    const res = await patch(`/products/${id}`, payload);
    return res.data;
};

export const updateSku = async ({
    id,
    payload,
}: {
    id: string;
    payload: any;
}) => {
    const res = await patch(`/skus/${id}`, payload);
    return res.data;
};

export const deleteSku = async (id: string) => {
    const res = await remove(`/skus/${id}`);
    return res.data;
};
