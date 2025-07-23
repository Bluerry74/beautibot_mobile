import CouponEditDialog from "@/components/common/coupon";
import { useCouponsQuery } from "@/tanstack/coupon";
import { useAllUser } from "@/tanstack/user/regis";
import { TicketPlus } from "lucide-react-native";
import React, { useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function CouponListScreen() {
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { data: allUsers } = useAllUser();

    const { data: coupon = [], refetch } = useCouponsQuery();

    const handleEdit = (coupon: any) => {
        setSelectedCoupon(coupon);
        setDialogOpen(true);
    };

    const renderItem = ({ item }: { item: any }) => {
        const user = allUsers?.data?.find((u) => u._id === item.userId);

        return (
            <TouchableOpacity
                onPress={() => handleEdit(item)}
                style={styles.card}
            >
                <View style={styles.row}>
                    <Text style={styles.code}>{item.code}</Text>
                    <Text
                        style={[
                            styles.badge,
                            {
                                backgroundColor: item.isUsed
                                    ? "#ffe0e0"
                                    : "#e0ffe0",
                                color: item.isUsed ? "#c62828" : "#2e7d32",
                            },
                        ]}
                    >
                        {item.isUsed ? "Đã dùng" : "Chưa dùng"}
                    </Text>
                </View>
                <Text style={styles.valueText}>🎁 Giá trị: {item.value}K</Text>
                {item.description ? (
                    <Text style={styles.descriptionText}>
                        📝 {item.description}
                    </Text>
                ) : null}
                <Text style={styles.userText}>
                    👤 Người dùng: {user?.email ?? "Không rõ"}
                </Text>
                <Text style={styles.dateText}>
                    🕒 Ngày tạo:{" "}
                    {new Date(item.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
            </TouchableOpacity>
        );
    };
    return (
        <SafeAreaView className=" flex-1 p-4">
            <View className="mt-6">
                <Text className="text-2xl font-bold">Mã giảm giá</Text>
                <Text className="text-gray-600 mb-3 text-lg">
                    Quản lý và chỉnh sửa mã giảm giá tại đây.
                </Text>
            </View>
            <TouchableOpacity
                className="p-3 rounded-lg mb-4 flex-row items-center justify-center"
                style={{ backgroundColor: "#ff9c86" }}
                onPress={() => setDialogOpen(true)}
            >
                <TicketPlus size={20} color="white" />
                <Text className=" ml-2 text-white text-center">
                    Thêm mã giảm giá
                </Text>
            </TouchableOpacity>

            <FlatList
                data={coupon?.data || []}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
            />

            <CouponEditDialog
                visible={dialogOpen}
                coupon={selectedCoupon}
                onClose={() => setDialogOpen(false)}
                onSaved={() => {
                    refetch();
                    setSelectedCoupon(null);
                    setDialogOpen(false);
                }}
                onDeleted={() => {
                    refetch();
                    setDialogOpen(false);
                    setSelectedCoupon(null);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    expired: {
        fontSize: 13,
        color: "#999",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    code: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2f80ed",
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        fontSize: 12,
        overflow: "hidden",
    },
    valueText: {
        fontSize: 14,
        color: "#555",
        marginBottom: 4,
    },
    dateText: {
        fontSize: 13,
        color: "#888",
    },
    userText: {
        fontSize: 13,
        color: "#444",
        marginBottom: 4,
    },
    descriptionText: {
        fontSize: 13,
        color: "#666",
        marginBottom: 4,
        fontStyle: "italic",
    },
});
