import { View, Text, ScrollView, Linking, TouchableOpacity } from "react-native"
import { CheckCircle, Clock, AlertTriangle, Phone, Navigation, QrCode, Truck, MessageSquare } from "lucide-react-native"
import { useEffect, useState } from "react"
import { get } from "@/httpservices/httpService";

export default function ShipperDashboard() {
  const deliveryList = [
    {
      id: "VN123456789",
      recipient: "Nguyễn Văn A",
      address: "123 Đường ABC, P.XYZ, Q.7, TP.HCM",
      phone: "0901234567",
      status: "delivering",
      cod: "500,000đ",
      estimatedTime: "10:30 - 11:00",
      distance: "2.5km",
    },
    {
      id: "VN987654321",
      recipient: "Trần Thị B",
      address: "456 Đường DEF, P.GHI, Q.1, TP.HCM",
      phone: "0907654321",
      status: "pending",
      cod: "0đ",
      estimatedTime: "11:30 - 12:00",
      distance: "1.8km",
    },
  ]
  const [deliveryLisT, setDeliveryList] = useState([]);
  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const response = await get("/delivery/customer"); 
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
      case "completed":
        return "Đã giao"
      case "delivering":
        return "Đang giao"
      case "pending":
      default:
        return "Chờ xác nhận"
    }
  }

  return (
    <ScrollView className="bg-gray-50 flex-1">
      <View className="bg-blue-600 px-4 py-4" style={{ backgroundColor: "#ff9c86" }}>
        <Text className="text-white text-2xl font-semibold mt-8">TẤT CẢ ĐƠN HÀNG</Text>
      </View>

      <View className="px-4 space-y-4">
        {deliveryList.map((item) => (
          <View key={item.id} className="p-4 bg-white rounded-lg shadow border space-y-2 mt-4">
            <Text className="text-base font-semibold">{item.recipient}</Text>
            <Text className="text-sm text-gray-600">{item.address}</Text>
            <Text className="text-sm text-gray-500">
              {item.estimatedTime} - {item.distance} - COD: {item.cod}
            </Text>
            <Text className="text-xs text-blue-600 font-semibold">{getStatusText(item.status)}</Text>

            <View className="flex-row gap-2 mt-2">
              <TouchableOpacity
                className="flex-1 bg-white border border-gray-300 px-3 py-2 rounded flex-row items-center justify-center"
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
              >
                {/* <Phone size={16} className="mr-2" /> */}
                <Text>Thông tin chi tiết</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-white border border-gray-300 px-3 py-2 rounded flex-row items-center justify-center"
                onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(item.address)}`)}
              >
                {/* <Navigation size={16} className="mr-2" /> */}
                <Text>Nhận đơn hàng</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
