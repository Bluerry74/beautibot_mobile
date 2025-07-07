import { Image } from "expo-image";
import { router } from "expo-router";
import { EyeOff } from "lucide-react-native";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

export default function Register() {
  return (
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
            Create your account
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "600", marginTop: 8, color: "#f06292", textAlign: "center" }}>
            Fill in your details to sign up.
          </Text>
          <View className="mb-4 mx-4 mt-4">
            <Text className="text-lg text-gray-600 mb-1" style={{ color: "#ff9c86" }}>
              Email Address
            </Text>
            <TextInput
              placeholder="you@example.com"
              className="border border-gray-300 rounded-xl px-4 py-3 text-lg"
              keyboardType="email-address"
              style={{ color: "#ff9c86" }}
            />
          </View>

          <View className="mb-4 mx-4">
            <Text className="text-lg text-gray-600 mb-1" style={{ color: "#ff9c86" }}>
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
          </View>

          <View className="mb-4 mx-4">
            <Text className="text-lg text-gray-600 mb-1" style={{ color: "#ff9c86" }}>
              Confirm Password
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-xl px-4">
              <TextInput
                placeholder="********"
                className="flex-1 py-3 text-lg"
                secureTextEntry={true}
              />
              <EyeOff size={20} color="#999" />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              router.push("/");
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
            <Text className="text-lg text-bold text-white text-center">Register</Text>
          </TouchableOpacity>

          <Text className="text-center text-base text-gray-600 mt-4">
            Already have an account?{" "}
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={{ color: "#ff9c86" }} className="font-semibold">
                Login
              </Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </View>
  );
}
