import { View, Text, ScrollView, Image } from "react-native";
import React from "react";

const RenderItem = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-4"
    >
        <View className="items-center mr-6">
          <View className="w-16 h-16 bg-white rounded-full justify-center items-center mb-2">
            <Image source={{uri: "#"}} className="w-16 h-16 rounded-full" />
          </View>
          <Text className="text-xs text-center text-brown-800">
            Tutututhoi
          </Text>
        </View>
    </ScrollView>
  );
};

export default RenderItem;
