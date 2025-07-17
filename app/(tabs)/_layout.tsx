import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Bot, SquareChartGantt, Squirrel, UserRound } from "lucide-react-native";

function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#ff9c86" }}>      
      <Tabs.Screen 
        name="home"
        options={{
          title: "Trang chủ",
          tabBarIcon: () => (
            <Ionicons name="home-outline" size={24} color={"#ff9c86"} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="products"
        options={{
          title: "Sản phẩm",
          tabBarIcon: () => (
            <Squirrel size={24} color={"#ff9c86"} />
          ),
        }}
      ></Tabs.Screen>
       <Tabs.Screen
        name="ai"
        options={{
          title: "AI",
          tabBarIcon: () => (
            <Bot size={24} color={"#ff9c86"} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="routine"
        options={{
          title: "Liệu trình",
          tabBarIcon: () => (
            <SquareChartGantt size={24} color={"#ff9c86"} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="profile"
        options={{
          title: "Tài khoản",
          tabBarIcon: () => (
            <UserRound size={24} color={"#ff9c86"} />
          ),
        }}
      ></Tabs.Screen>

    </Tabs>
  );
}

export default TabLayout;
