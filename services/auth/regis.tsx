import { post } from "@/httpservices/httpService";
import { RegisterTypes } from "@/types/auth";

export const registerSystem = async (data: RegisterTypes) => {
    const res = await post("user/register", data);
    return res.data;
}