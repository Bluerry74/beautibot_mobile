import { Sku } from "@/app/types/product";
import { useCartActions } from "@/hooks/useCartActions";
import { useAuthStore } from "@/store/auth";
import { ISku } from "@/types/product";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  sku: ISku;
}

export default function CartButton({ sku }: Props) {
  const token = useAuthStore((state) => state.accessToken); // ✅ lấy token từ store
  const { addToCart } = useCartActions();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      if (!token) {
        console.warn("❌ Không tìm thấy token, vui lòng đăng nhập");
        return;
      }
      const data = await addToCart(sku as Sku);
      console.log("✅ Đã thêm vào giỏ hàng", data);
      
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đã thêm sản phẩm vào giỏ hàng 🎉",
      });
    } catch (err: any) {
      console.error("❌ Thêm giỏ hàng thất bại", err.response?.data || err.message);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể thêm sản phẩm vào giỏ hàng 😢",
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <TouchableOpacity
      onPress={handleAdd}
      disabled={loading}
      style={[styles.button, loading && styles.buttonDisabled]}
    >
      {loading ? (
        <ActivityIndicator color="#000" />
      ) : (
        <Text style={styles.text}>Add to cart</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
