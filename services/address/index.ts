import { get } from "@/httpservices/httpService";
import { ShippingAddress } from "@/types/address";

export const getAllAddress = async (): Promise<ShippingAddress[]> => {
    const response = await get<ShippingAddress[]>("/address/admin/all");
    return response.data;
};
