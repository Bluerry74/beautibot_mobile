import color from '@/assets/Color';
import { formatDate } from '@/hooks/formatDate';
import { getDeliveryDetailQuery, useAssignDeliveryPersonnelMutation } from '@/tanstack/delivery';
import { IDelivery } from '@/types/delivery';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DELIVERY_STATUS_LABELS: Record<string, string> = {
    pending: 'Đang chờ phân công',
    assigned: 'Đã phân công',
    out_for_delivery: 'Đang giao',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy',
    failed: 'Thất bại',
};

export default function DeliveryDetailScreen() {
    const { deliveryId } = useLocalSearchParams();
    const router = useRouter();
    const { data, isLoading, isError } = getDeliveryDetailQuery(deliveryId as string);
    const assignMutation = useAssignDeliveryPersonnelMutation();

    const [assignModalVisible, setAssignModalVisible] = React.useState(false);
    const [selectedStaff, setSelectedStaff] = React.useState<any | null>(null);

    const deliveryStaffList = [
        {
            name: 'Nguyen Van Giao',
            phone: '0909123456',
            deliveryPersonnelId: '6837ef5a7f0f15289646eb69',
        },
        // Có thể thêm nhiều nhân viên nếu muốn
    ];

    const handleAssign = () => {
        if (!selectedStaff) return;
        assignMutation.mutate(
            { deliveryId: deliveryId as string, deliveryPersonnelId: selectedStaff.deliveryPersonnelId },
            {
                onSuccess: () => {
                    setAssignModalVisible(false);
                    router.push('/(admin)/delivery')
                }
            }
        );
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#c2185b" />
                <Text>Đang tải thông tin giao hàng...</Text>
            </View>
        );
    }

    if (isError || !data) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Không thể tải dữ liệu giao hàng.</Text>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
                        <Text style={{ color: '#c2185b', fontWeight: 'bold' }}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const delivery = data as IDelivery;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
                    <TouchableOpacity
                        onPress={() => router.push('/(admin)/delivery')}
                        style={{ backgroundColor: color.quaternary, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, marginRight: 12 }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{'Quay lại'}</Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ fontSize: 26, fontWeight: 'bold', textAlign: 'center' }}>
                            Thông tin giao hàng:
                        </Text>
                        <Text style={{ color: 'black' }}>{delivery._id}</Text>
                    </View>
                </View>

                {/* Thẻ thông tin giao hàng */}
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 6,
                        elevation: 3,
                        borderWidth: 1,
                        borderColor: '#eee',
                    }}
                >
                    {/* Mã đơn hàng */}
                    <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                            Mã đơn hàng
                        </Text>
                        <Text style={{ fontWeight: 'normal', color: 'black' }}>{delivery.orderId}</Text>
                    </View>
                    <View style={{ height: 1, backgroundColor: 'black', marginVertical: 10 }} />

                    {/* Khách hàng, SĐT, Địa chỉ */}
                    <Text style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>Khách hàng:</Text> {delivery.shippingAddress?.fullName}
                    </Text>
                    <Text style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>Số điện thoại:</Text> {delivery.shippingAddress?.phone}
                    </Text>
                    <Text style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>Địa chỉ:</Text> {delivery.shippingAddress?.street}, {delivery.shippingAddress?.city}, {delivery.shippingAddress?.country}
                    </Text>
                    <View style={{ height: 1, backgroundColor: 'black', marginVertical: 10 }} />

                    {/* Ngày tạo, Tracking, Trạng thái */}
                    <Text style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>Ngày tạo:</Text> {formatDate(delivery.createdAt, true)}
                    </Text>
                    <Text style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>Tracking Number:</Text> {delivery.trackingNumber}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold', marginRight: 8 }}>Trạng thái:</Text>
                        <View style={{
                            backgroundColor:
                                delivery.status === 'pending' ? '#eee'
                                : delivery.status === 'assigned' ? '#1976d2'
                                : delivery.status === 'out_for_delivery' ? '#ff9800'
                                : delivery.status === 'delivered' ? '#43a047'
                                : (delivery.status === 'failed' || delivery.status === 'cancelled') ? '#e53935'
                                : '#e0e0e0',
                            borderRadius: 10,
                            paddingVertical: 4,
                            paddingHorizontal: 10,
                            minWidth: 80,
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontWeight: 'bold',
                                color:
                                    delivery.status === 'pending' ? '#888'
                                    : '#fff'
                            }}>
                                {DELIVERY_STATUS_LABELS[delivery.status] || delivery.status}
                            </Text>
                        </View>
                    </View>
                    <View style={{ height: 1, backgroundColor: 'black', marginVertical: 10 }} />

                    {/* Nhân viên giao hàng, ngày giao, phí, ký nhận */}
                    <Text style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>Nhân viên giao hàng:</Text> {delivery.deliveryPersonnelId || '—'}
                    </Text>
                    <Text style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>Ngày giao:</Text> {delivery.deliveryDate ? formatDate(delivery.deliveryDate, true) : '—'}
                    </Text>
                    <Text style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>Phí giao:</Text> {delivery.deliveryFee?.toLocaleString('vi-VN')}₫
                    </Text>
                    <Text style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>Yêu cầu ký nhận:</Text> {delivery.requiresSignature ? 'Có' : 'Không'}
                    </Text>
                    {delivery.proofOfDeliveryUrl && (
                        <View style={{ marginTop: 16, alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Ảnh xác nhận giao hàng:</Text>
                            <Image source={{ uri: delivery.proofOfDeliveryUrl }} style={{ width: 200, height: 200, borderRadius: 12 }} />
                        </View>
                    )}
                </View>
                {delivery.status === 'pending' && (
                    <>
                        <TouchableOpacity
                            onPress={() => setAssignModalVisible(true)}
                            style={{
                                backgroundColor: color.quaternary,
                                borderRadius: 8,
                                paddingVertical: 12,
                                paddingHorizontal: 32,
                                alignSelf: 'center',
                                marginTop: 8,
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Phân công</Text>
                        </TouchableOpacity>
                        <Modal
                            visible={assignModalVisible}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setAssignModalVisible(false)}
                        >
                            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, minWidth: 280 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Chọn nhân viên giao hàng</Text>
                                    {deliveryStaffList.map((staff) => (
                                        <TouchableOpacity
                                            key={staff.deliveryPersonnelId}
                                            onPress={() => setSelectedStaff(staff)}
                                            style={{
                                                padding: 12,
                                                backgroundColor: selectedStaff?.deliveryPersonnelId === staff.deliveryPersonnelId ? '#1976d2' : '#eee',
                                                borderRadius: 8,
                                                marginBottom: 8,
                                            }}
                                        >
                                            <Text style={{ color: selectedStaff?.deliveryPersonnelId === staff.deliveryPersonnelId ? '#fff' : '#333', fontWeight: 'bold', textAlign: 'center' }}>
                                                {staff.name} - {staff.phone}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                    <TouchableOpacity
                                        onPress={handleAssign}
                                        disabled={!selectedStaff || assignMutation.status === 'pending'}
                                        style={{
                                            padding: 12,
                                            backgroundColor: 'green',
                                            borderRadius: 8,
                                            marginBottom: 8,
                                            opacity: !selectedStaff ? 0.5 : 1,
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                                            {assignMutation.status === 'pending' ? 'Đang phân công...' : 'Xác nhận phân công'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setAssignModalVisible(false)} style={{ padding: 8, alignItems: 'center' }}>
                                        <Text style={{ color: '#c2185b', fontWeight: 'bold' }}>Đóng</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
} 