import { View, Text, ScrollView, Linking, TouchableOpacity } from "react-native"
import { CheckCircle, Clock, AlertTriangle, Phone, Navigation, QrCode, Truck, MessageSquare } from "lucide-react-native"
import React from "react"

const OrderActive = () => {
  const deliveryList = [
    {
      id: "VN123456789",
      recipient: "Nguyễn Thi Thu Hoai",
      address: "123 Đường ABC, P.XYZ, Q.7, TP.HCM",
      phone: "0901234567",
      status: "delivering",
      cod: "500,000đ",
      estimatedTime: "10:30 - 11:00",
      distance: "2.5km",
    },
    {
      id: "VN987654321",
      recipient: "Trần Nguyen Ky",
      address: "456 Đường DEF, P.GHI, Q.1, TP.HCM",
      phone: "0907654321",
      status: "pending",
      cod: "0đ",
      estimatedTime: "11:30 - 12:00",
      distance: "1.8km",
    },
  ]

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Đã giao"
      case "delivering":
        return "Đang giao"
      case "pending":
      default:
        return "Chờ giao"
    }
  }

  return (
    <ScrollView className="bg-gray-50 flex-1">
      <View className="bg-blue-600 px-4 py-4" style={{ backgroundColor: "#ff9c86" }}>
        <Text className="text-white text-2xl font-semibold mt-8">ĐƠN HÀNG CỦA BẠN GIAO</Text>
      </View>
      <View className="px-4 py-4 flex-row justify-between">
        <View className="w-[30%] items-center p-3 bg-white rounded-lg shadow border">
          <CheckCircle size={24} color="#16a34a" />
          <Text className="text-green-600 text-lg font-bold">8</Text>
          <Text className="text-xs text-gray-600">Đã giao</Text>
        </View>
        <View className="w-[30%] items-center p-3 bg-white rounded-lg shadow border">
          <Clock size={24} color="#2563eb" />
          <Text className="text-blue-600 text-lg font-bold">4</Text>
          <Text className="text-xs text-gray-600">Đang giao</Text>
        </View>
        <View className="w-[30%] items-center p-3 bg-white rounded-lg shadow border">
          <AlertTriangle size={24} color="#dc2626" />
          <Text className="text-red-600 text-lg font-bold">0</Text>
          <Text className="text-xs text-gray-600">Thất bại</Text>
        </View>
      </View>

      <View className="px-4 space-y-4">
        {deliveryList.map((item) => (
          <View key={item.id} className="p-4 bg-white rounded-lg shadow border space-y-2">
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
                <Phone size={16} className="mr-2" />
                <Text>Gọi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-white border border-gray-300 px-3 py-2 rounded flex-row items-center justify-center"
                onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(item.address)}`)}
              >
                <Navigation size={16} className="mr-2" />
                <Text>Chỉ đường</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View className="px-4 mt-6 space-y-3">
        <View className="p-4 bg-white rounded-lg shadow border space-y-2">
          <TouchableOpacity className="flex-row items-center gap-2">
            <QrCode size={18} />
            <Text>Quét mã vận đơn</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-2">
            <Truck size={18} />
            <Text>Báo cáo sự cố xe</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-2">
            <MessageSquare size={18} />
            <Text>Liên hệ điều phối</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Emergency Contact */}
      <View className="px-4 mt-4">
        <View className="bg-red-100 border border-red-300 p-4 rounded-lg">
          <View className="flex-row items-center gap-2">
            <AlertTriangle size={18} color="#dc2626" />
            <View>
              <Text className="text-red-800 font-medium">Hỗ trợ khẩn cấp</Text>
              <Text className="text-sm text-red-600">Hotline: 1900 123 456</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default OrderActive