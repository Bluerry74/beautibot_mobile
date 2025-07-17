import { get } from "@/httpservices/httpService";
import { GetAllUserPagiParams, UserResponse } from "@/types/user";

export const getAllUser = async (filter = {}) => {
    const response = await get<UserResponse>("/user", {
        params: filter,
    });
    return response.data;
};

export const getAllUserPagination = async (params: GetAllUserPagiParams = {}) => {
  const response = await get<UserResponse>('/user', { params });
  return response.data;
};


