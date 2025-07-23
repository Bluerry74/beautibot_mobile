// components/sku/SkuDetailDialog.tsx
import {
    useCreateSkuMutation,
    useDeletedSkuImages,
    useDeleteProductSkuMutation,
    useGetProductDetailMutation,
    useReplaceSkuImageMutation,
    useUpdateSkuMutation,
    useUploadSkuImagesMutation,
} from "@/tanstack/product";
import { ISku } from "@/types/product";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Switch } from "react-native-paper";
import Toast from "react-native-toast-message";
import SkuImagesUpload from "./SkuImagesUpload";

interface Props {
    sku: ISku;
    onClose: () => void;
    onUpdated?: (newSkus: ISku[]) => void;
}

export default function SkuDetailDialog({ sku, onClose, onUpdated }: Props) {
    const [form, setForm] = useState<ISku>(sku);
    const [showManufacturedPicker, setShowManufacturedPicker] = useState(false);
    const [showExpiredPicker, setShowExpiredPicker] = useState(false);

    const isNew = !sku._id;

    const getProductDetailMutation = useGetProductDetailMutation();
    const updateSkuMutation = useUpdateSkuMutation();
    const deleteSkuMutation = useDeleteProductSkuMutation();
    const uploadSkuImagesMutation = useUploadSkuImagesMutation();
    const deleteSkuImageMutation = useDeletedSkuImages();
    const replaceSkuImageMutation = useReplaceSkuImageMutation();
    const createSkuMutation = useCreateSkuMutation();

    const sanitizeSkuPayload = (sku: ISku) => {
        const {
            _id,
            createdAt,
            updatedAt,
            __v,
            returnedStock,
            images,
            ...cleaned
        } = sku;
        return {
            ...cleaned,
            dimensions: {
                length: sku.dimensions?.length ?? 0,
                width: sku.dimensions?.width ?? 0,
                height: sku.dimensions?.height ?? 0,
            },
        };
    };
    const handleSubmit = async () => {
        try {
            const payload = sanitizeSkuPayload(form);
            console.log("📤 Payload:", payload);
            if (isNew) {
                await createSkuMutation.mutateAsync({
                    ...payload,
                    productId: sku.productId,
                });
                Toast.show({ type: "success", text1: "Đã tạo SKU" });
            } else {
                await updateSkuMutation.mutateAsync({ id: sku._id, payload });
                Toast.show({ type: "success", text1: "Đã cập nhật SKU" });
            }
            const refreshed = await getProductDetailMutation.mutateAsync(
                sku.productId
            );
            onUpdated?.(refreshed.skus);
            onClose();
        } catch (err: any) {
            Toast.show({
                type: "error",
                text1: isNew ? "Lỗi tạo SKU" : "Lỗi cập nhật SKU",
                text2: err.message,
            });
        }
    };

    const handleDelete = async () => {
        try {
            await deleteSkuMutation.mutateAsync(sku._id);
            Toast.show({ type: "success", text1: "Đã xoá SKU" });
            const refreshed = await getProductDetailMutation.mutateAsync(
                sku.productId
            );
            onUpdated?.(refreshed.skus);
            onClose();
        } catch (err: any) {
            Toast.show({
                type: "error",
                text1: "Lỗi xoá SKU",
                text2: err.message,
            });
        }
    };

    const handleImagesUpdated = (newSkus: ISku[]) => {
        // Find the updated SKU by id
        const updatedSku = newSkus.find(s => s._id === form._id);
        if (updatedSku) {
            setForm(prev => ({ ...prev, images: updatedSku.images }));
        }
    };

    useEffect(() => {
        setForm(sku);
    }, [sku]);
    return (
        <Modal visible animationType="slide">
            <ScrollView style={styles.container}>
                <Text style={styles.title}>{form.variantName}</Text>

                <Text style={styles.label}>Giá</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(form.price)}
                    onChangeText={(val) =>
                        setForm({ ...form, price: Number(val) })
                    }
                />

                <Text style={styles.label}>Tồn kho</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(form.stock)}
                    onChangeText={(val) =>
                        setForm({ ...form, stock: Number(val) })
                    }
                />

                <Text style={styles.label}>Mã lô</Text>
                <TextInput
                    style={styles.input}
                    value={form.batchCode}
                    onChangeText={(val) => setForm({ ...form, batchCode: val })}
                />

                <Text style={styles.label}>Loại công thức</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={form.formulationType}
                        onValueChange={(value) =>
                            setForm({ ...form, formulationType: value })
                        }
                    >
                        <Picker.Item label="Kem (cream)" value="cream" />
                        <Picker.Item label="Gel" value="gel" />
                        <Picker.Item label="Serum" value="serum" />
                        <Picker.Item label="Bọt (foam)" value="foam" />
                        <Picker.Item label="Lotion" value="lotion" />
                    </Picker>
                </View>

                <Text style={styles.label}>Ngày sản xuất</Text>
                <TouchableOpacity
                    onPress={() => setShowManufacturedPicker(true)}
                >
                    <TextInput
                        style={styles.input}
                        editable={false}
                        value={
                            form.manufacturedAt
                                ? new Date(
                                      form.manufacturedAt
                                  ).toLocaleDateString("vi-VN")
                                : ""
                        }
                        placeholder="Chọn ngày sản xuất"
                    />
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={showManufacturedPicker}
                    mode="date"
                    date={
                        form.manufacturedAt
                            ? new Date(form.manufacturedAt)
                            : new Date()
                    }
                    onConfirm={(date: any) => {
                        setForm({
                            ...form,
                            manufacturedAt: date.toISOString(),
                        });
                        setShowManufacturedPicker(false);
                    }}
                    onCancel={() => setShowManufacturedPicker(false)}
                />

                <Text style={styles.label}>Ngày hết hạn</Text>
                <TouchableOpacity onPress={() => setShowExpiredPicker(true)}>
                    <TextInput
                        style={styles.input}
                        editable={false}
                        value={
                            form.expiredAt
                                ? new Date(form.expiredAt).toLocaleDateString(
                                      "vi-VN"
                                  )
                                : ""
                        }
                        placeholder="Chọn ngày hết hạn"
                    />
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={showExpiredPicker}
                    mode="date"
                    date={
                        form.expiredAt ? new Date(form.expiredAt) : new Date()
                    }
                    onConfirm={(date: any) => {
                        setForm({ ...form, expiredAt: date.toISOString() });
                        setShowExpiredPicker(false);
                    }}
                    onCancel={() => setShowExpiredPicker(false)}
                />

                <View style={styles.row}>
                    <Text>Cho phép đổi trả?</Text>
                    <Switch
                        value={form.returnable}
                        onValueChange={(val) =>
                            setForm({ ...form, returnable: val })
                        }
                    />
                </View>

                <Text style={styles.label}>Giảm giá (%)</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(form.discount ?? 0)}
                    onChangeText={(val) =>
                        setForm({ ...form, discount: Number(val) })
                    }
                />

                <Text style={styles.label}>Khối lượng (gram)</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(form.weight ?? 0)}
                    onChangeText={(val) =>
                        setForm({ ...form, weight: Number(val) })
                    }
                />

                <Text style={styles.label}>Chiều dài (cm)</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={String(form.dimensions?.length ?? 0)}
                    onChangeText={(val) =>
                        setForm({
                            ...form,
                            dimensions: {
                                ...(form.dimensions || {}),
                                length: Number(val),
                            },
                        })
                    }
                />

                <SkuImagesUpload
                    skuId={sku._id}
                    images={form.images || []}
                    onUpload={async (files) => {
                        try {
                            await uploadSkuImagesMutation.mutateAsync({
                                skuId: sku._id,
                                files,
                            });
                            const refreshed = await getProductDetailMutation.mutateAsync(sku.productId);
                            handleImagesUpdated(refreshed.skus);
                        } catch (err: any) {
                            console.error('[DEBUG] Lỗi upload ảnh:', err);
                            if (err?.response) {
                                console.error('[DEBUG] Response status:', err.response.status);
                                console.error('[DEBUG] Response data:', err.response.data);
                            }
                        }
                    }}
                    onDelete={async (index) => {
                        await deleteSkuImageMutation.mutateAsync({
                            skuId: sku._id,
                            imageIndex: index,
                        });
                        const refreshed = await getProductDetailMutation.mutateAsync(sku.productId);
                        handleImagesUpdated(refreshed.skus);
                    }}
                    onReplace={async (index, file) => {
                        await replaceSkuImageMutation.mutateAsync({
                            skuId: sku._id,
                            index,
                            file,
                        });
                        const refreshed = await getProductDetailMutation.mutateAsync(sku.productId);
                        handleImagesUpdated(refreshed.skus);
                    }}
                />

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.updateBtn}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.btnText}>
                            {isNew ? "Tạo SKU" : "Cập nhật"}
                        </Text>
                    </TouchableOpacity>

                    {!isNew && (
                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={handleDelete}
                        >
                            <Text style={styles.btnText}>Xoá</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity style={styles.backBtn} onPress={onClose}>
                    <Text style={styles.btnText}>Quay lại danh sách</Text>
                </TouchableOpacity>
            </ScrollView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 12,
    },
    updateBtn: {
        flex: 1,
        backgroundColor: "#f59e0b",
        padding: 12,
        borderRadius: 8,
        marginRight: 6,
    },
    deleteBtn: {
        flex: 1,
        backgroundColor: "#f44336",
        padding: 12,
        borderRadius: 8,
        marginLeft: 6,
    },
    backBtn: {
        backgroundColor: "#aaa",
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 20,
    },
    btnText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "bold",
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        marginBottom: 12,
    },
    label: {
        marginBottom: 4,
        fontWeight: "500",
    },
});
