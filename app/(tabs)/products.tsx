import { Product, Sku } from "@/app/types/product";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";



const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://be-wdp.onrender.com/product", {
          timeout: 10000, // giới hạn tối đa 10s
        });
        console.log("Data fetched:", res.data);
        setProducts(res.data.data);
      
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  



  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
    onPress={() => {
      console.log("👀 Going to:", item._id);
      router.push(`/detail/${item._id}`);

    }}
    >
      <View className="bg-white rounded-lg mb-4 p-6 shadow-md">
        <Text className="text-pink-300 text-xl font-semibold">{item.name}</Text>
        <Text className="text-gray-700 mb-2">{item.brand}</Text>
        <Text className="text-gray-500 mb-1">Skus:</Text>
        {item.skus.map((sku: Sku, index: number) => (
          <View key={sku._id || index} className="mb-1">
            <Text className="font-medium">{sku.variantName}</Text>
            <Text>Price: {sku.price.toLocaleString()} VND</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#ff9c86" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FFF3EC] px-4 pt-10">
      <Text className="text-2xl font-bold mb-4 text-center">Products List</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Products;
