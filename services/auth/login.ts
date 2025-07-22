import { get, post } from "@/httpservices/httpService";
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
    } catch (err: any) {
        console.log("Login error:", err?.response?.data || err.message || err);
        let message = "Lỗi đăng nhập";
        if (err?.response?.data?.message) {
            message = err.response.data.message;
            console.log(message);   
        }
        Toast.show({
            type: "error",
            text1: "Lỗi đăng nhập",
            text2: "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!",
        });
        throw err;
    }
};


export const sendVerifyEmail = async () => {
    const response = await post("/user/verify-email");
    return response.data;
};


export const sendVerifiedToken = async (token: string) => {
    const response = await get(`/user/verify-email/confirm?token=${encodeURIComponent(token)}`);
    return response.data;
};