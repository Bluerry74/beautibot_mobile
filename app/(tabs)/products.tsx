import { get } from "@/httpservices/httpService";
import { IProduct, IProductResponse, ISku } from "@/types/product";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Products = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get<IProductResponse>("/product");
        setProducts(response.data.data as unknown as IProduct[]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  

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
        data={products}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        keyExtractor={(item: IProduct, index: number) =>
          item._id ?? index.toString()
        }
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }: { item: IProduct }) => (
          <TouchableOpacity
            onPress={() => {
              console.log("👀 Going to:", item._id);
              router.push(`/detail/${item._id}`);
            }}
            className="flex-1 mb-2"
          >
            <View className="bg-white rounded-lg p-4 shadow-md m-2">
              <Image
                source={{ uri: item.image }}
                className="w-full h-40 rounded-lg mb-3"
              />
              <Text className="text-pink-300 text-lg font-semibold">
                {item.name}
              </Text>
              <Text className="text-gray-700 mb-1">{item.brand}</Text>
              {/* {item.skus?.map((sku: ISku, index: number) => (
                <View key={sku._id || index} className="mb-1">
                  <Text className="font-medium">{sku.variantName}</Text>
                  <Text>{sku.price.toLocaleString()} VND</Text>
                </View>
              ))} */}
              {item.skus?.[0] && (
                <View className="mb-1">
                  <Text className="font-medium">
                    {item.skus[0].variantName}
                  </Text>
                  <Text>{item.skus[0].price.toLocaleString()} VND</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Products;
