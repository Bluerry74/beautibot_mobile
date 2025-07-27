import { get } from "@/httpservices/httpService";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    MessageSquare,
    Navigation,
    Phone,
    QrCode,
    Truck,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Linking,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const OrderActive = () => {
    const [deliveryList, setDeliveryList] = useState([]);
    const [activeStatus, setActiveStatus] = useState("delivering");

    useEffect(() => {
        const fetchDeliveryData = async () => {
            try {
                const response = await get<any>("/delivery/personnel");
                setDeliveryList(response.data.data);
            } catch (error) {
                console.error("Error fetching delivery data:", error);
            }
        };
        fetchDeliveryData();
    }, []);

    const getStatusText = (status: string) => {
        switch (status) {
            case "delivered":
                return "Đã giao";
            case "out_for_delivery":
            case "assigned":
                return "Đang giao";
            case "failed":
            case "cancelled":
                return "Thất bại";
            default:
                return "Chờ giao";
        }
    };

    const filteredList = deliveryList.filter((item: any) => {
        if (activeStatus === "delivered") return item.status === "delivered";
        if (activeStatus === "delivering")
            return (
                item.status === "out_for_delivery" || item.status === "assigned"
            );
        if (activeStatus === "failed")
            return item.status === "failed" || item.status === "cancelled";
        return true; // default case: show all
    });

    const StatusTab = ({ statusKey, icon: Icon, color, label }: any) => (
        <TouchableOpacity
            onPress={() => setActiveStatus(statusKey)}
            className={`w-[30%] items-center p-3 bg-white rounded-lg shadow border ${
                activeStatus === statusKey ? `border-[${color}]` : ""
            }`}
        >
            <Icon size={24} color={color} />
            <Text className={`font-bold text-lg`} style={{ color }}>
                {
                    deliveryList.filter((item: any) => {
                        if (statusKey === "delivering")
                            return (
                                item.status === "out_for_delivery" ||
                                item.status === "assigned"
                            );
                        if (statusKey === "delivered")
                            return item.status === "delivered";
                        if (statusKey === "failed")
                            return (
                                item.status === "failed" ||
                                item.status === "cancelled"
                            );
                        return true;
                    }).length
                }
            </Text>
            <Text className="text-xs text-gray-600">{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="bg-gray-50 flex-1">
            <ScrollView>
                <View className="px-4 py-4" style={{ backgroundColor: "#ff9c86" }}>
                    <Text className="text-white text-2xl font-semibold mt-8">
                        ĐƠN HÀNG CỦA BẠN GIAO
                    </Text>
                </View>

                <View className="px-4 py-4 flex-row justify-between">
                    <StatusTab
                        statusKey="delivered"
                        icon={CheckCircle}
                        color="#16a34a"
                        label="Đã giao"
                    />
                    <StatusTab
                        statusKey="delivering"
                        icon={Clock}
                        color="#2563eb"
                        label="Đang giao"
                    />
                    <StatusTab
                        statusKey="failed"
                        icon={AlertTriangle}
                        color="#dc2626"
                        label="Thất bại"
                    />
                </View>

                <View className="px-4 space-y-4">
                    {filteredList.map((item: any) => (
                        <View
                            key={item._id}
                            className="p-4 bg-white rounded-lg shadow border space-y-2 mt-4"
                        >
                            <Text className="text-base font-semibold">
                                {item.shippingAddress?.fullName ||
                                    "Không rõ người nhận"}
                            </Text>
                            <Text className="text-sm text-gray-600">
                                {item.shippingAddress?.street},{" "}
                                {item.shippingAddress?.city},{" "}
                                {item.shippingAddress?.country}
                            </Text>
                            <Text className="text-sm text-gray-500">
                                Mã đơn: {item.trackingNumber} – COD:{" "}
                                {item.cod || 0}₫
                            </Text>
                            <Text className="text-xs text-blue-600 font-semibold">
                                {getStatusText(item.status)}
                            </Text>

                            <View className="flex-row gap-2 mt-2">
                                <TouchableOpacity
                                    className="flex-1 border border-gray-300 px-3 py-2 rounded flex-row items-center justify-center"
                                    onPress={() =>
                                        Linking.openURL(
                                            `tel:${item.shippingAddress?.phone}`
                                        )
                                    }
                                >
                                    <Phone size={16} />
                                    <Text className="ml-2">Gọi</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-1 border border-gray-300 px-3 py-2 rounded flex-row items-center justify-center"
                                    onPress={() =>
                                        Linking.openURL(
                                            `https://maps.google.com/?q=${encodeURIComponent(
                                                `${item.shippingAddress?.street}, ${item.shippingAddress?.city}`
                                            )}`
                                        )
                                    }
                                >
                                    <Navigation size={16} />
                                    <Text className="ml-2">Chỉ đường</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                <View className="px-4 mt-6 space-y-3">
                    <View className="p-4 bg-white rounded-lg shadow border space-y-2">
                        <TouchableOpacity className="flex-row items-center gap-2">
                            <QrCode size={18} />
                            <Text>Quét mã vận đơn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center gap-2">
                            <Truck size={18} />
                            <Text>Báo cáo sự cố xe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center gap-2">
                            <MessageSquare size={18} />
                            <Text>Liên hệ điều phối</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="px-4 mt-4">
                    <View className="bg-red-100 border border-red-300 p-4 rounded-lg">
                        <View className="flex-row items-center gap-2">
                            <AlertTriangle size={18} color="#dc2626" />
                            <View>
                                <Text className="text-red-800 font-medium">
                                    Hỗ trợ khẩn cấp
                                </Text>
                                <Text className="text-sm text-red-600">
                                    Hotline: 1900 123 456
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default OrderActive;
