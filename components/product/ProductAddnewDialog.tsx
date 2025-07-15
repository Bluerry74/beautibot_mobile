import { useCreateProductMutation } from "@/tanstack/product";
import React, { useState } from "react";
import {
    Button,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import CheckboxBadge from "../common/CheckBoxBadge";
import EditDetailList from "../common/EditDetailList";
import StatusToggleBadge from "../common/StatusToggleBadge";

const skinTypeOptions = [
    { label: "Da thường", value: "normal" },
    { label: "Da khô", value: "dry" },
    { label: "Da dầu", value: "oily" },
    { label: "Da hỗn hợp", value: "combination" },
    { label: "Da nhạy cảm", value: "sensitive" },
];

export default function ProductAddnewDialog({
    visible,
    onClose,
}: {
    visible: boolean;
    onClose: () => void;
}) {
    const [form, setForm] = useState<{
        name: string;
        brand: string;
        description: string;
        ingredients: string[];
        skinConcerns: string[];
        suitableForSkinTypes: string[];
        isActive: boolean;
    }>({
        name: "",
        brand: "",
        description: "",
        ingredients: [],
        skinConcerns: [],
        suitableForSkinTypes: [],
        isActive: true,
    });

    const createProduct = useCreateProductMutation();

    const handleSave = () => {
        console.log('form = ',form);
        
        createProduct.mutate(form);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide">
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Thêm sản phẩm mới</Text>

                <Text style={styles.label}>Tên sản phẩm</Text>
                <TextInput
                    style={styles.input}
                    value={form.name}
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, name: text }))
                    }
                />

                <Text style={styles.label}>Thương hiệu</Text>
                <TextInput
                    style={styles.input}
                    value={form.brand}
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, brand: text }))
                    }
                />

                <Text style={styles.label}>Mô tả</Text>
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    multiline
                    value={form.description}
                    onChangeText={(text) =>
                        setForm((f) => ({ ...f, description: text }))
                    }
                />

                <EditDetailList
                    label="Thành phần"
                    values={form.ingredients}
                    onChange={(vals) =>
                        setForm((f: any) => ({ ...f, ingredients: vals }))
                    }
                />
                <EditDetailList
                    label="Vấn đề da"
                    values={form.skinConcerns}
                    onChange={(vals) =>
                        setForm((f: any) => ({ ...f, skinConcerns: vals }))
                    }
                />

                <Text style={styles.label}>Dành cho da</Text>
                <View style={styles.badgeGroup}>
                    {skinTypeOptions.map((item: any) => (
                        <CheckboxBadge
                            key={item.value}
                            title={item.label}
                            checked={form.suitableForSkinTypes.includes(
                                item.value
                            )}
                            onCheckedChange={(checked) =>
                                setForm((f: any) => ({
                                    ...f,
                                    suitableForSkinTypes: checked
                                        ? [
                                              ...f.suitableForSkinTypes,
                                              item.value,
                                          ]
                                        : f.suitableForSkinTypes.filter(
                                              (t: any) => t !== item.value
                                          ),
                                }))
                            }
                        />
                    ))}
                </View>

                <StatusToggleBadge
                    value={form.isActive}
                    onChange={(val) =>
                        setForm((f) => ({ ...f, isActive: val }))
                    }
                />

                <View style={styles.footer}>
                    <Button title="Hủy" onPress={onClose} />
                    <Button title="Lưu sản phẩm" onPress={handleSave} />
                </View>
            </ScrollView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
    label: { fontWeight: "600", marginTop: 12 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        backgroundColor: "#fff",
    },
    badgeGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginVertical: 8,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
    },
});
