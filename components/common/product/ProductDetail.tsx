import {
    useCreateSkuMutation,
    useDeleteProductSkuMutation,
    useDeleteSkuImageMutation,
    useGetProductDetailMutation,
    useReplaceSkuImageMutation,
    useUpdateProductMutation,
    useUpdateSkuMutation,
    useUploadSkuImagesMutation,
} from "@/tanstack/product";
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
import SkuImagesUpload from "../sku/SkuImagesUpload";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    product: IProduct | null | undefined;
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
    const createSkuMutation = useCreateSkuMutation();
    const deleteSkuMutation = useDeleteProductSkuMutation();
    const getProductDetailMutation = useGetProductDetailMutation();
    const uploadSkuImagesMutation = useUploadSkuImagesMutation();
    const deleteSkuImageMutation = useDeleteSkuImageMutation();
    const replaceSkuImageMutation = useReplaceSkuImageMutation();

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
            if (sku._id) {
                await updateSkuMutation.mutateAsync({
                    id: sku._id,
                    payload: sku,
                });
            } else {
                await createSkuMutation.mutateAsync({
                    ...sku,
                    productId: product._id,
                });
            }
        }

        const refreshed = await getProductDetailMutation.mutateAsync(
            product._id
        );
        setForm({
            name: refreshed.name,
            brand: refreshed.brand,
            description: refreshed.description,
            skus: refreshed.skus,
        });

        Toast.show({ type: "success", text1: "Đã lưu thành công" });
        onClose();
    };

    const handleDeleteSku = async (skuId: string) => {
        await deleteSkuMutation.mutateAsync(skuId);

        if (!product?._id) return;

        const refreshed = await getProductDetailMutation.mutateAsync(
            product._id
        );
        setForm((f: any) => ({ ...f, skus: refreshed.skus }));
    };

    const handleAddSku = () => {
        if (!product?._id) return;
        const newSku: Partial<ISku> = {
            variantName: `SKU ${form.skus.length + 1}`,
            price: 0,
            stock: 0,
            productId: product._id,
            images: [],
        };
        setForm((f: any) => ({ ...f, skus: [...f.skus, newSku] }));
    };

    const renderSkuItem = ({ item, index }: { item: ISku; index: number }) => (
        <View style={styles.skuCard}>
            <Text style={styles.skuTitle}>{item.variantName}</Text>
            <TextInput
                style={styles.input}
                placeholder="Giá"
                value={String(item.price ?? 0)}
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
                value={String(item.stock ?? 0)}
                keyboardType="numeric"
                onChangeText={(val) => {
                    const skus = [...form.skus];
                    skus[index].stock = Number(val);
                    setForm((f: any) => ({ ...f, skus }));
                }}
            />
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => item._id && handleDeleteSku(item._id)}
            >
                <Text style={{ color: "#fff", textAlign: "center" }}>Xoá</Text>
            </TouchableOpacity>
            <SkuImagesUpload
                skuId={item._id}
                images={item.images ?? []}
                onUpload={async (files) => {
                    await uploadSkuImagesMutation.mutateAsync({
                        skuId: item._id,
                        files,
                    });
                    if (!product?._id) return;
                    const refreshed =
                        await getProductDetailMutation.mutateAsync(
                            product?._id
                        );
                    setForm((f: any) => ({ ...f, skus: refreshed.skus }));
                }}
                onDelete={async (index) => {
                    await deleteSkuImageMutation.mutateAsync({
                        skuId: item._id,
                        index,
                    });
                    if (!product?._id) return;
                    const refreshed =
                        await getProductDetailMutation.mutateAsync(
                            product?._id
                        );
                    setForm((f: any) => ({ ...f, skus: refreshed.skus }));
                }}
                onReplace={async (index, file) => {
                    await replaceSkuImageMutation.mutateAsync({
                        skuId: item._id,
                        index,
                        file,
                    });
                    if (!product?._id) return;
                    const refreshed =
                        await getProductDetailMutation.mutateAsync(
                            product?._id
                        );
                    setForm((f: any) => ({ ...f, skus: refreshed.skus }));
                }}
            />
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
                    keyExtractor={(sku, idx) => sku._id ?? `temp-${idx}`}
                    renderItem={renderSkuItem}
                    scrollEnabled={false}
                />

                <TouchableOpacity
                    style={styles.addSkuBtn}
                    onPress={handleAddSku}
                >
                    <Text style={{ color: "#fff", textAlign: "center" }}>
                        + Thêm SKU
                    </Text>
                </TouchableOpacity>

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
    addSkuBtn: {
        marginTop: 10,
        backgroundColor: "#2563eb",
        paddingVertical: 10,
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
