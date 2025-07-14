import { get } from "@/httpservices/httpService";
import { IProduct, IProductResponse, ISku } from "@/types/product";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";

import { get } from "@/httpservices/httpService";
import { AlignLeft, ShoppingCart } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IProduct } from "../types/products";


const topService = [
  {
    name: "Manicures",
    image: require("../../assets/images/banner_login.jpg"),
  },
  { name: "Facial", image: require("../../assets/images/banner_login.jpg") },
  { name: "Haircut", image: require("../../assets/images/banner_login.jpg") },
  { name: "Waxing", image: require("../../assets/images/banner_login.jpg") },
  { name: "Haircut", image: require("../../assets/images/banner_login.jpg") },
  { name: "Haircut", image: require("../../assets/images/banner_login.jpg") },
];
const BestArtist = [
  {
    id: 1,
    name: "Alaina Tisha",
    rating: 4.8,
    price: "$39.00/hr",
    image: require("../../assets/images/banner_login.jpg"),
  },
  {
    id: 2,
    name: "Amber Heard",
    rating: 3.6,
    price: "$27.00/hr",
    image: require("../../assets/images/banner_login.jpg"),
  },
  {
    id: 3,
    name: "Nguyen Ky ",
    rating: 4.5,
    price: "$25.00/hr",
    image: require("../../assets/images/banner_login.jpg"),
  },
];
const nearArtist = [
  {
    name: "Amber Heard",
    rating: 3.6,
    price: "$27.00/hr",
    image: "https://th.bing.com/th/id/OIP.ZId6kYZXYoG2WwB_JQq7jAHaIK?r=0&rs=1&pid=ImgDetMain",
  },
  {
    name: "Nguyen Ky ",
    rating: 4.5,
    price: "$25.00/hr",
    image: "https://th.bing.com/th/id/OIP.ZId6kYZXYoG2WwB_JQq7jAHaIK?r=0&rs=1&pid=ImgDetMain",
  },
];

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    axios
      .get("https://be-wdp.onrender.com/cart", {
        headers: {
          Authorization: `Bearer YOUR_ACCESS_TOKEN`, // hoặc bỏ nếu không dùng
        },
      })
      .then((res) => {
        const items = res.data?.items || [];
        const total = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(total);
      })
      .catch((err) => {
        console.error("❌ Lỗi lấy giỏ hàng:", err.message);
        setCartCount(0);
      });
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get<IProductResponse>("/product");

        setProducts(response.data.data as unknown as IProduct[]);
        console.log("Products fetched successfully:", response);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedBrand
    ? products.filter((p: IProduct) => p.brand === selectedBrand)
    : products;
  return (
    <ScrollView className="bg-[#FFF3EC] flex-1 px-4 pt-8 ">
      <View className="flex-row justify-between items-center mb-6 mt-8">
        <AlignLeft />
        <Text className="text-xl font-semibold" style={{ color: "#ff9c86" }}>
          Hi There
        </Text>
        <TouchableOpacity onPress={() => router.push("/pages/cart")} className="relative">
  <ShoppingCart color="#ff9c86" size={24} />
  {cartCount > 0 && (
    <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
      <Text className="text-white text-xs font-bold">{cartCount}</Text>
    </View>
  )}
</TouchableOpacity>
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
        {products.map((product: IProduct) => (
          <View key={product._id} className="items-center mr-6">
            <View className="w-16 h-16 bg-white rounded-full justify-center items-center mb-2">
              <TouchableOpacity
                onPress={() => {
                  setSelectedBrand(product.brand ?? null);
                }}
              >
                <Image
                  source={{ uri: product.skus?.[0]?.image ?? "" }}
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
        {filteredProducts.map((product: IProduct) =>
          product.skus?.map((sku: ISku) => (
            <TouchableOpacity
              key={sku._id}
              onPress={() => router.push(`/detail/${product._id}`)}            >
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
