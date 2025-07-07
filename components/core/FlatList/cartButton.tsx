// app/components/CartButton.tsx
import { Sku } from "@/app/types/product";
import { useCartActions } from "@/hooks/useCartActions";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

interface Props {
  sku: Sku;
}

export default function CartButton({ sku }: Props) {
  const { addToCart } = useCartActions();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      const data = await addToCart(sku);
      console.log("✅ Đã thêm vào giỏ hàng", data);
    } catch (err: any) {
      // In chi tiết lỗi trả về từ server
      console.error("❌ Thêm giỏ hàng thất bại", err.response?.data || err.message);
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
