
import { IProduct, ISku } from "@/types/product";
import React, { useEffect, useState } from "react";
import {
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import SkuImagesUpload from "./UploadSku";
import { useDeleteProductSkuMutation, useGetProductDetailMutation, useUpdateProductMutation, useUpdateSkuMutation } from "@/tanstack/product";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    product: IProduct | null;
}

const ProductDetailDialog = ({ isOpen, onClose, product }: Props) => {
    const [form, setForm] = useState<any>({
        name: "",
        brand: "",
        description: "",
        skus: [],
    });

    const updateProductMutation = useUpdateProductMutation();
    const updateSkuMutation = useUpdateSkuMutation();
    const deleteSkuMutation = useDeleteProductSkuMutation();
    const getProductDetailMutation = useGetProductDetailMutation();

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name,
                brand: product.brand,
                description: product.description,
                skus: product.skus ?? [],
            });
        }
    }, [product]);

    const handleSave = async () => {
        if (!product?._id) return;

        await updateProductMutation.mutateAsync({
            id: product._id,
            payload: {
                name: form.name,
                brand: form.brand,
                description: form.description,
            },
        });

        for (let sku of form.skus) {
            await updateSkuMutation.mutateAsync({ id: sku._id, payload: sku });
        }

        Toast.show({ type: "success", text1: "Đã lưu thành công" });
        onClose();
    };

    const handleDeleteSku = async (skuId: string) => {
        await deleteSkuMutation.mutateAsync(skuId);
        const refreshed = await getProductDetailMutation.mutateAsync(
            product?._id
        );
        setForm((f: any) => ({ ...f, skus: refreshed.skus }));
    };

    const renderSkuItem = ({ item, index }: { item: ISku; index: number }) => (
        <View style={styles.skuCard}>
            <Text style={styles.skuTitle}>{item.variantName}</Text>
            <TextInput
                style={styles.input}
                placeholder="Giá"
                value={String(item.price)}
                keyboardType="numeric"
                onChangeText={(val) => {
                    const skus = [...form.skus];
                    skus[index].price = Number(val);
                    setForm((f: any) => ({ ...f, skus }));
                }}
            />
            <TextInput
                style={styles.input}
                placeholder="Tồn kho"
                value={String(item.stock)}
                keyboardType="numeric"
                onChangeText={(val) => {
                    const skus = [...form.skus];
                    skus[index].stock = Number(val);
                    setForm((f: any) => ({ ...f, skus }));
                }}
            />
            <SkuImagesUpload
                images={sku.images}
                onChange={(updatedImages) => {
                    const skus = [...form.skus];
                    skus[index].images = updatedImages;
                    setForm((f: any) => ({ ...f, skus }));
                }}
            />

            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteSku(item._id)}
            >
                <Text style={{ color: "#fff", textAlign: "center" }}>Xoá</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Modal visible={isOpen} animationType="slide">
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Chi tiết sản phẩm</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Tên sản phẩm"
                    value={form.name}
                    onChangeText={(val) =>
                        setForm((f: any) => ({ ...f, name: val }))
                    }
                />
                <TextInput
                    style={styles.input}
                    placeholder="Thương hiệu"
                    value={form.brand}
                    onChangeText={(val) =>
                        setForm((f: any) => ({ ...f, brand: val }))
                    }
                />
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    placeholder="Mô tả"
                    multiline
                    value={form.description}
                    onChangeText={(val) =>
                        setForm((f: any) => ({ ...f, description: val }))
                    }
                />

                <Text style={styles.sectionTitle}>Danh sách SKU</Text>
                <FlatList
                    data={form.skus}
                    keyExtractor={(sku) => sku._id}
                    renderItem={renderSkuItem}
                    scrollEnabled={false}
                />

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={onClose}
                    >
                        <Text style={styles.footerText}>Huỷ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={handleSave}
                    >
                        <Text style={styles.footerText}>Lưu</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Modal>
    );
};

export default ProductDetailDialog;

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: "600", marginVertical: 8 },
    skuCard: {
        backgroundColor: "#f7f7f7",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
    },
    skuTitle: { fontWeight: "600", marginBottom: 6 },
    deleteBtn: {
        marginTop: 10,
        backgroundColor: "#f44336",
        paddingVertical: 8,
        borderRadius: 8,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: "#aaa",
        padding: 12,
        borderRadius: 8,
        marginRight: 8,
    },
    saveBtn: {
        flex: 1,
        backgroundColor: "#4caf50",
        padding: 12,
        borderRadius: 8,
        marginLeft: 8,
    },
    footerText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
