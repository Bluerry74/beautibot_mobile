import { useOrderChartData } from "@/hooks/useOrderChartData";
import { useAllOrder, useAnalytics } from "@/tanstack/order";
import { useProductsQuery } from "@/tanstack/product";
import { useAllUser } from "@/tanstack/user/regis";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
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

    const totalUsers = getUsers?.data?.length || 0;
    const totalProducts = getproducts?.data?.length || 0;
    const totalOrders = getAnalytics?.totalOrders || 0;
    const totalRevenue = getAnalytics?.totalRevenue || 0;

    const recentOrders = (getOrders?.data || []).slice(0, 5).map((order) => ({
        id: order._id,
        date: new Date(order.createdAt).toLocaleDateString(),
        status: order.orderStatus || order.paymentStatus,
    }));

    const stats = [
        { label: "Total Users", value: totalUsers },
        { label: "Total Orders", value: totalOrders },
        { label: "Revenue", value: totalRevenue },
        { label: "Total Products", value: totalProducts },
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
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsRow}>
                {stats.map((item, idx) => (
                    <View key={idx} style={styles.statCardHorizontal}>
                        <Text style={styles.statIcon}>📊</Text>
                        <Text style={styles.statValue}>{item.value}</Text>
                        <Text style={styles.statLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Order Trends</Text>
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

            <Text style={styles.sectionTitle}>Recent Orders</Text>
            {recentOrders.map((item) => (
                <View key={item.id} style={styles.orderItem}>
                    <Text>{item.id.slice(-6)}</Text>
                    <Text>{item.date}</Text>
                    <Text style={[styles.badge, statusStyle(item.status)]}>
                        {item.status}
                    </Text>
                </View>
            ))}
        </ScrollView>
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
});
export default Dashboard;
