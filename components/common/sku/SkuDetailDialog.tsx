// components/sku/SkuDetailDialog.tsx
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import SkuImagesUpload from "./SkuImagesUpload";
import {
  useDeleteProductSkuMutation,
  useReplaceSkuImageMutation,
  useUpdateSkuMutation,
  useUploadSkuImagesMutation,
  useDeleteSkuImageMutation,
  useGetProductDetailMutation,
} from "@/tanstack/product";
import { ISku } from "@/types/product";

interface Props {
  sku: ISku;
  onClose: () => void;
  onUpdated?: (newSkus: ISku[]) => void;
}

export default function SkuDetailDialog({ sku, onClose, onUpdated }: Props) {
  const getProductDetailMutation = useGetProductDetailMutation();
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
    return cleaned;
  };
  const [form, setForm] = useState<ISku>(sku);

  const updateSkuMutation = useUpdateSkuMutation();
  const deleteSkuMutation = useDeleteProductSkuMutation();
  const uploadSkuImagesMutation = useUploadSkuImagesMutation();
  const deleteSkuImageMutation = useDeleteSkuImageMutation();
  const replaceSkuImageMutation = useReplaceSkuImageMutation();

  const handleUpdate = async () => {
    try {
      await updateSkuMutation.mutateAsync({
        id: sku._id,
        payload: sanitizeSkuPayload(form),
      });
      Toast.show({ type: "success", text1: "Đã cập nhật SKU" });
      const refreshed = await getProductDetailMutation.mutateAsync(
        sku.productId
      );
      onUpdated?.(refreshed.skus);
      onClose();
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi cập nhật SKU",
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
      Toast.show({ type: "error", text1: "Lỗi xoá SKU", text2: err.message });
    }
  };
  useEffect(() => {
    setForm(sku);
  }, [sku]);
  return (
    <Modal visible animationType="slide">
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{form.variantName}</Text>

        <TextInput
          style={styles.input}
          placeholder="Giá"
          keyboardType="numeric"
          value={String(form.price)}
          onChangeText={(val) => setForm({ ...form, price: Number(val) })}
        />
        <TextInput
          style={styles.input}
          placeholder="Tồn kho"
          keyboardType="numeric"
          value={String(form.stock)}
          onChangeText={(val) => setForm({ ...form, stock: Number(val) })}
        />
        <TextInput
          style={styles.input}
          placeholder="Batch code"
          value={form.batchCode}
          onChangeText={(val) => setForm({ ...form, batchCode: val })}
        />
        <TextInput
          style={styles.input}
          placeholder="Formulation Type"
          value={form.formulationType}
          onChangeText={(val) => setForm({ ...form, formulationType: val })}
        />

        <SkuImagesUpload
          skuId={sku._id}
          images={form.images || []}
          onUpload={async (files) => {
            await uploadSkuImagesMutation.mutateAsync({
              skuId: sku._id,
              files,
            });
            const refreshed = await getProductDetailMutation.mutateAsync(
              sku.productId
            );
            onUpdated?.(refreshed.skus);
          }}
          onDelete={async (index) => {
            await deleteSkuImageMutation.mutateAsync({ skuId: sku._id, index });
            const refreshed = await getProductDetailMutation.mutateAsync(
              sku.productId
            );
            onUpdated?.(refreshed.skus);
          }}
          onReplace={async (index, file) => {
            await replaceSkuImageMutation.mutateAsync({
              skuId: sku._id,
              index,
              file,
            });
            const refreshed = await getProductDetailMutation.mutateAsync(
              sku.productId
            );
            onUpdated?.(refreshed.skus);
          }}
        />

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate}>
            <Text style={styles.btnText}>Cập nhật</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.btnText}>Xoá</Text>
          </TouchableOpacity>
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
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
