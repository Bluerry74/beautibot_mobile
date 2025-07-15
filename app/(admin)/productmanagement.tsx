import ProductAddnewDialog from "@/components/product/ProductAddnewDialog";
import ProductTable from "@/components/product/ProductTable";
import { useProductsQuery } from "@/tanstack/product";
import { IProduct } from "@/types/product";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ProductManagement = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(
        null
    );
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { data: productList } = useProductsQuery();

    const productsData = productList?.data ?? [];
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Danh sách sản phẩm</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setOpenAdd(true)}
                >
                    <Ionicons name="add" size={20} color="white" />
                    <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
                </TouchableOpacity>
            </View>

            <ProductTable
                data={productsData}
                onPressProduct={(product) => {
                    setSelectedProduct(product);
                    setDialogOpen(true);
                }}
            />

            <ProductAddnewDialog
                visible={openAdd}
                onClose={() => setOpenAdd(false)}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: "#f9fafb",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        backgroundColor: "#ffffff",
        padding: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginTop: 50,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#111827",
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EF4444",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    addButtonText: {
        color: "white",
        marginLeft: 6,
        fontWeight: "600",
    },
});
export default ProductManagement;
