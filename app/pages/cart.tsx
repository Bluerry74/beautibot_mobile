// app/pages/cart.tsx
import { CartItem, IAddress } from "@/app/types/product";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CartPage() {
  // ✅ Inline mock data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      skuId: "sku_001",
      skuName: "150ml Pump Bottle",
      quantity: 2,
      priceSnapshot: 250000,
      selected: true,
      image: "https://via.placeholder.com/80x80.png?text=150ml",
      productId: "prod_001",
    },
    {
      skuId: "sku_002",
      skuName: "100ml Travel Tube",
      quantity: 1,
      priceSnapshot: 179000,
      selected: false,
      image: "https://via.placeholder.com/80x80.png?text=100ml",
      productId: "prod_002",
    },
    {
      skuId: "sku_003",
      skuName: "200ml Family Pack",
      quantity: 3,
      priceSnapshot: 180000,
      selected: true,
      image: "https://via.placeholder.com/80x80.png?text=200ml",
      productId: "prod_003",
    },
  ]);

  const [addresses, setAddresses] = useState<IAddress[]>([
    {
      _id: "addr_001",
      fullName: "Nguyễn Văn A",
      phone: "0909123456",
      street: "123 Lê Lợi",
      city: "Hồ Chí Minh",
      postalCode: "700000",
      country: "Việt Nam",
      isDefault: true,
    },
    {
      _id: "addr_002",
      fullName: "Trần Thị B",
      phone: "0912345678",
      street: "456 Nguyễn Huệ",
      city: "Hà Nội",
      postalCode: "100000",
      country: "Việt Nam",
      isDefault: false,
    },
  ]);

  const [isBuy, setIsBuy] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const [newAddr, setNewAddr] = useState<Partial<Omit<IAddress, "_id">>>({});
  const [addingAddr, setAddingAddr] = useState(false);

  const router = useRouter();

  // UI handlers
  const onIncrease = (skuId: string) =>
    setCartItems(prev =>
      prev.map(it =>
        it.skuId === skuId ? { ...it, quantity: it.quantity + 1 } : it
      )
    );
  const onDecrease = (skuId: string) =>
    setCartItems(prev =>
      prev.map(it =>
        it.skuId === skuId && it.quantity > 1
          ? { ...it, quantity: it.quantity - 1 }
          : it
      )
    );
  const onRemove = (skuId: string) =>
    setCartItems(prev => prev.filter(it => it.skuId !== skuId));
  const onToggle = (skuId: string) =>
    setCartItems(prev =>
      prev.map(it =>
        it.skuId === skuId ? { ...it, selected: !it.selected } : it
      )
    );

  const total = useMemo(
    () =>
      cartItems
        .filter(it => it.selected)
        .reduce((sum, it) => sum + it.quantity * it.priceSnapshot, 0),
    [cartItems]
  );

  const handleAddAddress = () => {
    const { fullName, phone, street, city, postalCode, country } = newAddr;
    if (!fullName || !phone || !street || !city || !postalCode || !country)
      return;

    setAddingAddr(true);
    setTimeout(() => {
      setAddresses(prev => [
        ...prev,
        {
          _id: Date.now().toString(),
          // spread các trường đã được nhập
          fullName,
          phone,
          street,
          city,
          postalCode,
          country,
        },
      ]);
      setNewAddr({});
      setAddingAddr(false);
    }, 500);
  };

  const handleCheckout = () => {
    // chỉ test UI
    alert(
      `Đặt hàng ${total.toLocaleString()}₫\nvề địa chỉ: ${addresses.find(
        a => a._id === selectedAddressId
      )?.street}`
    );
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={it => it.skuId}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity onPress={() => onToggle(item.skuId)}>
              <Ionicons
                name={item.selected ? "checkbox" : "square-outline"}
                size={20}
                color={item.selected ? "tomato" : "#999"}
                style={{ marginRight: 8 }}
              />
            </TouchableOpacity>

            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.title}>
                {item.skuName}
              </Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.ctrlBtn}
                  onPress={() => onDecrease(item.skuId)}
                >
                  <Text>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.ctrlBtn}
                  onPress={() => onIncrease(item.skuId)}
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
                onPress={() => onRemove(item.skuId)}
              >
                <Text style={styles.remove}>×</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {isBuy ? (
        addresses.length > 0 ? (
          <View style={styles.pickerContainer}>
            {addresses.map(a => (
              <TouchableOpacity
                key={a._id}
                style={[
                  styles.addrItem,
                  selectedAddressId === a._id && styles.addrItemSelected,
                ]}
                onPress={() =>
                  setSelectedAddressId(a._id)
                }
              >
                <Text>{`${a.fullName}, ${a.street}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.addrForm}>
            {[
              "fullName",
              "phone",
              "street",
              "city",
              "postalCode",
              "country",
            ].map(k => (
              <TextInput
                key={k}
                placeholder={k}
                value={(newAddr as any)[k] || ""}
                onChangeText={txt =>
                  setNewAddr(p => ({ ...p, [k]: txt }))
                }
                style={styles.input}
              />
            ))}
            <Button
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

      <View style={styles.footer}>
        <Text style={styles.total}>
          Tổng cộng:{" "}
          <Text style={{ color: "tomato" }}>
            {total.toLocaleString()}₫
          </Text>
        </Text>
        <Button
          title={isBuy ? "Đặt hàng" : "Mua hàng"}
          onPress={isBuy ? handleCheckout : () => setIsBuy(true)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF", padding: 12 },
  separator: { height: 1, backgroundColor: "#EEE", marginVertical: 8 },
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
  addrItemSelected: {
    backgroundColor: "#FFEBEE",
    borderColor: "tomato",
  },
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
