import React, { use, useEffect, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import CouponEditDialog from "@/components/common/coupon";
import { get } from "@/httpservices/httpService";
import { TicketPlus } from "lucide-react-native";

export default function CouponListScreen() {
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [coupon, setCoupon] = useState(null);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await get<any>("/coupon/admin/all");
                console.log(res.data);
                
                setCoupon(res?.data.data);
            } catch (error) {
                console.error("❌ Failed to fetch coupons:", error);
            }
        };
        fetchCoupons();
    }, []);

    const handleEdit = (coupon: any) => {
        setSelectedCoupon(coupon);
        setDialogOpen(true);
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
                className="mt-6"
                data={coupon}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleEdit(item)}
                        style={styles.card}
                    >
                        <View className="mb-2 flex-row justify-between">
                            <Text style={styles.code}>{item.code}</Text>
                            <Text style={styles.badge}>
                                {item.isUsed ? "Đã dùng" : "Chưa dùng"}
                            </Text>
                        </View>
                        <Text style={styles.valueText}>
                            🎁 Giá trị: {item.value}
                        </Text>
                        <Text style={styles.expired}>
                            📅 HSD: {item.expiresAt}
                        </Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
            <CouponEditDialog
                visible={dialogOpen}
                coupon={selectedCoupon}
                onClose={() => setDialogOpen(false)}
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
    code: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2f80ed",
    },
    badge: {
        backgroundColor: "#e0e0e0",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        fontSize: 12,
        color: "#333",
    },
    valueText: {
        fontSize: 14,
        color: "#555",
        marginBottom: 4,
    },
    expired: {
        fontSize: 13,
        color: "#999",
    },
});
