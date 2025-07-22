
import { useCartActions } from "@/hooks/useCartActions";
import { get } from "@/httpservices/httpService";
import { CartItem, IAddress } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function CartPage() {
  const {
    getCart,
    removeFromCart,
    updateQuantity,
    getAddresses,
    addAddress,
    checkout,
    getMyCoupons,
  } = useCartActions();
  const [coupons, setCoupons] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string>("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [isBuy, setIsBuy] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [newAddr, setNewAddr] = useState<Partial<Omit<IAddress, "_id">>>({});
  const [addingAddr, setAddingAddr] = useState(false);
  const router = useRouter();
  const [skuImages, setSkuImages] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isBuy) {
      fetchCoupons();
    }
  }, [isBuy]);

  const fetchCoupons = async () => {
    try {
      const codes = await getMyCoupons();
      setCoupons(codes);
    } catch {
      Alert.alert("Lỗi", "Không lấy được mã giảm giá");
    }
  };
  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const fetchCart = async () => {
    setLoadingCart(true);
    try {
      const items = await getCart();
      console.log("🛒 fetched cart items:", items);
      setCartItems(items || []);
    } catch {
      Alert.alert("Lỗi", "Không tải được giỏ hàng");
    } finally {
      setLoadingCart(false);
    }
  };

  const fetchSkuById = async (skuId: string) => {
    try {
      const response = await get(`/sku/${skuId}`);
      return response.data; // dữ liệu SKU bao gồm images
    } catch (error) {
      console.error("Lỗi khi fetch SKU:", error);
      return null;
    }
  };
  useEffect(() => {
    const loadSkuImages = async () => {
      const updates: Record<string, string> = {};

      await Promise.all(
        cartItems.map(async (item) => {
          if (!skuImages[item.skuId]) {
            const sku = await fetchSkuById(item.skuId);
            if (sku?.images?.[0]) {
              updates[item.skuId] = sku.images[0];
            }
          }
        })
      );

      setSkuImages((prev) => ({ ...prev, ...updates }));
    };

    if (cartItems.length > 0) loadSkuImages();
  }, [cartItems]);

  const fetchAddresses = async () => {
    setLoadingAddr(true);
    try {
      const list = await getAddresses();
      setAddresses(list || []);
    } catch {
      Alert.alert("Lỗi", "Không tải được địa chỉ");
    } finally {
      setLoadingAddr(false);
    }
  };
  const onIncrease = async (item: CartItem) => {
    await updateQuantity(item.skuId, item.productId!, item.quantity + 1);
    await fetchCart();
  };
  const onDecrease = async (item: CartItem) => {
    if (item.quantity > 1) {
      await updateQuantity(item.skuId, item.productId!, item.quantity - 1);
      await fetchCart();
    }
  };
  const onRemove = async (skuId: string, productId: any) => {
    try {
      await removeFromCart(skuId, String(productId)); // Ép kiểu ở đây
      fetchCart();
    } catch (err: any) {
      console.error(
        "❌ Xóa giỏ hàng thất bại:",
        err.response?.data || err.message
      );
      Alert.alert("Lỗi", "Không xóa được sản phẩm khỏi giỏ hàng");
    }
  };
  const onToggle = (skuId: string) =>
    setCartItems((prev) =>
      prev.map((i) => (i.skuId === skuId ? { ...i, selected: !i.selected } : i))
    );

  const total = useMemo(
    () =>
      cartItems
        .filter((i) => i.selected)
        .reduce((sum, i) => sum + i.quantity * i.priceSnapshot, 0),
    [cartItems]
  );

  const handleAddAddress = async () => {
    const { fullName, phone, street, city, postalCode, country } = newAddr;
    if (!fullName || !phone || !street || !city || !postalCode || !country) {
      return Alert.alert("Thiếu thông tin", "Điền đầy đủ địa chỉ");
    }
    setAddingAddr(true);
    try {
      await addAddress(newAddr as any);
      setNewAddr({});
      fetchAddresses();
    } catch {
      Alert.alert("Lỗi", "Không thêm được địa chỉ");
    } finally {
      setAddingAddr(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      return Alert.alert("Chưa chọn địa chỉ", "Vui lòng chọn địa chỉ");
    }
    try {
      const response = await checkout(selectedAddressId); // thêm return ở useCartActions
      if (response?.url) {
        // điều hướng sang trang Stripe
        Linking.openURL(response.url);
      } else {
        Alert.alert("Thành công", "Đặt hàng thành công!");
        router.replace("/"); // fallback nếu không có url
      }
    } catch {
      Alert.alert("Lỗi", "Không đặt hàng được");
    }
  };

  if (loadingCart) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const labelMap: Record<string, string> = {
    fullName: "Họ và tên",
    phone: "Số điện thoại",
    street: "Địa chỉ",
    city: "Thành phố",
    postalCode: "Mã bưu điện",
    country: "Quốc gia",
  };

  return (
    <SafeAreaView className="flex-1 m-4">
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ff9c86" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-center ">Giỏ hàng</Text>
        <TouchableOpacity>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#ff9c86"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(i) => i.skuId}
        renderItem={({ item }) => (
          <View
            style={styles.item}
            className="flex-row bg-slate-100 p-4 rounded-full mb-2"
          >
            <TouchableOpacity onPress={() => onToggle(item.skuId)}>
              <Ionicons
                name={item.selected ? "checkbox" : "square-outline"}
                size={20}
                color={item.selected ? "tomato" : "#999"}
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>
            <Image
              source={
                skuImages[item.skuId]
                  ? { uri: skuImages[item.skuId] }
                  : require("@/assets/images/large.png")
              }
              style={styles.image}
            />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.title}>
                {item.skuName}
              </Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.ctrlBtn}
                  onPress={() => onDecrease(item)}
                >
                  <Text>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.ctrlBtn}
                  onPress={() => onIncrease(item)}
                >
                  <Text>＋</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.right}>
              <Text style={styles.price}>
                {(item.priceSnapshot * item.quantity).toLocaleString()}₫
              </Text>
              <TouchableOpacity
                onPress={() => onRemove(item.skuId, item.productId)}
              >
                <Text style={styles.remove}>×</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {isBuy ? (
        loadingAddr ? (
          <ActivityIndicator />
        ) : addresses.length > 0 ? (
          <View style={styles.pickerContainer}>
            {addresses.map((a) => (
              <TouchableOpacity
                key={a._id}
                style={[
                  styles.addrItem,
                  selectedAddressId === a._id && styles.addrItemSelected,
                ]}
                onPress={() => setSelectedAddressId(a._id)}
              >
                <Text>{`${a.fullName}, ${a.street}, ${a.city}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.addrForm}>
            {Object.keys(labelMap).map((k) => (
              <TextInput
                key={k}
                placeholder={labelMap[k]}
                value={(newAddr as any)[k] || ""}
                onChangeText={(txt) => setNewAddr((p) => ({ ...p, [k]: txt }))}
                style={styles.input}
              />
            ))}

            <Button
              color="#ff9c86"
              title={addingAddr ? "Đang thêm..." : "Thêm địa chỉ"}
              onPress={handleAddAddress}
              disabled={addingAddr}
            />
          </View>
        )
      ) : (
        <TouchableOpacity
          style={styles.addrSelectBtn}
          onPress={() => setIsBuy(true)}
        >
          <Text>Chọn địa chỉ giao hàng</Text>
        </TouchableOpacity>
      )}
      <View style={{ marginVertical: 12 }}>
        <TextInput
          placeholder="Nhập mã giảm giá"
          value={couponCode}
          onChangeText={setCouponCode}
          style={styles.input}
        />
        {coupons.length > 0 ? (
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontWeight: "500", marginBottom: 4 }}>Chọn mã:</Text>
            {coupons.map((c, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setCouponCode(c)}
                style={{
                  backgroundColor: "#FFEBEE",
                  padding: 8,
                  marginBottom: 4,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: "tomato", fontWeight: "500" }}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={{ color: "#888", marginTop: 8 }}>
            Bạn chưa có mã giảm giá nào.
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.total}>
          Tổng cộng:{" "}
          <Text style={{ color: "tomato" }}>{total.toLocaleString()}₫</Text>
        </Text>
        <Button
          color={"#ff9c86"}
          title={isBuy ? "Đặt hàng" : "Mua hàng"}
          onPress={isBuy ? handleCheckout : () => setIsBuy(true)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  item: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  image: { width: 50, height: 50, borderRadius: 4, marginRight: 8 },
  title: { fontSize: 14, fontWeight: "500" },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  ctrlBtn: {
    borderWidth: 1,
    borderColor: "#CCC",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  qtyText: { marginHorizontal: 8 },
  right: { alignItems: "flex-end" },
  price: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  remove: { fontSize: 18, color: "#999" },
  addrSelectBtn: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 6,
    padding: 10,
    marginVertical: 12,
    alignItems: "center",
  },
  pickerContainer: { marginVertical: 12 },
  addrItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 6,
    marginBottom: 8,
  },
  addrItemSelected: { backgroundColor: "#FFEBEE", borderColor: "tomato" },
  addrForm: { marginVertical: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: "#EEE",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  total: { fontSize: 16, fontWeight: "600" },
});
