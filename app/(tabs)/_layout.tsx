import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Heart, ScanFace, Squirrel, UserRound } from "lucide-react-native";

function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: "#ff9c86" }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <Ionicons name="home-outline" size={24} color={"#ff9c86"} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="products"
        options={{
          title: "Products",
          tabBarIcon: () => (
            <Squirrel size={24} color={"#ff9c86"} />
          ),
        }}
      ></Tabs.Screen>
       <Tabs.Screen
        name="scanface"
        options={{
          title: "Scan Face",
          tabBarIcon: () => (
            <ScanFace size={24} color={"#ff9c86"} />
          ),
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => (
            <UserRound size={24} color={"#ff9c86"} />
          ),
        }}
      ></Tabs.Screen>

    </Tabs>
  );
}

export default TabLayout;
