import { IProduct } from "@/types/product";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProductDetailDialog from "./ProductDetail";

interface ProductTableProps {
  data: IProduct[];
  onPressProduct: (product: IProduct) => void;
}

const ProductTable = ({ data, onPressProduct }: ProductTableProps) => {
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePressProduct = (product: IProduct) => {
    setSelectedProduct(product);
    setDialogOpen(true);
    onPressProduct(product);
  };

  const renderItem = ({ item }: { item: IProduct }) => {
    const totalStock = item.skus?.reduce((sum: any, sku: any) => sum + sku.stock, 0) || 0;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handlePressProduct(item)}
      >
        <View style={styles.left}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text numberOfLines={2} style={styles.description}>
            {item.description}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.stock}>Tồn kho: {totalStock}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: item.isActive ? "#4caf50" : "#f44336",
              },
            ]}
          >
            <Text style={styles.statusText}>
              {item.isActive ? "Đang bán" : "Ngừng bán"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!data) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={(item: any) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      />
      <ProductDetailDialog
        isOpen={dialogOpen}
        product={selectedProduct}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
};

export default ProductTable;

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  left: { flex: 3 },
  right: {
    flex: 2,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  brand: {
    fontSize: 12,
    color: "#777",
  },
  description: {
    fontSize: 12,
    color: "#444",
    marginTop: 4,
  },
  stock: {
    fontSize: 12,
    color: "#555",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
  },
});
