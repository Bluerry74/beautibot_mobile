import { get } from "@/app/httpservices/httpService";
import { User } from "@/app/types/auth";

export const getMe = async (): Promise<User> => {
  const res = await get<User>("user/me");
  return res.data;
};