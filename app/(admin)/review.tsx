import { useProductsQuery } from "@/tanstack/product";
import { useAllUser } from "@/tanstack/user/regis";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import {
    useDeleteReviewAdmin,
    useReviewAdminQuery,
} from "../../tanstack/review/index";

export default function CouponListScreen() {
    const [mounted, setMounted] = useState(false);
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading } = useReviewAdminQuery({ page, limit });
    const { data: users = [] } = useAllUser({ limit: 9999 });
    const { data: product = [] } = useProductsQuery({ limit: 9999 });
    console.log("product = ", product);

    const productMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        if (Array.isArray(product?.data)) {
            product.data.forEach((p: any) => {
                map[p._id] = p.name;
            });
        }
        return map;
    }, [product]);

    const { mutate: deleteReview, isPending: isDeleting } =
        useDeleteReviewAdmin();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const reviews = data?.data || [];
    const total = data?.meta?.totalItems || reviews.length;
    const totalPages = Math.ceil(total / limit);

    const handleDelete = (id: string) => {
        Alert.alert("Xác nhận xoá", "Bạn có chắc chắn muốn xoá đánh giá này?", [
            { text: "Huỷ", style: "cancel" },
            {
                text: "Xoá",
                style: "destructive",
                onPress: () => deleteReview(id),
            },
        ]);
    };
    return (
        <SafeAreaView
            style={{
                padding: 20,
                paddingBottom: 40,
            }}
        >
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Text
                    style={{
                        fontSize: 22,
                        fontWeight: "bold",
                        marginBottom: 16,
                    }}
                >
                    Quản lý đánh giá
                </Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#EF4444" />
                ) : reviews.length === 0 ? (
                    <Text>Không có đánh giá nào.</Text>
                ) : (
                    reviews.map((review: any) => {
                        const productName =
                            productMap[review.productId] || "Không rõ sản phẩm";
                        const user = users?.data?.find(
                            (u: any) => u._id === review.userId
                        );

                        return (
                            <View
                                key={review._id}
                                style={{
                                    padding: 16,
                                    borderWidth: 1,
                                    borderColor: "#ddd",
                                    borderRadius: 12,
                                    marginBottom: 16,
                                    backgroundColor: "#fff",
                                }}
                            >
                                <Text
                                    style={{ fontWeight: "bold", fontSize: 16 }}
                                >
                                    👤 Người dùng:{" "}
                                    {user?.email || review.userId}
                                </Text>

                                <Text style={{ color: "#555", fontSize: 13 }}>
                                    🛒 Sản phẩm:{" "}
                                    {productName || review.productId}
                                </Text>

                                <Text style={{ marginTop: 8 }}>
                                    💬 {review.comment}
                                </Text>

                                <Text
                                    style={{ color: "#fbbf24", marginTop: 4 }}
                                >
                                    ⭐ Đánh giá:{" "}
                                    {Array.from({ length: review.rating }).map(
                                        (_, i) => (
                                            <Text key={i}>⭐</Text>
                                        )
                                    )}
                                </Text>

                                {review.images.length > 0 && (
                                    <ScrollView
                                        horizontal
                                        style={{ marginTop: 8 }}
                                    >
                                        {review.images.map(
                                            (imgUrl: any, i: number) => (
                                                <Image
                                                    key={i}
                                                    source={{ uri: imgUrl }}
                                                    style={{
                                                        width: 80,
                                                        height: 80,
                                                        marginRight: 8,
                                                        borderRadius: 8,
                                                    }}
                                                />
                                            )
                                        )}
                                    </ScrollView>
                                )}

                                {review.reported && (
                                    <View style={{ marginTop: 8 }}>
                                        <Text
                                            style={{
                                                color: "#c62828",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            ⚠️ Đánh giá bị báo cáo
                                        </Text>
                                        <Text>Lý do:</Text>
                                        {review.reportReasons.map(
                                            (reason: any, idx: number) => (
                                                <Text
                                                    key={idx}
                                                    style={{ marginLeft: 8 }}
                                                >
                                                    • {reason}
                                                </Text>
                                            )
                                        )}
                                    </View>
                                )}

                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: "#666",
                                        marginTop: 8,
                                    }}
                                >
                                    📅 Tạo lúc:{" "}
                                    {new Date(review.createdAt).toLocaleString(
                                        "vi-VN"
                                    )}
                                </Text>
                                <View
                                    style={{
                                        alignItems: "flex-end",
                                        marginTop: 12,
                                    }}
                                >
                                    <Button
                                        mode="outlined"
                                        onPress={() => handleDelete(review._id)}
                                        loading={isDeleting}
                                        textColor="#EF4444"
                                        style={{ borderColor: "#EF4444" }}
                                    >
                                        Xoá
                                    </Button>
                                </View>
                            </View>
                        );
                    })
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 20,
                            gap: 12,
                        }}
                    >
                        <Button
                            mode="outlined"
                            disabled={page === 1}
                            onPress={() =>
                                setPage((prev) => Math.max(1, prev - 1))
                            }
                        >
                            ← Trước
                        </Button>
                        <Text style={{ marginHorizontal: 8 }}>
                            Trang {page} / {totalPages}
                        </Text>
                        <Button
                            mode="outlined"
                            disabled={page === totalPages}
                            onPress={() =>
                                setPage((prev) =>
                                    Math.min(totalPages, prev + 1)
                                )
                            }
                        >
                            Tiếp →
                        </Button>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
