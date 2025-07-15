import { patch } from "@/httpservices/httpService";

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
