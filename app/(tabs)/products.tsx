import { get } from "@/httpservices/httpService";
import { IProduct, IProductResponse, ISku } from "@/types/product";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { Funnel } from "lucide-react-native";
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
  const [selectedIngredient, setSelectedIngredient] = useState<string>("");
  const [selectedConcern, setSelectedConcern] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

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

  useEffect(() => {
    filterProducts();
  }, [selectedIngredient, selectedConcern]);
  const filterProducts = () => {
    let filtered = [...products];

    if (selectedIngredient) {
      filtered = filtered.filter((p) =>
        p.ingredients?.includes(selectedIngredient)
      );
    }
    if (selectedConcern) {
      filtered = filtered.filter((p) =>
        p.skinConcerns?.includes(selectedConcern)
      );
    }
    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#ff9c86" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FFF3EC] px-4 pt-10">
      <Text className="text-2xl font-bold mb-4 mt-2 text-center">
        Tất cả các sản phẩm
      </Text>
      <View className="flex-row items-center space-x-3 mb-4 px-2">
        <Funnel size={24} color="#ff9c86" />
        <View className="flex-1 bg-white border border-gray-300 rounded-full overflow-hidden mx-2">
          <Picker
            selectedValue={selectedIngredient}
            onValueChange={(value) => setSelectedIngredient(value)}
            style={{ height: 50, fontSize: 12 }}
          >
            <Picker.Item label="Thành phần" value="" />
            <Picker.Item label="Niacinamide" value="Niacinamide" />
            <Picker.Item label="BHA" value="BHA" />
            <Picker.Item label="PHA" value="PHA" />
            <Picker.Item label="AHA" value="AHA" />
            <Picker.Item label="Tea Tree Extract" value="Tea Tree Extract" />
          </Picker>
        </View>

        <View className="flex-1 bg-white border border-gray-300 rounded-full overflow-hidden">
          <Picker
            selectedValue={selectedConcern}
            onValueChange={(value) => setSelectedConcern(value)}
            style={{ height: 50, fontSize: 12 }}
          >
            <Picker.Item label="Loại da" value="" />
            <Picker.Item label="Da thường" value="Normal" />
            <Picker.Item label="Da khô" value="dry" />
            <Picker.Item label="Da hỗn hợp" value="combination" />
            <Picker.Item label="Da dầu" value="oily" />
            <Picker.Item label="Da nhạy cảm" value="sensitive" />
          </Picker>
        </View>
      </View>
      <FlatList
        data={filteredProducts.length > 0 ? filteredProducts : products}
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
              router.push(`/detail/${item._id}`);
            }}
            className="flex-1 mb-2"
          >
            <View className="bg-white rounded-lg p-4 shadow-md m-2 h-80">
              <Image
                source={
                  item?.skus?.[0]?.images?.[0]
                    ? { uri: item.skus[0].images[0] }
                    : require("@/assets/images/large.png")
                }
                className="w-full h-40 rounded-lg mb-3"
              />
              <Text className="text-pink-300 text-lg font-semibold">
                {item.name}
              </Text>
              <Text className="text-gray-700 mb-1">{item.brand}</Text>
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
