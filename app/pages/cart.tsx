// app/cart.tsx
import { CartItem, IAddress } from "@/app/types/product";
import { useCartActions } from "@/hooks/useCartActions";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function CartPage() {
  const {
    getCart,
    removeFromCart,
    updateQuantity,
    getAddresses,
    addAddress,
    checkout,
  } = useCartActions();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [loadingAddr, setLoadingAddr] = useState(true);
  const [isBuy, setIsBuy] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [newAddr, setNewAddr] = useState<Partial<Omit<IAddress, "_id">>>({});
  const [addingAddr, setAddingAddr] = useState(false);
  const router = useRouter();

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
  const onRemove = async (skuId: string) => {
    await removeFromCart(skuId);
    fetchCart();
  };
  const onToggle = (skuId: string) =>
    setCartItems(prev =>
      prev.map(i => i.skuId === skuId ? { ...i, selected: !i.selected } : i)
    );

  const total = useMemo(
    () =>
      cartItems
        .filter(i => i.selected)
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
      await checkout(selectedAddressId);
      Alert.alert("Thành công", "Đặt hàng thành công!");
      router.replace("/");
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

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={i => i.skuId}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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

            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.title}>{item.skuName}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.ctrlBtn} onPress={() => onDecrease(item)}><Text>−</Text></TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.ctrlBtn} onPress={() => onIncrease(item)}><Text>＋</Text></TouchableOpacity>
              </View>
            </View>

            <View style={styles.right}>
              <Text style={styles.price}>{(item.priceSnapshot * item.quantity).toLocaleString()}₫</Text>
              <TouchableOpacity onPress={() => onRemove(item.skuId)}><Text style={styles.remove}>×</Text></TouchableOpacity>
            </View>
          </View>
        )}
      />

      {isBuy
        ? loadingAddr
          ? <ActivityIndicator />
          : addresses.length > 0
            ? (
              <View style={styles.pickerContainer}>
                {addresses.map(a => (
                  <TouchableOpacity
                    key={a._id}
                    style={[styles.addrItem, selectedAddressId === a._id && styles.addrItemSelected]}
                    onPress={() => setSelectedAddressId(a._id)}
                  >
                    <Text>{`${a.fullName}, ${a.street}, ${a.city}`}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )
            : (
              <View style={styles.addrForm}>
                {["fullName","phone","street","city","postalCode","country"].map(k => (
                  <TextInput
                    key={k}
                    placeholder={k}
                    value={(newAddr as any)[k] || ""}
                    onChangeText={txt => setNewAddr(p => ({ ...p, [k]: txt }))}
                    style={styles.input}
                  />
                ))}
                <Button title={addingAddr ? "Đang thêm..." : "Thêm địa chỉ"} onPress={handleAddAddress} disabled={addingAddr}/>
              </View>
            )
        : (
          <TouchableOpacity style={styles.addrSelectBtn} onPress={() => setIsBuy(true)}>
            <Text>Chọn địa chỉ giao hàng</Text>
          </TouchableOpacity>
        )
      }

      <View style={styles.footer}>
        <Text style={styles.total}>Tổng cộng: <Text style={{color:"tomato"}}>{total.toLocaleString()}₫</Text></Text>
        <Button title={isBuy ? "Đặt hàng" : "Mua hàng"} onPress={isBuy ? handleCheckout : () => setIsBuy(true)}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex:1,justifyContent:"center",alignItems:"center" },
  container: {flex:1,backgroundColor:"#FFF",padding:12},
  separator:{height:1,backgroundColor:"#EEE",marginVertical:8},
  item:{flexDirection:"row",alignItems:"center",paddingVertical:8},
  image:{width:50,height:50,borderRadius:4,marginRight:8},
  title:{fontSize:14,fontWeight:"500"},
  qtyRow:{flexDirection:"row",alignItems:"center",marginTop:4},
  ctrlBtn:{borderWidth:1,borderColor:"#CCC",paddingHorizontal:6,paddingVertical:2,borderRadius:4},
  qtyText:{marginHorizontal:8},
  right:{alignItems:"flex-end"},
  price:{fontSize:14,fontWeight:"600",marginBottom:4},
  remove:{fontSize:18,color:"#999"},
  addrSelectBtn:{borderWidth:1,borderColor:"#CCC",borderRadius:6,padding:10,marginVertical:12,alignItems:"center"},
  pickerContainer:{marginVertical:12},
  addrItem:{padding:10,borderWidth:1,borderColor:"#CCC",borderRadius:6,marginBottom:8},
  addrItemSelected:{backgroundColor:"#FFEBEE",borderColor:"tomato"},
  addrForm:{marginVertical:12},
  input:{borderWidth:1,borderColor:"#CCC",borderRadius:6,padding:8,marginBottom:8},
  footer:{borderTopWidth:1,borderColor:"#EEE",paddingTop:12,flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  total:{fontSize:16,fontWeight:"600"},
});
