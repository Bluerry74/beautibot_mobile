import { IProduct } from "@/types/product";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface ProductTableProps {
    data: IProduct[];
    onPressProduct: (product: IProduct) => void;
}

const ProductTable = ({ data, onPressProduct }: ProductTableProps) => {
    const renderItem = ({ item }: { item: IProduct }) => {
        const totalStock = item.skus.reduce((sum: any, sku: any) => sum + sku.stock, 0);
        return (
            <TouchableOpacity
                onPress={() => onPressProduct(item)}
                style={styles.item}
            >
                <View style={styles.left}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.brand}>{item.brand}</Text>
                    <Text style={styles.desc} numberOfLines={2}>
                        {item.description}
                    </Text>
                </View>
                <View style={styles.right}>
                    <Text style={styles.stock}>Tồn kho: {totalStock}</Text>
                    <View
                        style={[
                            styles.status,
                            {
                                backgroundColor: item.isActive
                                    ? "#4caf50"
                                    : "#f44336",
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

    return (
        <FlatList
            data={data}
            keyExtractor={(item: any) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16, paddingBottom: 20 },
    item: {
        flexDirection: "row",
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 2,
    },
    left: { flex: 3 },
    right: { flex: 2, justifyContent: "space-between", alignItems: "flex-end" },
    title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
    brand: { fontSize: 12, color: "#777" },
    desc: { fontSize: 12, color: "#555" },
    stock: { fontSize: 12, color: "#444" },
    status: {
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: { color: "#fff", fontSize: 12 },
});

export default ProductTable;
