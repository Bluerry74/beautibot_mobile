import { useRegisterMutation } from "@/tanstack/user/regis";
import { RegisterTypes } from "@/types/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Provider as PaperProvider } from "react-native-paper";
import * as yup from "yup";

const { width } = Dimensions.get("window");

const schema = yup.object().shape({
  email: yup.string().email("Email không hợp lệ!").required("Vui lòng nhập email!"),
  password: yup.string().min(6, "Mật khẩu tối thiểu 6 ký tự!").required("Vui lòng nhập mật khẩu!"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Mật khẩu xác nhận không khớp!")
    .required("Vui lòng xác nhận mật khẩu!"),
});

export default function Register() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const { mutate: register, isPending } = useRegisterMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (data: RegisterTypes) => {
    register({ email: data.email, password: data.password });
  };

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: "#fbf1eb" }}>
        <Image
          source={require("../../assets/images/OIP.jpg")}
          contentFit="cover"
          style={StyleSheet.absoluteFillObject}
          blurRadius={2}
        />

        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              borderRadius: 20,
              backgroundColor: "#fff",
              padding: 20,
              width: width * 0.9,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#c2185b", textAlign: "center" }}>
              Tạo tài khoản mới
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 8, color: "#f06292", textAlign: "center" }}>
              Điền thông tin để đăng ký.
            </Text>
            <View style={{ marginBottom: 16, marginTop: 16 }}>
              <Text style={{ fontSize: 16, color: "#ff9c86", marginBottom: 4 }}>
                Email
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }: { field: { onChange: (value: string) => void; value: string } }) => (
                  <TextInput
                    placeholder="Nhập email của bạn"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 10,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      fontSize: 16,
                      color: "#333",
                    }}
                  />
                )}
              />
              {errors.email && <Text style={{ color: "red" }}>{errors.email.message}</Text>}
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: "#ff9c86", marginBottom: 4 }}>
                Mật khẩu
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 12 }}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }: { field: { onChange: (value: string) => void; value: string } }) => (
                    <TextInput
                      placeholder="Nhập mật khẩu"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPassword}
                      style={{ flex: 1, paddingVertical: 10, fontSize: 16, color: "#333" }}
                    />
                  )}
                />
                <TouchableOpacity onPress={() => setShowPassword((v: boolean) => !v)}>
                  {showPassword ? <Eye size={20} color="#999" /> : <EyeOff size={20} color="#999" />}
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={{ color: "red" }}>{errors.password.message}</Text>}
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontSize: 16, color: "#ff9c86", marginBottom: 4 }}>
                Xác nhận mật khẩu
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 12 }}>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }: { field: { onChange: (value: string) => void; value: string } }) => (
                    <TextInput
                      placeholder="Nhập lại mật khẩu"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showConfirmPassword}
                      style={{ flex: 1, paddingVertical: 10, fontSize: 16, color: "#333" }}
                    />
                  )}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword((v: boolean) => !v)}>
                  {showConfirmPassword ? <Eye size={20} color="#999" /> : <EyeOff size={20} color="#999" />}
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={{ color: "red" }}>{errors.confirmPassword.message}</Text>}
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              disabled={isPending}
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
              Đăng ký
            </Button>

            <Text style={{ textAlign: "center", fontSize: 16, color: "#666", marginTop: 16 }}>
              Đã có tài khoản?{' '}
              <TouchableOpacity onPress={() => router.push("/")}> 
                <Text style={{ color: "#ff9c86", fontWeight: "600" }}>Đăng nhập</Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </View>
    </PaperProvider>
  );
}
