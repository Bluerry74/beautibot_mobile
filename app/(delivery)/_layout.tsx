import { Tabs } from 'expo-router'
import { Package, Clock, PackageCheck } from 'lucide-react-native'

export default function DeliveryLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#ff9c86" }}>
      <Tabs.Screen
        name="tracking"
        options={{
          title: "Tất cả đơn",
          tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="orderactive"
        options={{
          title: "Đơn hàng",
          tabBarIcon: ({ color, size }) => <PackageCheck color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Lịch sử",
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />,
        }}
      />
      
    </Tabs>
  )
}
