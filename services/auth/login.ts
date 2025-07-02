import { post } from "@/httpservices/httpService";
export const loginSystem = async (
    email: string,
    password: string
): Promise<any> => {
    try {
        console.log("LoginSystem called with:", { email, password });
        const res = await post("user/login", { email, password });
        console.log(res);
        return res.data;
    } catch (e: any) {
        console.log("LoginSystem error", {
            message: e.message,
            response: e.response?.data,
            status: e.response?.status,
            isAxiosError: e.isAxiosError,
        });
    }
};
