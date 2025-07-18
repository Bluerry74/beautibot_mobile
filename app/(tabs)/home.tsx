import { get } from "@/httpservices/httpService";
import { IProduct, IProductResponse, ISku } from "@/types/product";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AlignLeft, ShoppingCart } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await get<IProductResponse>("/product");

        setProducts(response.data.data as unknown as IProduct[]);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);


  // const filteredProducts = selectedBrand
  //   ? products.filter((p: IProduct) => p.brand === selectedBrand)
  //   : products;
    const filteredProducts = products.filter((product: IProduct) => {
  const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
  const matchesSearch = product.name
    .toLowerCase()
    .includes(searchQuery.toLowerCase());
  return matchesBrand && matchesSearch;
});

  const flatSkuList = filteredProducts.flatMap((product: IProduct) =>
    product.skus?.map((sku: ISku) => ({
      ...sku,
      productId: product._id,
      productName: product.name,
      productBrand: product.brand,
      productRating: product.rating || "4.5",
    }))
  );
  return (
    <View className="bg-[#FFF3EC] flex-1 px-4 pt-8 ">
      <View className="flex-row justify-between items-center mb-6 mt-8">
        <AlignLeft />
        <Text className="text-xl font-semibold" style={{ color: "#ff9c86" }}>
          Hi There
        </Text>
        <TouchableOpacity onPress={() => router.push("/pages/cart")} className="relative">
  <ShoppingCart color="#ff9c86" size={24} />
</TouchableOpacity>
      </View>

      <View className="flex-row items-center bg-white px-4 py-2 rounded-xl mb-4">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Bạn đang tìm kiếm gì??"
          className="ml-2 flex-1 text-sm"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity className="p-2 bg-brown-700 rounded-md ml-2">
          <MaterialIcons name="tune" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <Text className="text-xl font-semibold mb-4" style={{ color: "#ff9c86" }}>
        Thương Hiệu Nổi Bật
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
                  source={{ uri: product.skus?.[0]?.image ?? "https://i.pinimg.com/originals/64/a9/8a/64a98ac18b9bc84fc0b61dc5a5989899.jpg" }}
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
          {selectedBrand || "Sản phẩm hàng đầu"}
        </Text>
        <TouchableOpacity onPress={() => setSelectedBrand(null)}>
          <Text className="text-lg text-brown-500">Xem tất cả</Text>
        </TouchableOpacity>
      </View>
               
      <FlatList
        data={flatSkuList}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/detail/${item.productId}`)}
            className="flex-1 mb-4"
          >
            <View className="h-72 bg-white rounded-xl p-2 m-2 shadow-md">
              <Image
                source={{ uri: item.image || "https://i.pinimg.com/originals/64/a9/8a/64a98ac18b9bc84fc0b61dc5a5989899.jpg" }}
                className="w-full h-40 rounded-lg mb-3"
              />
              <Text className="font-semibold text-pink-300 h-10">
                {item.productName}
              </Text>
              <Text className="text-xs text-brown-500 mb-2">
                {item.productBrand}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm">
                  {item.price.toLocaleString()} VND
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={14} color="#FFB400" />
                  <Text className="ml-1 text-sm">{item.productRating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Home;
