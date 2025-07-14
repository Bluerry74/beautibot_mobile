import { routesConfig } from "@/config/route";
import { yupResolver } from "@hookform/resolvers/yup";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Provider as PaperProvider } from "react-native-paper";
import * as yup from "yup";
import { getMe } from "../services/auth/getMe";
import { loginSystem } from "../services/auth/login";
import { useAuthStore } from "../store/auth";

const { width } = Dimensions.get("window");

const schema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ!").required("Vui lòng nhập email!"),
  password: yup.string().min(6, "Mật khẩu tối thiểu 6 ký tự!").required("Vui lòng nhập mật khẩu!"),
});

export default function Index() {
  const { setTokens, setUser } = useAuthStore();
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const res = await loginSystem(data.email, data.password);
      console.log("Login response:", res);
      if (!res) throw new Error("Login failed");
      const me = await getMe({ accessToken: res.accessToken });
      setTokens({
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      });
      setUser({
        email: me.email || "",
        fullname: me.fullname || "",
        role: me.role || "",
        avatar: me.avatar || "",
      });
      if (me.role === "admin") {
        router.push(routesConfig.admin.dashboard);
        return
      }
      if (me.role === "delivery") {
        router.push(routesConfig.delivery.tracking);
        return
      }
      if (me.role === "user") {
        router.push(routesConfig.home);
        return
      }

    } catch (err: any) {
      console.log("Login error:", err);
    }
  };

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: "#fbf1eb" }}>
        <Image
          source={require("../assets/images/banner_login.jpg")}
          contentFit="cover"
          style={StyleSheet.absoluteFillObject}
          blurRadius={2}
        />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{
            borderRadius: 20,
            backgroundColor: "#fff",
            padding: 20,
            width: width * 0.9,
            elevation: 5,
          }}>
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#c2185b", textAlign: "center" }}>
              Đăng nhập tài khoản
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 8, color: "#f06292", textAlign: "center" }}>
              Nhập thông tin để đăng nhập.
            </Text>
            <View style={{ marginBottom: 16, marginTop: 16 }}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }: { field: { onChange: (value: string) => void; value: string } }) => (
                  <TextInput
                    placeholder="Nhập email của bạn"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.input}
                  />
                )}
              />
              {errors.email && <Text style={{ color: "red" }}>{errors.email.message}</Text>}
            </View>
            <View style={{ marginBottom: 16 }}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }: { field: { onChange: (value: string) => void; value: string } }) => (
                  <View style={{ position: "relative" }}>
                    <TextInput
                      placeholder="Nhập mật khẩu"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPassword}
                      style={styles.input}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowPassword((v: boolean) => !v)}
                    >
                      <Text style={{ color: "#999", fontSize: 16 }}>
                        {showPassword ? "🙈" : "👁️"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && <Text style={{ color: "red" }}>{errors.password.message}</Text>}
            </View>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={{
                backgroundColor: "#ff9c86",
                borderRadius: 20,
                marginTop: 10,
                marginLeft: 20,
                marginRight: 20,
              }}
              labelStyle={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}
              contentStyle={{ paddingVertical: 8 }}
            >
              Đăng nhập
            </Button>
            <View style={styles.bottomTextRow}>
              <Text style={styles.bottomText}>Chưa có tài khoản? </Text>
              <Text
                style={styles.registerText}
                onPress={() => {
                  router.push("/pages/register");
                }}
              >
                Đăng ký ngay
              </Text>
            </View>
          </View>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  eyeButton: {
    position: "absolute",
    right: 10,
    top: 12,
    padding: 4,
    zIndex: 1,
  },
  bottomText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
  registerText: {
    fontWeight: "600",
    color: "#ff9c86",
  },
  bottomTextRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
});
