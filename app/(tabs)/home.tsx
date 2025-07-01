import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { AlignLeft, ShoppingCart } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IProduct } from "../types/products";
import { get } from "../httpservices/httpService";

const nearArtist = [
  {
    name: "Amber Heard",
    rating: 3.6,
    price: "$27.00/hr",
    image:
      "https://th.bing.com/th/id/OIP.ZId6kYZXYoG2WwB_JQq7jAHaIK?r=0&rs=1&pid=ImgDetMain",
  },
  {
    name: "Nguyen Ky ",
    rating: 4.5,
    price: "$25.00/hr",
    image:
      "https://th.bing.com/th/id/OIP.ZId6kYZXYoG2WwB_JQq7jAHaIK?r=0&rs=1&pid=ImgDetMain",
  },
];

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get<IProduct[]>("/product");

        setProducts(response.data.data);
        console.log("Products fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedBrand
    ? products.filter((p) => p.brand === selectedBrand)
    : products;
  return (
    <ScrollView className="bg-[#FFF3EC] flex-1 px-4 pt-8 ">
      <View className="flex-row justify-between items-center mb-6 mt-8">
        <AlignLeft />
        <Text className="text-xl font-semibold" style={{ color: "#ff9c86" }}>
          Hi There
        </Text>
        <ShoppingCart />
      </View>

      <View className="flex-row items-center bg-white px-4 py-2 rounded-xl mb-4">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="What are you looking for?"
          className="ml-2 flex-1 text-sm"
        />
        <TouchableOpacity className="p-2 bg-brown-700 rounded-md ml-2">
          <MaterialIcons name="tune" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-semibold mb-4" style={{ color: "#ff9c86" }}>
        Top Brands
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        {products.map((product) => (
          <View key={product._id} className="items-center mr-6">
            <View className="w-16 h-16 bg-white rounded-full justify-center items-center mb-2">
              <TouchableOpacity
                onPress={() => {
                  setSelectedBrand(product.brand ?? null);
                }}
              >
                <Image
                  source={product.skus[0]?.image}
                  className="w-16 h-16 rounded-full"
                />
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-center text-brown-800">
              {product.brand}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-semibold" style={{ color: "#ff9c86" }}>
          {selectedBrand || "Top Products"}
        </Text>
        <TouchableOpacity onPress={() => setSelectedBrand(null)}>
          <Text className="text-lg text-brown-500">View all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filteredProducts.map((product) =>
          product.skus.map((sku) => (
            <TouchableOpacity
              key={sku._id}
              onPress={() => router.push(`/detail?id=${product._id}`)}
            >
              <View className="w-52 h-72 bg-white rounded-xl mr-4 p-2">
                <Image
                  source={{ uri: sku.image }}
                  className="w-full h-40 rounded-lg mb-3"
                />
                <Text className="font-semibold text-brown-800 h-16">
                  {product.name}
                </Text>
                <Text className="text-xs text-brown-500 mb-2">
                  {product.brand}
                </Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm">{sku.price.toLocaleString()} VND</Text>
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={14} color="#FFB400" />
                    <Text className="ml-1 text-sm">
                      {product.rating || "4.5"}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View className="flex-row justify-between items-center mb-4 mt-6">
        <Text className="text-xl font-semibold" style={{ color: "#ff9c86" }}>
          Best Artist Near You
        </Text>
        <TouchableOpacity>
          <Text className="text-lg text-brown-500">View all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {nearArtist.map((artist, idx) => (
          <View key={idx} className="w-52 bg-white rounded-xl mr-4 p-2">
            <Image
              source={{ uri: artist.image }}
              className="w-full h-40 rounded-lg mb-3"
            />
            <Text className="font-semibold text-brown-800">{artist.name}</Text>
            <Text className="text-xs text-brown-500 mb-2">
              Best Artist near you
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm">{artist.price}</Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#FFB400" />
                <Text className="ml-1 text-sm">{artist.rating}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

export default Home;
