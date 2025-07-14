import { Tabs } from 'expo-router'
import { Package, PackagePlus, ShoppingBag } from 'lucide-react-native'

export default function AdminLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#ff9c86" }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
        }}
      />
       <Tabs.Screen
        name="productmanagement"
        options={{
          title: "Quản lý sản phẩm",
          tabBarIcon: ({ color, size }) => <PackagePlus color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Order",
          tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
