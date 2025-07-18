import color from '@/assets/Color';
import { formatDate } from '@/hooks/formatDate';
import { useAddressesQuery } from '@/tanstack/address';
import { useCreateDeliveryMutation } from '@/tanstack/delivery';
import { useAllOrder, useCancelOrderMutation, useUpdateOrderStatusMutation } from '@/tanstack/order';
import { useProductsQuery } from '@/tanstack/product';
import { useAllUser } from '@/tanstack/user/regis';
import { IOrder } from '@/types/order';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();

  const { data, refetch } = useAllOrder();
  const { data: userData } = useAllUser();
  const { data: productData } = useProductsQuery();
  const { data: addressData } = useAddressesQuery();

  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState("15000");
  const [confirmCancelVisible, setConfirmCancelVisible] = useState(false);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedDeliveryPersonnel, setSelectedDeliveryPersonnel] = useState<{ name: string; phone: string; deliveryPersonnelId: string } | null>(null);

  const createDeliveryMutation = useCreateDeliveryMutation();
  const updateOrderStatusMutation = useUpdateOrderStatusMutation();
  const cancelOrderMutation = useCancelOrderMutation();
  
  const order: IOrder | undefined = useMemo(() => {
    if (!orderId || !Array.isArray(data?.data)) return undefined;
    return data.data.find((o: IOrder) => o._id === orderId);
  }, [orderId, data]);

  const userEmail = useMemo(() => {
    if (!order || !Array.isArray(userData?.data)) return '';
    const user = userData.data.find((u: any) => u._id === order.userId);
    return user?.email || order.userId;
  }, [order, userData]);

  const address = React.useMemo(() => {
    if (!order || !Array.isArray(addressData)) return undefined;
    return addressData.find((a: any) => a._id === order.addressId);
  }, [order, addressData]);

  const getProductName = (productId: string) => {
    if (!Array.isArray(productData?.data)) return '';
    const product = productData.data.find((p: any) => p._id === productId);
    return product?.name || '';
  };

  const handleCreateDelivery = () => {
    if (!order) return;

    if (!address) {
      alert('Không tìm thấy địa chỉ giao hàng cho đơn này!');
      return;
    }

    const shippingAddress = {
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      country: address.country,
      postalCode: address.postalCode
    };

    const deliveryData = {
      orderId: order._id,
      customerId: order.userId,
      shippingAddress,
      deliveryFee: parseInt(deliveryFee),
      trackingNumber: `VN${Math.floor(100000000 + Math.random() * 900000000)}`,
      requiresSignature: true,
      estimatedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString()
    };

    createDeliveryMutation.mutate(deliveryData, {
      onSuccess: async () => {
        await updateOrderStatusMutation.mutateAsync({
          orderId: order._id,
          orderStatus: "Shipped"
        });
        setDeliveryModalVisible(false);
        refetch && refetch();
        router.push('/(admin)/order');
      }
    });
  };
  
  const handleCancelOrder = () => {
    if (!order) return;
    cancelOrderMutation.mutate({ orderId: order._id }, {
      onSuccess: () => {
        setConfirmCancelVisible(false);
        router.push('/(admin)/order');
      }
    });
  };

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Không tìm thấy đơn hàng.</Text>
          <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: color.primary, fontWeight: 'bold' }}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => router.push('/(admin)/order')}
            style={{ backgroundColor: color.primary, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18 }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{'Quay lại'}</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center' }}>
              THÔNG TIN ĐƠN HÀNG:
            </Text>
            <Text>{order._id}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 8 }}>
          <Text><Text style={{ fontWeight: 'bold' }}>Khách hàng:</Text> {userEmail}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Phương thức thanh toán:</Text> {order.paymentMethod}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Thanh toán:</Text> {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Ngày thanh toán:</Text> {order.paidAt ? formatDate(order.paidAt, true) : '—'}</Text>
          <Text><Text style={{ fontWeight: 'bold' }}>Ngày tạo:</Text> {formatDate(order.createdAt, true)}</Text>
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 }}>Danh sách sản phẩm</Text>
        {order.items.map((item, idx) => {
          const hasDiscount = !!item.discountSnapshot && item.discountSnapshot > 0;
          const price = item.priceSnapshot;
          const discountedPrice = hasDiscount ? Math.round(price * (1 - item.discountSnapshot / 100)) : price;
          return (
            <View key={item.skuId} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
              <Text style={{ width: 24, textAlign: 'center', color: color.primary }}>{idx + 1}</Text>
              <View style={{ flex: 2, marginLeft: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>{getProductName(item.productId)}</Text>
                <Text style={{ color: '#888', fontSize: 12 }}>Dung tích: {item.skuName}</Text>
                <Text style={{ color: '#888', fontSize: 12 }}>Số lượng: {item.quantity}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={{ width: 40, height: 40, borderRadius: 6, resizeMode: 'contain' }} />
                ) : (
                  <Text style={{ color: '#aaa' }}>—</Text>
                )}
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                {hasDiscount ? (
                  <>
                    <Text style={{ color: '#888', textDecorationLine: 'line-through', fontSize: 13 }}>{price.toLocaleString('vi-VN')} đ</Text>
                    <Text style={{ color: color.primary, fontWeight: 'bold' }}>{discountedPrice.toLocaleString('vi-VN')} đ</Text>
                  </>
                ) : (
                  <Text style={{ color: color.primary }}>{price.toLocaleString('vi-VN')} đ</Text>
                )}
                <Text style={{ color: '#888', fontSize: 12 }}>Giảm: {hasDiscount ? item.discountSnapshot + '%' : '—'}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={{ fontWeight: 'bold' }}>{(discountedPrice * item.quantity).toLocaleString('vi-VN')} đ</Text>
              </View>
            </View>
          );
        })}

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
            Tổng tiền: <Text style={{ color: 'green' }}>{order.totalAmount.toLocaleString('vi-VN')} đ</Text>
          </Text>
        </View>

        {/* Nút giao đơn và hủy đơn */}
        {(order.orderStatus === 'Shipped') ? (
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, gap: 16 }}>
            <TouchableOpacity
              onPress={() => setConfirmCancelVisible(true)}
              style={{ backgroundColor: '#e53935', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Hủy đơn</Text>
            </TouchableOpacity>
          </View>
        ) : (order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled') ? (
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24, gap: 16 }}>
            <TouchableOpacity
              onPress={() => setDeliveryModalVisible(true)}
              style={{ backgroundColor: color.quaternary, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Giao đơn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setConfirmCancelVisible(true)}
              style={{ backgroundColor: '#e53935', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Hủy đơn</Text>
            </TouchableOpacity>
          </View>
        ) : null}

      </ScrollView>

      {/* Modal tạo đơn giao hàng */}
      <Modal
        visible={deliveryModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeliveryModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, minWidth: 280 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Tạo đơn giao hàng</Text>
            {address && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontWeight: 'bold' }}>Địa chỉ giao hàng:</Text>
                <Text>{address.fullName} - {address.phone}</Text>
                <Text>{address.street}, {address.city}, {address.country}</Text>
                <Text style={{ color: '#007AFF', marginTop: 4 }}
                  onPress={() => {
                    const query = encodeURIComponent(`${address.street}, ${address.city}, ${address.country}`);
                    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
                  }}
                >Xem trên bản đồ</Text>
              </View>
            )}
            <Text>Phí giao hàng (VNĐ):</Text>
            <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginTop: 8, marginBottom: 16 }}>
              <TextInput
                value={deliveryFee}
                onChangeText={setDeliveryFee}
                keyboardType="numeric"
                placeholder="Nhập phí giao hàng"
              />
            </View>
            <Pressable
              onPress={handleCreateDelivery}
              disabled={createDeliveryMutation.isPending}
              style={{ padding: 12, backgroundColor: color.primary, borderRadius: 8, marginBottom: 8 }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                {createDeliveryMutation.isPending ? 'Đang tạo...' : 'Xác nhận giao đơn'}
              </Text>
            </Pressable>
            <Pressable onPress={() => setDeliveryModalVisible(false)} style={{ padding: 8, alignItems: 'center' }}>
              <Text style={{ color: color.quaternary, fontWeight: 'bold' }}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal xác nhận hủy đơn */}
      <Modal
        visible={confirmCancelVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmCancelVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, minWidth: 280 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Xác nhận hủy đơn hàng?</Text>
            <Text style={{ marginBottom: 16 }}>Bạn có chắc chắn muốn hủy đơn hàng này không?</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16 }}>
              <Pressable
                onPress={handleCancelOrder}
                style={{ padding: 12, backgroundColor: '#e53935', borderRadius: 8, minWidth: 80, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Xác nhận</Text>
              </Pressable>
              <Pressable
                onPress={() => setConfirmCancelVisible(false)}
                style={{ padding: 12, backgroundColor: '#ccc', borderRadius: 8, minWidth: 80, alignItems: 'center' }}
              >
                <Text style={{ color: '#333', fontWeight: 'bold' }}>Hủy</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
