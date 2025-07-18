import { get, patch, post } from "@/httpservices/httpService";
import { ICreateDelivery, IDeliveryPersonnelResponse } from "@/types/delivery";
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

export const getDeliveries = async (params: { page: number; limit: number; status?: string }) => {
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

// Get all delivery personnel (admin only)
export const getDeliveryPersonnel = async (params?: {
  page?: number;
  limit?: number;
  email?: string;
  name?: string;
  phone?: string;
}): Promise<IDeliveryPersonnelResponse> => {
  const res = await get("delivery/admin/delivery-personnel", { params });
  return res.data as IDeliveryPersonnelResponse;
};