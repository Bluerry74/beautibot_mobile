import color from '@/assets/Color';
import { formatDate } from '@/hooks/formatDate';
import { getDeliveryDetailQuery, useAssignDeliveryPersonnelMutation, useDeliveryPersonnelQuery } from '@/tanstack/delivery';
import { useAllOrder, useUpdateOrderStatusMutation } from '@/tanstack/order';
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
    const updateStatusMutation = useUpdateOrderStatusMutation();
    const { data: allOrders } = useAllOrder();
    console.log(allOrders)

    const { data: deliveryPersonnelData, isLoading: isLoadingPersonnel } = useDeliveryPersonnelQuery({
        page: 1,
        limit: 50
    });

    const [assignModalVisible, setAssignModalVisible] = React.useState(false);
    const [cancelModalVisible, setCancelModalVisible] = React.useState(false);
    const [selectedStaff, setSelectedStaff] = React.useState<any | null>(null);

    // Use real delivery personnel data instead of hardcoded array
    const deliveryStaffList = deliveryPersonnelData?.data?.map(personnel => ({
        name: personnel.email, // Using email as name since fullName is not in the response
        phone: 'N/A', // Phone is not in the response structure
        deliveryPersonnelId: personnel._id,
    })) || [];

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

    const handleCancelOrder = () => {
        if (!delivery) return;
        updateStatusMutation.mutate(
            { orderId: delivery.orderId, orderStatus: 'Cancelled' },
            {
                onSuccess: () => {
                    setCancelModalVisible(false);
                    router.push('/(admin)/order');
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

    const personnel = deliveryPersonnelData?.data?.find(p => p._id === delivery.deliveryPersonnelId);
    const personnelEmail = personnel?.email || delivery.deliveryPersonnelId || 'Không có';

    // Lấy trạng thái order hiện tại
    const order = allOrders?.data?.find((o: any) => o._id === delivery.orderId);
    const isOrderDelivered = order?.orderStatus === 'Delivered';

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
                    {delivery.status === 'failed' && (
                        <View style={{ padding: 12, backgroundColor: '#fff3cd', borderRadius: 8, borderWidth: 1, borderColor: '#ffeaa7' }}>
                            <Text style={{ fontWeight: 'bold', color: '#856404', marginBottom: 4 }}>Lý do giao hàng thất bại:</Text>
                            <Text style={{ color: '#856404' }}>
                                Khách hàng không có mặt tại địa chỉ nhận hàng hoặc từ chối nhận hàng.
                            </Text>
                        </View>
                    )}
                    <View style={{ height: 1, backgroundColor: 'black', marginVertical: 10 }} />

                    {/* Nhân viên giao hàng, ngày giao, phí, ký nhận */}
                    <Text style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 'bold' }}>Nhân viên giao hàng:</Text> {personnelEmail || '—'}
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
                    {delivery.status === 'delivered' && (
                        isOrderDelivered ? (
                            <Text style={{ color: 'green', fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginTop: 12 }}>
                                Đơn hàng đã hoàn thành
                            </Text>
                        ) : (
                            <TouchableOpacity
                                onPress={() => updateStatusMutation.mutate(
                                    { orderId: delivery.orderId, orderStatus: 'Delivered' },
                                    {
                                        onError: (error) => {
                                            console.error('[DEBUG] Lỗi xác nhận hoàn thành đơn hàng:', error);
                                            if (error?.response) {
                                                console.error('[DEBUG] Response status:', error.response.status);
                                                console.error('[DEBUG] Response data:', error.response.data);
                                            }
                                        }
                                    }
                                )}
                                style={{
                                    backgroundColor: 'green',
                                    borderRadius: 8,
                                    paddingVertical: 12,
                                    paddingHorizontal: 32,
                                    alignSelf: 'center',
                                    marginTop: 8,
                                }}
                                disabled={updateStatusMutation.isPending}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
                                    {updateStatusMutation.isPending ? 'Đang xác nhận...' : 'Xác nhận hoàn thành đơn hàng'}
                                </Text>
                            </TouchableOpacity>
                        )
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

                                    {isLoadingPersonnel ? (
                                        <View style={{ alignItems: 'center', padding: 20 }}>
                                            <ActivityIndicator size="large" color="#c2185b" />
                                            <Text style={{ marginTop: 10 }}>Đang tải danh sách nhân viên...</Text>
                                        </View>
                                    ) : deliveryStaffList.length > 0 ? (
                                        deliveryStaffList.map((staff) => (
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
                                                    {staff.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))
                                    ) : (
                                        <View style={{ alignItems: 'center', padding: 20 }}>
                                            <Text style={{ color: '#666' }}>Không có nhân viên giao hàng nào</Text>
                                        </View>
                                    )}
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

                {delivery.status === 'failed' && (
                    <>
                        <TouchableOpacity
                            onPress={() => setCancelModalVisible(true)}
                            style={{
                                backgroundColor: '#e53935',
                                borderRadius: 8,
                                paddingVertical: 12,
                                paddingHorizontal: 32,
                                alignSelf: 'center',
                                marginTop: 8,
                            }}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
                                Hủy bỏ đơn hàng
                            </Text>
                        </TouchableOpacity>

                        <Modal
                            visible={cancelModalVisible}
                            transparent
                            animationType="fade"
                            onRequestClose={() => setCancelModalVisible(false)}
                        >
                            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, minWidth: 200, maxWidth: 300 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16, textAlign: 'center' }}>
                                        Xác nhận hủy đơn hàng
                                    </Text>
                                    <Text style={{ color: '#666', marginBottom: 20, textAlign: 'center' }}>
                                        Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
                                    </Text>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity
                                            onPress={() => setCancelModalVisible(false)}
                                            style={{
                                                flex: 1,
                                                padding: 12,
                                                backgroundColor: '#ccc',
                                                borderRadius: 8,
                                                marginRight: 8,
                                            }}
                                        >
                                            <Text style={{ color: '#333', fontWeight: 'bold', textAlign: 'center' }}>
                                                Hủy
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={handleCancelOrder}
                                            disabled={updateStatusMutation.isPending}
                                            style={{
                                                flex: 1,
                                                padding: 12,
                                                backgroundColor: updateStatusMutation.isPending ? '#ccc' : '#e53935',
                                                borderRadius: 8,
                                                marginLeft: 8,
                                                opacity: updateStatusMutation.isPending ? 0.5 : 1,
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                                                {updateStatusMutation.isPending ? 'Đang hủy...' : 'Xác nhận'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
} 