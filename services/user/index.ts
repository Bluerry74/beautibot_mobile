import { get } from "@/httpservices/httpService";
import { UserResponse } from "@/types/user";

export const getAllUser = async (filter = {}) => {
    const response = await get<UserResponse>("/user", {
        params: filter,
    });
    return response.data;
};




