import { useOrderChartData } from "@/hooks/useOrderChartData";
import { useAddressesQuery } from "@/tanstack/address";
import { useAllOrder, useAnalytics } from "@/tanstack/order";
import { useProductsQuery } from "@/tanstack/product";
import { useAllUser } from "@/tanstack/user/regis";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from 'react-native-safe-area-context';
    
const Dashboard = () => {
    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
    };

    const screenWidth = Dimensions.get("window").width;
    const { data: getUsers } = useAllUser();
    const { data: getAnalytics } = useAnalytics();
    const { data: getproducts } = useProductsQuery();
    const { data: getOrders } = useAllOrder();
    const { data: ordersChartData } = useOrderChartData();
    const { data: getAddresses } = useAddressesQuery();

    const totalUsers = getUsers?.data?.length || 0;
    const totalProducts = getproducts?.data?.length || 0;
    const totalOrders = getAnalytics?.totalOrders || 0;
    const totalRevenue = getAnalytics?.totalRevenue || 0;

    // Tạo map để tra cứu user và address nhanh
    const userMap = React.useMemo(() => {
        const map = new Map();
        getUsers?.data?.forEach((u) => map.set(u._id, u));
        return map;
    }, [getUsers]);
    const addressMap = React.useMemo(() => {
        const map = new Map();
        getAddresses?.forEach((a) => map.set(a._id, a));
        return map;
    }, [getAddresses]);

    const recentOrders = (getOrders?.data || []).slice(0, 5).map((order) => {
        let address = addressMap.get(order.addressId);
        // Nếu không có address theo addressId, lấy address đầu tiên theo userId
        if (!address && order.userId) {
            address = getAddresses?.find(a => a.userId === order.userId);
        }
        return {
            id: order._id,
            date: new Date(order.createdAt).toLocaleDateString("vi-VN"),
            status: order.orderStatus || order.paymentStatus,
            customerName: address?.fullName || "",
            phone: address?.phone || "",
            address: address?.street ? `${address.street}, ${address.city}, ${address.country}` : "",
        };
    });

    const stats = [
        { label: "Người dùng", value: totalUsers },
        { label: "Đơn hàng", value: totalOrders },
        { label: "Doanh thu", value: totalRevenue.toLocaleString("vi-VN") + " ₫" },
        { label: "Sản phẩm", value: totalProducts },
    ];

    const safeData = ordersChartData.map((d) => ({
        date: d.date,
        orders: Number.isFinite(d.orders) ? d.orders : 0,
    }));

    const statusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return { backgroundColor: "#fff3cd", color: "#856404" };
            case "delivered":
                return { backgroundColor: "#d4edda", color: "#155724" };
            case "cancelled":
                return { backgroundColor: "#f8d7da", color: "#721c24" };
            default:
                return { backgroundColor: "#e2e3e5", color: "#383d41" };
        }
    };
    const statusLabel = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "Chờ xử lý";
            case "delivered":
                return "Đã giao";
            case "cancelled":
                return "Đã hủy";
            default:
                return status;
        }
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.sectionTitle}>Tổng quan</Text>
                <View style={styles.statsRow}>
                    {stats.map((item, idx) => (
                        <View key={idx} style={styles.statCardHorizontal}>
                            <Text style={styles.statIcon}>📊</Text>
                            <Text style={styles.statValue}>{item.value}</Text>
                            <Text style={styles.statLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Biểu đồ</Text>
                <LineChart
                    data={{
                        labels: safeData.map((d) => d.date),
                        datasets: [{ data: safeData.map((d) => d.orders) }],
                    }}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={chartConfig}
                    style={{ borderRadius: 12, marginBottom: 24 }}
                />

                <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
                {recentOrders.map((item) => (
                    <View key={item.id} style={styles.orderCard}>
                        <Text style={styles.orderIdLabel}>Mã đơn hàng</Text>
                        <Text style={styles.orderIdValue}>{item.id}</Text>
                        <View style={styles.divider} />
                        <Text><Text style={styles.bold}>Khách hàng:</Text> {item.customerName}</Text>
                        <Text><Text style={styles.bold}>Số điện thoại:</Text> {item.phone}</Text>
                        <Text><Text style={styles.bold}>Địa chỉ:</Text> {item.address}</Text>
                        <View style={styles.divider} />
                        <Text><Text style={styles.bold}>Ngày tạo:</Text> {item.date}</Text>
                        <Text><Text style={styles.bold}>Trạng thái:</Text> <Text style={[styles.badge, statusStyle(item.status)]}>{statusLabel(item.status) || "Đang chờ phân công"}</Text></Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        marginTop: 16,
    },

    statsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 12,
    },

    statCardHorizontal: {
        width: "48%",
        paddingVertical: 14,
        paddingHorizontal: 12,
        backgroundColor: "#f8f9fa",
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    statIcon: { fontSize: 24 },
    statValue: { fontSize: 20, fontWeight: "bold", color: "#333" },
    statLabel: { fontSize: 13, color: "#666", textAlign: "center" },

    orderItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 10,
    },

    badge: {
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: "flex-start",
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 1,
    },
    orderIdLabel: {
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 2,
    },
    orderIdValue: {
        fontSize: 13,
        textAlign: 'center',
        marginBottom: 8,
        color: '#444',
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginVertical: 8,
    },
    bold: {
        fontWeight: 'bold',
    },
});
export default Dashboard;
