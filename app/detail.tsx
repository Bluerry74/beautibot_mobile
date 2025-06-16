import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { Heart } from "lucide-react-native";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const Detail = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  return (
    <ScrollView
      className="flex-1 bg-white px-4 py-2"
      style={{ backgroundColor: "#fbf1eb" }}
    >
      <Stack.Screen
        options={{
          title: "Product Detail",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color="black" />
            </TouchableOpacity>
          ),
           headerRight: () => (
      <TouchableOpacity onPress={() => {}}>
        <Ionicons name="heart-outline" size={24} style={{ marginRight: 10 }} />
      </TouchableOpacity>
    ),
        }}
      />
      
        <View className="items-center my-2 h-auto">
          <Image
            source={{
              uri: "https://th.bing.com/th/id/OIP.ZId6kYZXYoG2WwB_JQq7jAHaIK?r=0&rs=1&pid=ImgDetMain",
            }}
            className="w-72 h-72"
            resizeMode="contain"
          />
        </View>
        <View className="space-y-3 mt-2 bg-white p-4 rounded-lg shadow-md">
          <View className="flex-row justify-between items-center">
            <Text className="text-3xl font-semibold">
              Texturizing Sea Salt Spray
            </Text>
            <Text className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm font-bold">
              20% Off
            </Text>
          </View>
          <View className="flex-row space-x-3 items-center mt-2">
            <Text className="text-4xl font-bold text-black">$25.00</Text>
            <Text className="text-lg line-through text-gray-400 ml-2">
              $31.25
            </Text>
          </View>

          <View>
            <Text className="text-base text-gray-500 mt-1">
              Brand: Perfect Diary
            </Text>
            <Text className="text-base text-gray-500 mt-1">
              Ingredients: Water, Sea Salt, Glycerin, Fragrance, etc.
            </Text>
            <Text className="text-base text-gray-500 mt-1">
              Skin Concerns: Dryness, Texture, Volume, Sensitive
            </Text>
            <Text className="text-base text-gray-500 mt-1">
              Skin Type: All Skin Types
            </Text>
          </View>

          <View className="flex-row items-center space-x-1">
            <Text className="text-purple-600 mr-2">★★★★☆</Text>
            <Text className="text-lg mr-4">4.55</Text>
            <Text className="text-lg text-gray-500">230 reviews</Text>
          </View>

          <View className="flex-row justify-between items-center bg-gray-100 p-3 rounded-lg mt-4">
            <View>
              <Text className="text-lg text-gray-500">On your formula</Text>
              <Text className="text-xl font-medium">
                3 product alternatives
              </Text>
            </View>
            <View className="flex-row space-x-4">
              <Image
                className="w-16 h-16 rounded-md mr-2"
                source={{
                  uri: "https://th.bing.com/th/id/OIP.ZId6kYZXYoG2WwB_JQq7jAHaIK?r=0&rs=1&pid=ImgDetMain",
                }}
              />
              <Image
                className="w-16 h-16 rounded-md mr-2"
                source={{
                  uri: "https://th.bing.com/th/id/OIP.ZId6kYZXYoG2WwB_JQq7jAHaIK?r=0&rs=1&pid=ImgDetMain",
                }}
              />
              <Image
                className="w-16 h-16 rounded-md"
                source={{
                  uri: "https://th.bing.com/th/id/OIP.ZId6kYZXYoG2WwB_JQq7jAHaIK?r=0&rs=1&pid=ImgDetMain",
                }}
              />
            </View>
          </View>

          <Text className="font-medium mt-4 text-xl">Size variations</Text>
          <View className="flex-row space-x-2 mt-2">
            <TouchableOpacity className="border border-pink-600 rounded-full px-4 py-1 mr-2">
              <Text className="text-pink-600 text-lg">60 ml</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border border-gray-300 rounded-full px-4 py-1 mr-2">
              <Text className="text-lg">150 ml</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border border-gray-300 rounded-full px-4 py-1">
              <Text className="text-lg">250 ml</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-8 space-y-4">
          <View className="flex-row space-x-3">
            <TouchableOpacity className="flex-1 border border-black py-3 rounded-full items-center">
              <Text className="text-xl text-[#5D2C1D]">Add to cart</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-black py-3 rounded-full items-center">
              <Text className="text-white text-xl">Buy now</Text>
            </TouchableOpacity>
          </View>
        </View>
    </ScrollView>
  );
};

export default Detail;
