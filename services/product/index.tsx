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
export const createSku = (payload: any) => {
    return post("/sku", payload).then((res) => res.data);
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

export const getAllSkinTypesFromProducts = async () => {
    const res = await get<IProductResponse>("product");

    if (!res.data || !Array.isArray(res.data.data)) {
        console.error("❌ API trả về sai định dạng:", res.data.data);
        return [];
    }

    const skinTypes = res.data.data.flatMap(
        (product) => product.suitableForSkinTypes || []
    );

    const uniqueSkinTypes = Array.from(new Set(skinTypes));
    return uniqueSkinTypes;
};

export const uploadSkuImages = (skuId: string, files: any[]) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append("files", {
            uri: file.uri,
            type: file.type,
            name: file.name,
        } as any);
    });
    return post(`/sku/${skuId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const deleteSkuImageByIndex = (skuId: string, index: number) => {
    return remove(`/sku/${skuId}/images/${index}`);
};

export const replaceSkuImage = (skuId: string, index: number, file: any) => {
    const formData = new FormData();
    formData.append("file", {
        uri: file.uri,
        type: file.type,
        name: file.name,
    } as any);
    return patch(`/sku/${skuId}/images/${index}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};
