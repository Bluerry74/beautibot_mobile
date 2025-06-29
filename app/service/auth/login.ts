import { post } from "@/app/httpservices/httpService";

export const loginSystem = async (email: string, password: string) => {
    try {
        const res = await post("user/login", { email, password });
        return res.data;
    } catch (e: any) {
        console.log("LoginSystem error", e.message || e);
        throw e;
    }
};
