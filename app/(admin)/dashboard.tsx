import { useOrderChartData } from "@/hooks/useOrderChartData";
import { useAllOrder, useAnalytics } from "@/tanstack/order";
import { useProductsQuery } from "@/tanstack/product";
import { useAllUser } from "@/tanstack/user/regis";
import React from "react";
import {
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
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
    const screenWidth = Dimensions.get("window").width;
    const { data: getUsers, isLoading: isLoadingUsers } = useAllUser();
    const { data: getAnalytics, isLoading: isLoadingAnalytics } =
        useAnalytics();
    const { data: getproducts, isLoading: isLoadingProducts } =
        useProductsQuery();
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
        { label: "Total Users", value: isLoadingUsers ? "..." : totalUsers },
        {
            label: "Total Orders",
            value: isLoadingAnalytics ? "..." : totalOrders,
        },
        { label: "Revenue", value: isLoadingAnalytics ? "..." : totalRevenue },
        {
            label: "Total Products",
            value: isLoadingProducts ? "..." : totalProducts,
        },
    ];
    const safeChartData = ordersChartData?.length
        ? ordersChartData
        : [{ date: "", orders: 0 }];
    const safeData = ordersChartData.map((d) => ({
        date: d.date,
        orders: Number.isFinite(d.orders) ? d.orders : 0,
    }));
    return (
        <View>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.statsContainer}>
                    {stats.map((item, idx) => (
                        <View key={idx} style={styles.statCard}>
                            <Text style={styles.statIcon}>👤</Text>
                            <Text style={styles.statValue}>{item.value}</Text>
                            <Text style={styles.statLabel}>{item.label}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <LineChart
                data={{
                    labels: safeData.map((d) => d.date),
                    datasets: [{ data: safeData.map((d) => d.orders) }],
                }}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
            />

            <FlatList
                data={recentOrders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.orderItem}>
                        <Text>{item.id.slice(-6)}</Text>
                        <Text>{item.date}</Text>
                        <Text style={[styles.badge, statusStyle(item.status)]}>
                            {item.status}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: { padding: 16 },
    statsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    statCard: {
        width: "48%",
        padding: 16,
        marginVertical: 8,
        backgroundColor: "#f0f0f0",
        borderRadius: 12,
        alignItems: "center",
    },
    statIcon: { fontSize: 24 },
    statValue: { fontSize: 22, fontWeight: "bold" },
    statLabel: { fontSize: 14, color: "#666" },
    orderItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
});
export default Dashboard;
