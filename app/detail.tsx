import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Detail = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Stack.Screen
        options={{
          title: "Detail Product",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={{ alignItems: "center", marginVertical: 20 }}>
        <Text> Detail ????? {id}</Text>
      </View>
    </ScrollView>
  );
};

export default Detail;
