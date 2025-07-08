import { post } from "@/httpservices/httpService";
import { useAuthStore } from "@/store/auth";
import { User } from "@/types/auth";
import Toast from "react-native-toast-message";

export const loginSystem = async (
    email: string,
    password: string
): Promise<any> => {
    try {
        console.log("LoginSystem called with:", { email, password });
        const res = await post("user/login", { email, password });
        console.log(res);
        const user = res.data as User;
        useAuthStore.getState().setTokens({
            accessToken: user.accessToken || "",
            refreshToken: user.refreshToken || "",
            role: user.role || "",
        });
        useAuthStore.getState().setUser({
            email: user.email || "",
            fullname: user.fullname || "",
            role: user.role || "",
            avatar: user.avatar || "",
        });
        return res.data;
    } catch (e: any) {
        console.log("LoginSystem error", {
            message: e.message,
            response: e.response?.data,
            status: e.response?.status,
            isAxiosError: e.isAxiosError,
        });
        let message = "Lỗi đăng nhập";
        if (e?.response?.data?.message) {
            message = e.response.data.message;
            console.log(message);   
        }
        Toast.show({
            type: "error",
            text1: "Lỗi đăng nhập",
            text2: "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!",
        });
    }
};




