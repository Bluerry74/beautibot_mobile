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
  Alert,
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
import SkuDetailDialog from "../sku/SkuDetailDialog";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: IProduct | any;
}

const ProductDetailDialog = ({ isOpen, onClose, product }: Props) => {
  const [selectedSku, setSelectedSku] = useState<ISku | null>(null);
  const [form, setForm] = useState<any>({
    name: "",
    brand: "",
    description: "",
    skus: [],
  });
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
    try {
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
            payload: sanitizeSkuPayload(sku),
          });
        } else {
          await createSkuMutation.mutateAsync({
            ...sanitizeSkuPayload(sku),
            productId: product._id,
          });
        }
      }

      Toast.show({
        type: "success",
        text1: "Đã cập nhật sản phẩm thành công!",
      });
      onClose();
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi khi lưu",
        text2: err?.message,
      });
    }
  };

  const handleDeleteSku = (skuId: string, variantName?: string) => {
    Alert.alert(
      "Xác nhận xoá",
      `Bạn có chắc chắn muốn xoá SKU${variantName ? ` "${variantName}"` : ""}?`,
      [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Xoá",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSkuMutation.mutateAsync(skuId);

              if (!product?._id) return;

              const refreshed = await getProductDetailMutation.mutateAsync(
                product._id
              );
              setForm((f: any) => ({ ...f, skus: refreshed.skus }));

              Toast.show({
                type: "success",
                text1: `Đã xoá SKU${variantName ? ` ${variantName}` : ""}`,
              });
            } catch (err: any) {
              Toast.show({
                type: "error",
                text1: "Lỗi khi xoá SKU",
                text2: err?.message,
              });
            }
          },
        },
      ]
    );
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

  const renderSkuItem = ({ item }: { item: ISku }) => (
    <TouchableOpacity
      style={styles.skuCard}
      onPress={() => setSelectedSku(item)}
    >
      <Text style={styles.skuTitle}>{item.variantName}</Text>
      <Text>Giá: {item.price}</Text>
      <Text>Tồn kho: {item.stock}</Text>
      <Text style={{ color: "#2563eb", marginTop: 4 }}>Xem chi tiết</Text>
    </TouchableOpacity>
  );

  const renderSkuDetail = (sku: ISku) => (
    <ScrollView style={{ padding: 16 }}>
      <Text style={styles.skuTitle}>{sku.variantName}</Text>
      <TextInput
        style={styles.input}
        placeholder="Giá"
        value={String(sku.price ?? 0)}
        keyboardType="numeric"
        onChangeText={(val) => {
          setSelectedSku((s) => s && { ...s, price: Number(val) });
        }}
      />
      <TextInput
        style={styles.input}
        placeholder="Tồn kho"
        value={String(sku.stock ?? 0)}
        keyboardType="numeric"
        onChangeText={(val) => {
          setSelectedSku((s) => s && { ...s, stock: Number(val) });
        }}
      />

      {/* Upload Ảnh */}
      <SkuImagesUpload
        skuId={sku._id}
        images={sku.images ?? []}
        onUpload={async (files) => {
          await uploadSkuImagesMutation.mutateAsync({ skuId: sku._id, files });
          const refreshed = await getProductDetailMutation.mutateAsync(
            product!._id
          );
          setForm((f: any) => ({ ...f, skus: refreshed.skus }));
        }}
        onDelete={async (index) => {
          await deleteSkuImageMutation.mutateAsync({ skuId: sku._id, index });
          const refreshed = await getProductDetailMutation.mutateAsync(
            product!._id
          );
          setForm((f: any) => ({ ...f, skus: refreshed.skus }));
        }}
        onReplace={async (index, file) => {
          await replaceSkuImageMutation.mutateAsync({
            skuId: sku._id,
            index,
            file,
          });
          const refreshed = await getProductDetailMutation.mutateAsync(
            product!._id
          );
          setForm((f: any) => ({ ...f, skus: refreshed.skus }));
        }}
      />

      <View style={styles.skuActions}>
        <TouchableOpacity
          style={styles.updateBtn}
          onPress={async () => {
            if (!sku._id) return;
            await updateSkuMutation.mutateAsync({
              id: sku._id,
              payload: sanitizeSkuPayload(sku),
            });
            const refreshed = await getProductDetailMutation.mutateAsync(
              product!._id
            );
            setForm((f: any) => ({ ...f, skus: refreshed.skus }));
            Toast.show({ type: "success", text1: "Cập nhật SKU thành công" });
          }}
        >
          <Text style={{ color: "#fff" }}>Cập nhật</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => sku._id && handleDeleteSku(sku._id, sku.variantName)}
        >
          <Text style={{ color: "#fff" }}>Xoá</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.cancelBtn, { marginTop: 16 }]}
        onPress={() => setSelectedSku(null)}
      >
        <Text style={styles.footerText}>Quay lại danh sách</Text>
      </TouchableOpacity>
    </ScrollView>
  );
  return (
    <Modal visible={isOpen} animationType="slide">
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Chi tiết sản phẩm</Text>

        <TextInput
          style={styles.input}
          placeholder="Tên sản phẩm"
          value={form.name}
          onChangeText={(val) => setForm((f: any) => ({ ...f, name: val }))}
        />
        <TextInput
          style={styles.input}
          placeholder="Thương hiệu"
          value={form.brand}
          onChangeText={(val) => setForm((f: any) => ({ ...f, brand: val }))}
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

        {!selectedSku ? (
          <>
            <FlatList
              data={form.skus}
              keyExtractor={(sku, idx) => sku._id ?? `temp-${idx}`}
              renderItem={renderSkuItem}
              scrollEnabled={false}
            />
            <TouchableOpacity style={styles.addSkuBtn} onPress={handleAddSku}>
              <Text style={{ color: "#fff", textAlign: "center" }}>
                + Thêm SKU
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          renderSkuDetail(selectedSku)
        )}

        {!selectedSku && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.footerText}>Huỷ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.footerText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        )}
        {selectedSku && (
          <SkuDetailDialog
            sku={selectedSku}
            onClose={() => setSelectedSku(null)}
            onUpdated={(newSkus) => {
              if (newSkus) {
                setForm((prev: any) => ({ ...prev, skus: newSkus }));
              }
            }}
          />
        )}
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
  skuActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  updateBtn: {
    flex: 1,
    backgroundColor: "#f59e0b",
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtn: {
    width: 80,
    height: 40,
    backgroundColor: "#f44336",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
