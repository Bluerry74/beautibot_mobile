import { View, Text, ScrollView, Linking, TouchableOpacity } from "react-native"
import {  Phone, Navigation } from "lucide-react-native"
import { useEffect, useState } from "react"
import { get } from "@/httpservices/httpService";
import { router } from "expo-router";

export default function ShipperDashboard() {
  const [deliveryList, setDeliveryList] = useState([]);
  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await get("/delivery/personnel"); 
        const data = response.data.data;
        setDeliveryList(data);
        console.log("Delivery data fetched successfully:", data);
      } catch (error) {
        console.error("Error fetching delivery data:", error);
      }
    }
    fetchDeliveryData();
  }, [])

  const getStatusText = (status: string) => {
   switch (status) {
      case "processing":
        return "Đang xử lý đơn hàng";
      case "assigned":
        return "Đã sắp xếp người giao hàng";
      case "out_for_delivery":
        return "Đang trên đường giao hàng";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã huỷ";
      case "failed":
        return "Giao hàng thất bại";
      default:
        return "Chờ xác nhận";
    }
  }


  return (
    <ScrollView className="bg-gray-50 flex-1">
      <View className="bg-blue-600 px-4 py-4" style={{ backgroundColor: "#ff9c86" }}>
        <Text className="text-white text-2xl font-semibold mt-8">TẤT CẢ ĐƠN HÀNG</Text>
      </View>

      <View className="px-4 space-y-4">
        {deliveryList
        // .filter(item => item.status === "pending" || item.status === "delivering")
        .map((item : any) => (
          <TouchableOpacity 
          key={item._id} 
          onPress={() => router.push(`/detail/delivery-detail/${item._id}`)}
          className="p-4 bg-white rounded-lg shadow border space-y-2 mt-4">
            <Text className="text-lg font-semibold">{item.shippingAddress.fullName}</Text>
            <Text className="text-base text-gray-600">{item.shippingAddress.street}, {item.shippingAddress.city}, {item.shippingAddress.country}</Text>
            <Text className="text-base text-gray-500">
              Mã vận đơn: <Text className="font-semibold">{item.trackingNumber}</Text>
            </Text>
            <Text className="text-base text-gray-500">
              Phí giao hàng: <Text className="font-semibold">{item.deliveryFee} VND</Text>
            </Text>
            <Text className="text-xl text-blue-600 font-semibold">{getStatusText(item.status)}</Text>
          </TouchableOpacity>
        ))}
        {deliveryList.length === 0 && (
          <Text className="text-gray-500 text-center mt-8">Không có đơn hàng nào.</Text>
        )}
      </View>
    </ScrollView>
  )
}
