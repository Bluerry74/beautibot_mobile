import AppForm from "@/components/core/AppForm";
import { Image } from "expo-image";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../components/context/AuthContext";
import { getMe } from "../services/auth/getMe";
import { loginSystem } from "../services/auth/login";
import { FormInputType } from "../types/formInput";
const fields = [
    {
        name: "email",
        placeholder: "Enter your email",
        fieldType: FormInputType.TEXT,
        defaultValue: "",
        rules: { required: "Email is required" },
        label: "Email Address",
    },
    {
        name: "password",
        placeholder: "Enter your password",
        fieldType: FormInputType.PASSWORD,
        defaultValue: "",
        rules: { required: "Password is required" },
        label: "Password",
    },
];

export default function Index() {
    const { login } = useAuth();
    const handleLogin = async (data: any) => {
        try {
            console.log("data:", data);
            
            const res = await loginSystem(data.email, data.password);
            console.log("response", res);
            if (!res) throw new Error("Login failed");
            const me = await getMe({
                accessToken: res.accessToken,
            });
            console.log("User data", me);
            login({
                user: me,
                accessToken: res.accessToken,
                refreshToken: res.refreshToken,
            })
        } catch (err: any) {
            console.log(
                "Login failed",
                err?.response?.data || err.message || err
            );
        }
    };
    return (
        <View style={{ flex: 1, backgroundColor: "#fbf1eb" }}>
            <View className="h-3/5 relative justify-end">
                <Image
                    source={require("../assets/images/banner_login.jpg")}
                    contentFit="cover"
                    style={{ borderRadius: 10, width: "100%", height: "100%" }}
                />
                <View className="absolute inset-0 justify-center items-center px-4">
                    <Text className="text-4xl font-bold text-white text-center">
                        Let’s get you Login!
                    </Text>
                    <Text className="text-lg font-semibold mt-2 text-white text-center">
                        Enter your information below.
                    </Text>
                </View>
            </View>
            <View style={styles.container}>
                <AppForm
                    items={fields}
                    onSubmit={handleLogin}
                    btnText="Login"
                />
                <Text style={styles.bottomText}>
                    Don’t have an account?{" "}
                    <TouchableOpacity
                        onPress={() => router.push("/pages/register")}
                    >
                        <Text style={styles.registerText}>Register Now</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        backgroundColor: "#fff",
        padding: 10,
        marginHorizontal: 16,
        marginTop: 350,
        height: 350,
        position: "absolute",
        left: 0,
        right: 0,
    },
    bottomText: {
        textAlign: "center",
        fontSize: 16,
        color: "#666",
        marginTop: 12,
    },
    registerText: {
        fontWeight: "600",
        color: "#ff9c86",
    },
});
