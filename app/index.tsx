import { Image } from "expo-image";
import { router } from "expo-router";
import { EyeOff } from "lucide-react-native";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
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
      <View
        className="mx-4rounded-2xl bg-white absolute inset-10 p-2 "
        style={{ borderRadius: 20, marginTop: 350, height: 350 }}
      >
        <View className="mb-4 mx-4 mt-6">
          <Text
            className="text-lg text-gray-600 mb-1"
            style={{ color: "#ff9c86" }}
          >
            Email Address
          </Text>
          <TextInput
            placeholder="hoainguyenky532003@gmail.com"
            className="border border-gray-300 rounded-xl px-4 py-3 text-lg"
            keyboardType="email-address"
            style={{ color: "#ff9c86" }}
          />
        </View>
        <View className="mb-4 mx-4">
          <Text
            className="text-lg text-gray-600 mb-1"
            style={{ color: "#ff9c86" }}
          >
            Password
          </Text>
          <View className="flex-row items-center border border-gray-300 rounded-xl px-4">
            <TextInput
              placeholder="********"
              className="flex-1 py-3 text-lg"
              secureTextEntry={true}
            />
            <EyeOff size={20} color="#999" />
          </View>
          <TouchableOpacity className="mt-2">
            <Text className="text-right text-base text-gray-500">
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => {
            router.push("/home");
          }}
          style={{
            backgroundColor: "#ff9c86",
            padding: 10,
            borderRadius: 20,
            marginTop: 10,
            marginLeft: 20,
            marginRight: 20,
          }}
        >
          <Text className="text-lg text-bold text-white text-center">
            Login
          </Text>
        </TouchableOpacity>
        <Text className="text-center text-base text-gray-600 mt-4">
          Don’t have an account?{" "}
          <TouchableOpacity onPress={() => router.push("/pages/register")}>
            <Text
              className="text-[#5D2C1D] font-semibold"
              style={{ color: "#ff9c86" }}
            >
              Register Now
            </Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}
