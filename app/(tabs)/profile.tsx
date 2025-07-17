import { routesConfig } from "@/config/route";
import { get } from "@/httpservices/httpService";
import { useAuthStore } from "@/store/auth";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
  const logout = () => {
    useAuthStore.getState().logout();
    router.push("/");
  };
  const router = useRouter();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await get("/user/profile");
        const data = response.data;
        setUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    userProfile?.email
  )}&background=random&size=128`;

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10 ">
      <View className="flex-row mt-4 items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-center mb-4 ">
          Trang cá nhân
        </Text>
        <TouchableOpacity
                    onPress={() =>
                      Alert.alert("Tài khoản", `Email: ${userProfile.email}\nRole: ${userProfile.role}`)
                    }
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
      </View>

      <View className="items-center mb-6 relative">
        <Image source={{ uri: avatarUrl }} className="w-24 h-24 rounded-full" />
        <TouchableOpacity className="absolute bottom-0 right-[35%] bg-white p-1 rounded-full">
          <Ionicons name="camera" size={16} color="orange" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold mt-3">{userProfile?.email}</Text>
      </View>
      <View className="border-t border-gray-200 mt-2">
        {[
          {
            label: "Đơn hàng của tôi",
            icon: "cube-outline",
            route: routesConfig.trackinginfor,
          },
          { label: "Cài đặt", icon: "settings-outline" },
          { label: "Extra card", icon: "card-outline" },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            className="flex-row items-center py-4 border-b border-gray-200"
            onPress={() => {
              if (item.route) {
                router.push(item.route);
              }
            }}
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              color="gray"
              className="mr-4"
            />
            <Text className="flex-1 text-base text-gray-800">{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
        ))}
      </View>
      <View className="border-t border-gray-200 mt-4">
        {[
          { label: "Trung tâm hỗ trợ", icon: "information-circle-outline" },
          { label: "Yêu cầu xóa tài khoản", icon: "trash-outline" },
          { label: "Thêm một tài khoản khác", icon: "person-add-outline" },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            className="flex-row items-center py-4 border-b border-gray-200"
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              className="mr-4 text-gray-700"
            />
            <Text className="flex-1 text-base">{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        className="mt-6 border border-red-400 rounded-full py-3 flex-row items-center justify-center"
        onPress={logout}
      >
        <MaterialIcons name="logout" size={20} color="red" />
        <Text className="text-red-500 ml-2 font-semibold">Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;
