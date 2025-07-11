import { IProduct, ISku } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const Detail = () => {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedSku, setSelectedSku] = useState<ISku | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  console.log("✅ Received ID:", id);

  useEffect(() => {
    if (!id) return;
  
    axios.get(`https://be-wdp.onrender.com/product/${id}`)
      .then((res) => {
        const data = res.data;
        setProduct(data);
  
        // Gán selectedSku mặc định là SKU đầu tiên
        if (data?.skus?.length > 0) {
          setSelectedSku(data.skus[0]);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);
  
  

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#ff9c86" />
      </View>
    );
  }

  if (!product || !selectedSku) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-xl">Không tìm thấy sản phẩm</Text>
      </View>
    );
  }



  const discountPrice = selectedSku.price * (1 - (selectedSku.discount || 0) / 100);

  return (
    <ScrollView className="flex-1 bg-white px-4 py-2" style={{ backgroundColor: "#fbf1eb" }}>
      <Stack.Screen
        options={{
          title: "Product Detail",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
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

      <View className="items-center my-2">
        <Image
          source={{ uri: selectedSku.image }}
          className="w-72 h-72"
          resizeMode="contain"
        />
      </View>

      <View className="space-y-3 mt-2 bg-white p-4 rounded-lg shadow-md">
        <View className="flex-row justify-between items-center">
          <Text className="text-3xl font-semibold">{product.name}</Text>
          {selectedSku.discount > 0 && (
            <Text className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-sm font-bold">
              {selectedSku.discount}% Off
            </Text>
          )}
        </View>

        <View className="flex-row items-center mt-2">
          <Text className="text-4xl font-bold text-black">
            {discountPrice.toLocaleString()} VND
          </Text>
          {selectedSku.discount > 0 && (
            <Text className="text-lg line-through text-gray-400 ml-2">
              {selectedSku.price.toLocaleString()} VND
            </Text>
          )}
        </View>

        <Text className="text-base text-gray-500 mt-1">Brand: {product.brand}</Text>
        <Text className="text-base text-gray-500 mt-1">
          Ingredients: {product.ingredients?.join(", ")}
        </Text>
        <Text className="text-base text-gray-500 mt-1">
          Skin Concerns: {product.skinConcerns?.join(", ")}
        </Text>
        <Text className="text-base text-gray-500 mt-1">
          Skin Type: {product.suitableForSkinTypes?.join(", ")}
        </Text>

        {/* Size Variants */}
        <Text className="font-medium mt-4 text-xl">Size Variations</Text>
        <View className="flex-row flex-wrap gap-2 mt-2">
        {product.skus?.map((sku: ISku) => (
  <TouchableOpacity
    key={sku._id}
    className={`border px-4 py-1 mr-2 rounded-full ${
      selectedSku?._id === sku._id ? "border-black bg-gray-200" : "border-gray-300"
    }`}
    onPress={() => setSelectedSku(sku)}
  >
    <Text className="text-lg">{sku.variantName}</Text>
  </TouchableOpacity>
))}

        </View>
      </View>

      {/* CTA Buttons */}
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
