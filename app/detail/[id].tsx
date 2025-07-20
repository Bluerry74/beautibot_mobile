import CartButton from "@/components/core/FlatList/cartButton";
import { IProduct, ISku } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const Detail = () => {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [product, setProduct] = useState<IProduct | null>(null);
  const [selectedSku, setSelectedSku] = useState<ISku | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  console.log("✅ Received ID:", id);
  useEffect(() => {
    if (selectedSku?.images?.[0]) {
      setSelectedImage(selectedSku.images[0]);
    }
  }, [selectedSku]);
  useEffect(() => {
    
    if (!id) return;
  
    axios.get(`https://be-wdp.onrender.com/product/${id}`)
      .then((res) => {
        const data = res.data;
        setProduct(data);
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
    <SafeAreaView className="flex-1 bg-[#fbf1eb]">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ff9c86" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-center ">Chi tiết sản phẩm</Text>
        <TouchableOpacity>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#ff9c86"
          />
        </TouchableOpacity>
      </View>
  
      {/* Ảnh sản phẩm */}
      <View className="items-center my-4">
        <View
          style={{
            borderWidth: 2,
            borderColor: "#ccc",
            padding: 6,
            backgroundColor: "#fff",
            elevation: 3,
          }}
        >
          {selectedImage ? (
            <Image
              source={{ uri: encodeURI(selectedImage) }}
              style={{ width: 350, height: 360, resizeMode: "cover" }}
            />
          ) : (
            <View
              style={{
                width: 300,
                height: 360,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No Image</Text>
            </View>
          )}
        </View>
      </View>
  
      {/* Thumbnails nếu có nhiều ảnh */}
      {selectedSku.images?.length > 1 && (
        <FlatList
          data={selectedSku.images}
          horizontal
          keyExtractor={(_, idx) => `thumb-${idx}`}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 12, paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <Pressable onPress={() => setSelectedImage(item)}>
              <Image
                source={{ uri: encodeURI(item) }}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 8,
                  marginRight: 10,
                  borderWidth: item === selectedImage ? 2 : 0,
                  borderColor: "#000",
                }}
              />
            </Pressable>
          )}
        />
      )}
  
      {/* Variants */}
      <View className="px-3 mt-2">
        <View className="flex-row flex-wrap gap-2">
          {product.skus?.map((sku: ISku) => (
            <TouchableOpacity
              key={sku._id}
              className={`border px-4 py-1 rounded-full ${
                selectedSku?._id === sku._id
                  ? "border-black bg-gray-200"
                  : "border-gray-300"
              }`}
              onPress={() => setSelectedSku(sku)}
            >
              <Text className="text-base">{sku.variantName}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
  
      {/* Tên tranh, tác giả, mô tả ngắn */}
      <View className="items-baseline mt-2 space-y-2 px-4 bg-white rounded-lg p-4">
        <Text className="text-3xl font-bold text-black text-center">
          {product.name}
        </Text>
        <Text className="text-xl text-gray-600 text-center uppercase tracking-wider">
          {product.brand}
        </Text>
        <Text className="text-lg text-gray-500 tracking-wider">
          {product.description}
        </Text>
        <Text className="text-lg text-gray-500 text-center  tracking-wider">
        {String(product.ingredients || 'Đang cập nhật...')}
        </Text>
      </View>
  
      {/* Giá + Giảm giá */}
      <View className="items-baseline px-4 mt-1">
        <View className="flex-row items-end space-x-3">
          <Text className="text-2xl font-bold text-red-600">
           Price: {discountPrice.toLocaleString()} VND
          </Text>
          {selectedSku.discount > 0 && (
            <Text className="text-base text-gray-400 line-through ml-3">
              {selectedSku.price.toLocaleString()} VND
            </Text>
          )}
        </View>
      </View>
  
      {/* Nút Add to Cart */}
      <View className="mt-2 px-4 mb-10">
        <CartButton sku={selectedSku} />
      </View>
    </SafeAreaView>
  );
  
};

export default Detail;
