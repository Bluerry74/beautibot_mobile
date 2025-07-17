import { get, patch, post } from "@/httpservices/httpService";
import { ICreateDelivery } from "@/types/delivery";
import { IDelivery } from "@/types/order";
export const uploadProof = async (imageUri: string, deliveryId: string) => {
  const formData = new FormData();
  formData.append("file", {
    uri: imageUri,
    name: "proof.jpg",
    type: "image/jpeg",
  } as any);

  const res = await patch(`delivery/${deliveryId}/proof`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateDeliveryStatus = async (deliveryId: string, status: string) => {
  const res = await patch(`delivery/${deliveryId}/status`, { status });
  return res.data;
}

export const getDeliveries = async (params: { page: number; limit: number }) => {
  const res = await get("delivery", { params });
  return res.data;
};

export const assignDeliveryPersonnel = async (deliveryId: string, deliveryPersonnelId: string) => {
  const res = await patch(`delivery/${deliveryId}/assign`, { deliveryPersonnelId });
  return res.data;
};

export const createDelivery = async (data: ICreateDelivery) => {
  const res = await post("delivery", data);
  return res.data;
};

export const getDeliveryDetail = async (deliveryId: string) => {
  const res = await get(`delivery/${deliveryId}`);
  return res.data;
};
export const getDeliveriesByCustomer = async (): Promise<IDelivery[]> => {
  const res = await get("/delivery/customer");
  return res.data as IDelivery[];
};