import { Tabs } from "expo-router";
import React from "react";

function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      ></Tabs.Screen>
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      ></Tabs.Screen>
    </Tabs>
  );
}

export default TabLayout;
