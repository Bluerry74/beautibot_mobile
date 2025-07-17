import color from '@/assets/Color';
import { formatDate } from '@/hooks/formatDate';
import { useAllOrder } from '@/tanstack/order';
import { useProductsQuery } from '@/tanstack/product';
import { useAllUser } from '@/tanstack/user/regis';
import { IOrder } from '@/types/order';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function OrderDetailScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const { data } = useAllOrder();
  const { data: userData } = useAllUser();
  const { data: productData } = useProductsQuery();

  // Tìm order theo orderId
  const order: IOrder | undefined = React.useMemo(() => {
    if (!orderId || !Array.isArray(data?.data)) return undefined;
    return data.data.find((o: IOrder) => o._id === orderId);
  }, [orderId, data]);

  // Tìm email user
  const userEmail = React.useMemo(() => {
    if (!order || !Array.isArray(userData?.data)) return '';
    const user = userData.data.find((u: any) => u._id === order.userId);
    return user?.email || order.userId;
  }, [order, userData]);

  // Hàm lấy tên sản phẩm từ productId
  const getProductName = (productId: string) => {
    if (!Array.isArray(productData?.data)) return '';
    const product = productData.data.find((p: any) => p._id === productId);
    return product?.name || '';
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
            <Text><Text style={{ fontWeight: 'bold' }}></Text> {order._id}</Text>

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
                    <Text style={{ color: color.primary, fontWeight: 'bold' }}>{' '}{discountedPrice.toLocaleString('vi-VN')} đ</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
} 