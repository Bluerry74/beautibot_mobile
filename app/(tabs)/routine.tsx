import { Droplets, Moon, Settings, Sun, Zap } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const routine = {
    morning: [
      { step: 1, product: "Sữa rửa mặt dịu nhẹ", time: "1 phút", description: "Rửa mặt bằng nước ấm" },
      { step: 2, product: "Serum Vitamin C", time: "2 phút", description: "Thoa 2-3 giọt, vỗ nhẹ lên da" },
      { step: 3, product: "Hyaluronic Acid", time: "1 phút", description: "Thoa khi da còn ẩm" },
      { step: 4, product: "Kem dưỡng ẩm", time: "1 phút", description: "Thoa đều lên mặt và cổ" },
      { step: 5, product: "Kem chống nắng SPF 30+", time: "1 phút", description: "Nhớ thoa cả tai và cổ" },
    ],

    evening: [
      { step: 1, product: "Dầu tẩy trang", time: "2 phút", description: "Tẩy lớp trang điểm và kem chống nắng" },
      { step: 2, product: "Sữa rửa mặt", time: "1 phút", description: "Rửa lại để làm sạch sâu" },
      { step: 3, product: "Serum Retinol", time: "2 phút", description: "Bắt đầu dùng 2 lần/tuần" },
      { step: 4, product: "Kem dưỡng đêm", time: "1 phút", description: "Công thức đậm đặc giúp phục hồi ban đêm" },
      { step: 5, product: "Dầu dưỡng da", time: "1 phút", description: "Tùy chọn: tăng cường độ ẩm" },
    ],

    weekly: [
      { name: "Tẩy tế bào chết", frequency: "2 lần/tuần", description: "Dùng BHA hoặc AHA", icon: <Zap size={20} /> },
      { name: "Đắp mặt nạ", frequency: "1 lần/tuần", description: "Mặt nạ cấp ẩm hoặc làm sạch", icon: <Droplets size={20} /> },
      { name: "Làm sạch sâu", frequency: "1 lần/tuần", description: "Mặt nạ đất sét hoặc miếng lột mụn", icon: <Sun size={20} /> },
    ],
};


export default function Routine() {
  const [tab, setTab] = React.useState("morning");

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b mt-8">
        <View className="flex-row items-center gap-3">  
          <View>
            <Text className="text-base font-semibold">Chăm sóc da của tôi</Text>
            <Text className="text-xs text-gray-500">Liệu trình hàng ngày</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Settings size={20} />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-around mt-4 mb-2">
        {[
          { key: "morning", label: "Buổi sáng", icon: <Sun size={16} /> },
          { key: "evening", label: "Buổi tối", icon: <Moon size={16} /> },
          { key: "weekly", label: "Hàng tuần", icon: <Zap size={16} /> },
        ].map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTab(t.key)}
            className={`flex-row items-center gap-1 px-4 py-2 rounded-full ${tab === t.key ? "bg-orange-200" : "bg-white"}`}
          >
            {t.icon}
            <Text className="text-sm font-medium">{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="px-4">
        {tab !== "weekly" ? (
          routine[tab as keyof typeof routine].map((item: any) => (
            <View key={item.step} className="bg-white rounded-xl mb-3 p-4 border-l-4 border-orange-400">
              <View className="flex-row justify-between items-start">
                <View className="flex-row gap-3 items-center">
                  <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center">
                    <Text className="text-orange-600 font-bold text-center">{item.step}</Text>
                  </View>
                  <View>
                    <Text className="font-medium">{item.product}</Text>
                    <Text className="text-sm text-gray-500">{item.description}</Text>
                  </View>
                </View>
                <Text className="text-xs text-gray-500">{item.time}</Text>
              </View>
            </View>
          ))
        ) : (
          <>
            {routine.weekly.map((t, idx) => (
              <View key={idx} className="bg-white rounded-xl mb-3 p-4 border-l-4 border-green-400">
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center">
                    {t.icon}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between">
                      <Text className="font-medium">{t.name}</Text>
                      <Text className="text-xs text-gray-500">{t.frequency}</Text>
                    </View>
                    <Text className="text-sm text-gray-500">{t.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      </View>
  )
}