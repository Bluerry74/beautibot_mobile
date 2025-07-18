import { deliverySteps } from '@/components/deliveryStatusMap'
import { getAllTrackingData } from '@/services/tracking'
import { useAuthStore } from '@/store/auth'
import { ITrackingData } from '@/types/tracking'
import * as Clipboard from 'expo-clipboard'
import {
  Check,
  CheckCircle,
  Clock,
  Copy,
  MapPin,
  Truck
} from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
const Tracking = () => {
  const user = useAuthStore(state => state.user)
  const [trackingList, setTrackingList] = useState<ITrackingData[]>([])
  const [selected, setSelected] = useState<ITrackingData | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchTrackingList = async () => {
    if (!user?.email) return
    try {
      setLoading(true)
      const deliveries = await getAllTrackingData(user.email)
      setTrackingList(deliveries)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách tracking:', error)
    } finally {
      setLoading(false)
    }
  }
  

  const copyTrackingNumber = async (trackingNumber: string) => {
    await Clipboard.setStringAsync(trackingNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    fetchTrackingList()
  }, [])
  const getTrackingSteps = () => {
    if (!selected) return []
  
    const currentStatus = selected.delivery.status
    const currentIndex = deliverySteps.findIndex(step => step.key === currentStatus)
  
    return deliverySteps.map((step, index) => {
      let status: 'completed' | 'current' | 'upcoming' = 'upcoming'
      if (index < currentIndex) status = 'completed'
      else if (index === currentIndex) status = 'current'
  
      return {
        ...step,
        status,
        time: selected.delivery.updatedAt
          ? new Date(selected.delivery.updatedAt).toLocaleTimeString('vi-VN')
          : '',
        location: selected.address.city || 'Không rõ địa điểm',
      }
    })
  }
  const trackingSteps = selected ? getTrackingSteps() : []
  
  return (
    <ScrollView className="bg-gray-100 flex-1 p-4">
      <Text className="text-xl font-bold text-center text-gray-800 mb-4 mt-8">
        Theo dõi đơn hàng
      </Text>

      {loading && (
        <Text className="text-center text-gray-500 mb-4">Đang tải dữ liệu...</Text>
      )}

      {!loading && !selected && trackingList.map((item, idx) => (
        <TouchableOpacity
          key={item.delivery._id}
          onPress={() => setSelected(item)}
          className="bg-white p-4 rounded-lg mb-3 shadow"
        >
          <View className="flex-row justify-between">
            <Text className="font-semibold">#{item.delivery.trackingNumber}</Text>
            <Text className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs">
              {item.delivery.status}
            </Text>
          </View>
          <Text className="text-sm text-gray-600 mt-1">
            {item.address.fullName} - {item.address.city}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Chi tiết đơn đã chọn */}
      {selected && (
        <>
          <TouchableOpacity onPress={() => setSelected(null)} className="mb-4">
            <Text className="text-blue-500">← Quay lại danh sách</Text>
          </TouchableOpacity>

          <View className="bg-white p-4 rounded-lg mb-4 shadow">
  <View className="flex-row justify-between items-center mb-3">
    <Text className="text-lg font-semibold">Thông tin đơn hàng</Text>
    <Text className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs">
      {selected.delivery.status}
    </Text>
  </View>

  <View className="flex-row justify-between items-center mb-2">
    <Text className="text-sm text-gray-600">Mã đơn hàng:</Text>
    <Text className="font-mono text-sm">{selected.order._id}</Text>
  </View>

  <View className="flex-row justify-between items-center mb-2">
    <Text className="text-sm text-gray-600">Mã vận đơn:</Text>
    <View className="flex-row items-center gap-2">
      <Text className="font-mono text-sm">{selected.delivery.trackingNumber}</Text>
      <TouchableOpacity onPress={() => copyTrackingNumber(selected.delivery.trackingNumber)}>
        {copied ? <Check size={16} color="green" /> : <Copy size={16} />}
      </TouchableOpacity>
    </View>
  </View>

  <View className="border-t my-2" />

  <View className="flex-row justify-between mb-1">
    <Text className="text-gray-600">Người gửi:</Text>
    <Text className="font-medium">{selected.order.userId}</Text>
  </View>
  <View className="flex-row justify-between mb-1">
    <Text className="text-gray-600">Người nhận:</Text>
    <Text className="font-medium">{selected.address.fullName}</Text>
  </View>
  <View className="flex-row justify-between mb-1">
    <Text className="text-gray-600">Số lượng sản phẩm:</Text>
    <Text className="font-medium">{selected.order.items.length}</Text>
  </View>
  <View className="flex-row justify-between mb-1">
    <Text className="text-gray-600">Tổng tiền:</Text>
    <Text className="font-medium text-red-500">
      {selected.order.totalAmount.toLocaleString()}₫
    </Text>
  </View>
  <View className="flex-row justify-between mb-1">
    <Text className="text-gray-600">Thanh toán:</Text>
    <Text className="font-medium">{selected.order.paymentMethod}</Text>
  </View>
  <View className="flex-row justify-between mb-1">
    <Text className="text-gray-600">Trạng thái thanh toán:</Text>
    <Text className="font-medium">{selected.order.paymentStatus}</Text>
  </View>
  <View className="flex-row justify-between">
    <Text className="text-gray-600">Thời gian đặt:</Text>
    <Text className="text-sm text-gray-600">
      {new Date(selected.order.createdAt).toLocaleString('vi-VN')}
    </Text>
  </View>
</View>

          <View className="bg-white p-4 rounded-lg mb-4 shadow">
            <View className="flex-row items-center gap-2 mb-3">
              <Truck size={20} color="blue" />
              <Text className="text-lg font-semibold">
                Trạng thái vận chuyển
              </Text>
            </View>
            {trackingSteps.map((step, index) => (
              <View key={index} className="flex-row gap-3 mb-4">
                <View className="items-center">
                  <View
                    className={`w-8 h-8 rounded-full justify-center items-center ${
                      step.status === 'completed'
                        ? 'bg-green-100'
                        : step.status === 'current'
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}
                  >
                    {step.status === 'completed' ? (
                      <CheckCircle size={16} color="green" />
                    ) : (
                      <Clock
                        size={16}
                        color={step.status === 'current' ? 'blue' : 'gray'}
                      />
                    )}
                  </View>
                  {index < trackingSteps.length - 1 && (
                    <View
                      className={`w-0.5 h-6 ${
                        step.status === 'completed'
                          ? 'bg-green-200'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-semibold ${
                      step.status === 'current'
                        ? 'text-blue-600'
                        : 'text-gray-800'
                    }`}
                  >
                    {step.title}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {step.description}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <Text className="text-xs text-gray-500">{step.time}</Text>
                    <MapPin size={12} color="gray" />
                    <Text className="text-xs text-gray-500">
                      {step.location}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          {/* Thông tin giao hàng */}
          <View className="bg-white p-4 rounded-lg mb-4 shadow">
            <Text className="text-lg font-semibold mb-2">Thông tin giao hàng</Text>
            <View className="flex-row gap-2 mb-2">
              <MapPin size={20} color="gray" />
              <View>
                <Text className="font-medium">Địa chỉ giao hàng</Text>
                <Text className="text-sm text-gray-600">
                  {`${selected.address.street}, ${selected.address.city}`}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <Clock size={20} color="gray" />
              <View>
                <Text className="font-medium">Thời gian giao hàng dự kiến</Text>
                <Text className="text-sm text-gray-600">
                  {selected.delivery.estimatedDeliveryDate
                    ? new Date(selected.delivery.estimatedDeliveryDate).toLocaleString('vi-VN')
                    : 'Chưa xác định'}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </ScrollView>
  )
}

export default Tracking
