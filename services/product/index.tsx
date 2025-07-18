import { get, patch, post, remove } from "@/httpservices/httpService";
import {
  IProductCreatePayload,
  IProductDetail,
  IProductResponse,
} from "@/types/product";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
const resizeAndConvertToBase64 = async (uri: string) => {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 300 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  const base64 = await FileSystem.readAsStringAsync(manipulated.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  console.log("Base64 length:", base64.length);
  return base64;
};

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
  const res = await patch(`/sku/${id}`, payload);
  return res.data;
};

export const deleteSku = async (id: string) => {
  const res = await remove(`/sku/${id}`);
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

export const uploadSkuImages = async (skuId: string, files: any[]) => {
  const base64Files = await Promise.all(
    files.map(async (file) => {
      return await resizeAndConvertToBase64(file.uri);
    })
  );
  return post(`/sku/${skuId}/images`, { files: base64Files });  
};

const convertToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const deleteSkuImageByIndex = (skuId: string, index: number) => {
  return remove(`/sku/${skuId}/images/${index}`);
};

export const replaceSkuImage = async (
  skuId: string,
  index: number,
  file: any
) => {
  const manipulated = await ImageManipulator.manipulateAsync(
    file.uri,
    [{ resize: { width: 300 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );

  const formData = new FormData();
  formData.append("file", {
    uri: manipulated.uri,
    type: file.type ?? "image/jpeg",
    name: file.name ?? `image-${Date.now()}.jpg`,
  } as any);

  return patch(`/sku/${skuId}/images/${index}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

