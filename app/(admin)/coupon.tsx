import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCouponsQuery } from "@/tanstack/coupon";
import CouponEditDialog from "@/components/common/coupon";

export default function CouponListScreen() {
  const { data, isLoading } = useCouponsQuery();
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEdit = (coupon: any) => {
    setSelectedCoupon(coupon);
    setDialogOpen(true);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.data || []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={styles.itemCard}
          >
            <Text style={styles.code}>{item.code}</Text>
            <Text>Giá trị: {item.value}</Text>
            <Text>Dùng rồi: {item.isUsed ? "✅" : "❌"}</Text>
            <Text>HSD: {item.expiresAt}</Text>
          </TouchableOpacity>
        )}
      />
      <CouponEditDialog
        visible={dialogOpen}
        coupon={selectedCoupon}
        onClose={() => setDialogOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  itemCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  code: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
});
