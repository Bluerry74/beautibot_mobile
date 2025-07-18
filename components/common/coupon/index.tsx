import {
    useDeleteCouponMutation,
    useUpdateCouponMutation,
} from "@/tanstack/coupon";
import { CircleX } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CouponEditDialog({ visible, coupon, onClose }: any) {
    const [form, setForm] = useState({
        code: "",
        value: 0,
        isUsed: false,
        expiresAt: "",
        description: "",
    });

    const updateMutation = useUpdateCouponMutation();
    const deleteMutation = useDeleteCouponMutation();

    useEffect(() => {
        if (coupon) {
            setForm(coupon);
        }
    }, [coupon]);

    const handleSave = async () => {
        await updateMutation.mutateAsync({
            id: coupon._id,
            payload: form,
        });
        onClose();
    };

    const handleDelete = async () => {
        await deleteMutation.mutateAsync(coupon._id);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide">
            <ScrollView contentContainerStyle={styles.container}>
                <View className="flex-row justify-between items-center mb-4">
                    <Text style={styles.title}>Coupon</Text>
                    <TouchableOpacity
                        onPress={onClose}
                        style={{ marginBottom: 20 }}
                    >
                        <CircleX size={20} />
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Code"
                    value={form.code}
                    onChangeText={(val) => setForm({ ...form, code: val })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Value"
                    keyboardType="numeric"
                    value={String(form.value)}
                    onChangeText={(val) =>
                        setForm({ ...form, value: Number(val) })
                    }
                />
                <TextInput
                    style={styles.input}
                    placeholder="Hạn dùng (ISO)"
                    value={form.expiresAt}
                    onChangeText={(val) => setForm({ ...form, expiresAt: val })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mô tả"
                    value={form.description}
                    onChangeText={(val) =>
                        setForm({ ...form, description: val })
                    }
                />

                <View style={styles.row}>
                    <Text>Đã sử dụng?</Text>
                    <Switch
                        value={form.isUsed}
                        onValueChange={(value) =>
                            setForm({ ...form, isUsed: value })
                        }
                    />
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={handleDelete}
                    >
                        <Text style={styles.footerText}>Xoá</Text>
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
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    toggle: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#2563eb",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    deleteBtn: {
        flex: 1,
        backgroundColor: "#f44336",
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
