import { routesConfig } from '@/config/route'
import { useAuthStore } from '@/store/auth'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useRouter, } from 'expo-router'
import { History } from 'lucide-react-native'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

const Profile = () => {
  const logout = () => {  
    useAuthStore.getState().logout();
    router.push("/");
  }
 const router = useRouter()

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10 ">
     <Text className="text-xl font-bold text-center mb-4 mt-5">Profile</Text>

      <View className="items-center mb-6 relative">
        <Image
          source={{ uri: "https://i.imgur.com/u6Wj80k.png" }}
          className="w-24 h-24 rounded-full"
        />
        <TouchableOpacity className="absolute bottom-0 right-[35%] bg-white p-1 rounded-full">
          <Ionicons name="camera" size={16} color="orange" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold mt-3">Delivery</Text>
      </View>
      <View className="border-t border-gray-200 mt-2">
  {[
    { label: 'History', icon: 'refresh-outline', route: routesConfig.tracking },
    { label: 'Settings', icon: 'settings-outline' },
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
      <Ionicons name={item.icon as any} size={20} color="gray" />
      <Text className="flex-1 text-base text-gray-800 ml-4">{item.label}</Text>
      <Ionicons name="chevron-forward" size={20} color="gray" />
    </TouchableOpacity>
  ))}
</View>
       <View className="border-t border-gray-200 mt-4">
        {[
          { label: "Help Center", icon: "information-circle-outline" },
          { label: "Request Account Deletion", icon: "trash-outline" },
        ].map((item, i) => (
          <TouchableOpacity key={i} className="flex-row items-center py-4 border-b border-gray-200">
            <Ionicons name={item.icon as any} size={20} className="mr-4 text-gray-700" />
            <Text className="flex-1 text-base">{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="gray" />
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity className="mt-6 border border-red-400 rounded-full py-3 flex-row items-center justify-center" onPress={logout}>
        <MaterialIcons name="logout" size={20} color="red" />
        <Text className="text-red-500 ml-2 font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default Profile