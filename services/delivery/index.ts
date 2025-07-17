import { get, patch } from "@/httpservices/httpService";
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
export const getDeliveriesByCustomer = async (): Promise<IDelivery[]> => {
  const res = await get("/delivery/customer");
  return res.data as IDelivery[];
};