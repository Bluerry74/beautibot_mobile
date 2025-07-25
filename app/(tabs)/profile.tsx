import EditProfileModal from "@/components/Modal/EditProfileModal"; // đường dẫn tuỳ bạn
import { routesConfig } from "@/config/route";
import { useProfileActions } from "@/hooks/useProfileActions";
import { useAuthStore } from "@/store/auth";
import { IUserProfile } from "@/types/profile";
import translateSkinType from "@/utils/translate";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const Profile = () => {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const router = useRouter();
  const { getProfile, updateProfile } = useProfileActions(); // ✅ Gọi ở đây
  const [isEditVisible, setEditVisible] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setProfile(res);
      } catch (error) {
        console.error("❌ Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    profile?.email || "user"
  )}&background=random&size=128`;

  const logout = () => {
    useAuthStore.getState().logout();
    router.push("/");
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10">
      <View className="flex-row mt-4 items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ff9c86" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-center m-4 ">
          Trang cá nhân
        </Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Tài khoản",
              `Email: ${profile?.email}\nRole: ${profile?.role}`
            )
          }
        >
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#ff9c86"
          />
        </TouchableOpacity>
      </View>

      <View className="items-center mb-6 relative">
        <View className="relative">
          <Image
            source={{ uri: avatarUrl || "https://i.imgur.com/u6Wj80k.png" }}
            className="w-24 h-24 rounded-full"
          />
          <TouchableOpacity
            onPress={() => setEditVisible(true)}
            className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow"
          >
            <Ionicons name="create-outline" size={16} color="orange" />
          </TouchableOpacity>
        </View>
        <Text className="text-lg font-semibold mt-3">
          {profile?.name || "Đang tải..."}
        </Text>
        <Text className="text-gray-500">{profile?.email || ""}</Text>
        <Text className="text-gray-500">{profile?.phone || ""}</Text>
        <Text className="text-gray-500">
          {translateSkinType(profile?.skinType || "")}
        </Text>
      </View>

      <View className="border-t border-gray-200 mt-2">
        {[
          {
            label: "Đơn hàng của tôi",
            icon: "person-outline",
            route: routesConfig.trackinginfor,
          },
          { label: "Settings", icon: "settings-outline" },
          { label: "Extra Card", icon: "card-outline" },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            className="flex-row items-center py-4 border-b border-gray-200"
            onPress={() => {
              if (item.route) router.push(item.route);
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
      <EditProfileModal
        isVisible={isEditVisible}
        onClose={() => setEditVisible(false)}
        profile={profile}
        onSave={async (data) => {
          try {
            console.log("📤 Update data:", data);
            await updateProfile(data); // cập nhật xong...

            const newProfile = await getProfile(); // ...gọi lại API lấy profile mới
            setProfile(newProfile); // rồi mới cập nhật vào state
          } catch (err) {
            console.error("❌ Lỗi cập nhật thông tin:", err);
          }
        }}
      />

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
