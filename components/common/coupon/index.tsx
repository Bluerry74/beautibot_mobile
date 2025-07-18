import {
    useDeleteCouponMutation,
    useUpdateCouponMutation,
} from "@/tanstack/coupon";
import { CircleX } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
export default function CouponEditDialog({
    visible,
    coupon,
    onClose,
    onSaved,
    onDeleted,
}: any) {
    const [form, setForm] = useState({
        code: "",
        value: 0,
        isUsed: false,
        expiresAt: "",
        description: "",
    });
    const updateMutation = useUpdateCouponMutation();
    const deleteMutation = useDeleteCouponMutation();
    const [isDateModalVisible, setDateModalVisible] = useState(false);
    useEffect(() => {
        if (coupon) {
            setForm({
                code: coupon.code,
                value: coupon.value,
                isUsed: coupon.isUsed,
                expiresAt: coupon.expiresAt || "", // ensure valid string or empty
                description: coupon.description || "",
            });
        }
    }, [coupon]);

    const handleSave = async () => {
        try {
            const { expiresAt, ...restForm } = form;

            const payload: any = {
                ...restForm,
            };

            if (expiresAt) {
                payload.expiresAt = new Date(expiresAt).toISOString(); // ensure ISO format
            }

            await updateMutation.mutateAsync({
                id: coupon._id,
                payload,
            });

            onSaved?.();
        } catch (err) {
            console.error("❌ Error updating coupon:", err);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Xác nhận xoá",
            "Bạn có chắc chắn muốn xoá mã giảm giá này?",
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
                            await deleteMutation.mutateAsync(coupon._id);
                            onDeleted?.();
                        } catch (err: any) {
                            if (err.response) {
                                console.error(
                                    "📦 Server responded with error:",
                                    {
                                        status: err.response.status,
                                        data: err.response.data,
                                    }
                                );
                            } else if (err.request) {
                                console.error(
                                    "📡 No response received:",
                                    err.request
                                );
                            } else {
                                console.error(
                                    "❌ Unexpected error:",
                                    err.message
                                );
                            }
                        }
                    },
                },
            ]
        );
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
                <TouchableOpacity
                    style={styles.dateInput}
                    onPress={() => setDateModalVisible(true)}
                >
                    <Text style={{ color: form.expiresAt ? "#000" : "#aaa" }}>
                        {form.expiresAt
                            ? new Date(form.expiresAt).toLocaleDateString(
                                  "vi-VN"
                              )
                            : "Chọn ngày hết hạn"}
                    </Text>
                </TouchableOpacity>

                <DateTimePickerModal
                    isVisible={isDateModalVisible}
                    mode="datetime"
                    date={
                        form.expiresAt ? new Date(form.expiresAt) : new Date()
                    }
                    onConfirm={(date) => {
                        setDateModalVisible(false);
                        setForm({ ...form, expiresAt: date.toISOString() });
                    }}
                    onCancel={() => setDateModalVisible(false)}
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
    dateInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },

    footerText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
