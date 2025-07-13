import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native'
import * as Clipboard from 'expo-clipboard'
import {
  CheckCircle,
  Clock,
  Copy,
  Mail,
  MapPin,
  Package,
  Phone,
  Search,
  Truck,
  Check,
} from 'lucide-react-native'

const Tracking = () => {
    const [trackingNumber, setTrackingNumber] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleTrack = () => {
    if (trackingNumber.trim()) {
      setIsTracking(true)
    }
  }
   const copyTrackingNumber = async () => {
    await Clipboard.setStringAsync('VN123456789')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const trackingSteps = [
    {
      status: 'completed',
      title: 'Đơn hàng đã được tạo',
      description: 'Đơn hàng của bạn đã được xác nhận',
      time: '10:30 - 15/01/2024',
      location: 'Hồ Chí Minh',
    },
    {
      status: 'completed',
      title: 'Đã lấy hàng',
      description: 'Shipper đã lấy hàng từ người gửi',
      time: '14:20 - 15/01/2024',
      location: 'Quận 1, TP.HCM',
    },
    {
      status: 'completed',
      title: 'Đang vận chuyển',
      description: 'Hàng đang được vận chuyển đến kho phân loại',
      time: '16:45 - 15/01/2024',
      location: 'Kho Tân Sơn Nhất',
    },
    {
      status: 'current',
      title: 'Đang giao hàng',
      description: 'Shipper đang trên đường giao hàng',
      time: '09:15 - 16/01/2024',
      location: 'Quận 7, TP.HCM',
    },
     {
      status: 'pending',
      title: 'Giao hàng thành công',
      description: 'Dự kiến giao trong hôm nay',
      time: 'Dự kiến 11:00 - 16/01/2024',
      location: 'Địa chỉ nhận hàng',
    },
  ]
  return (
    <ScrollView className="bg-gray-100 flex-1 p-4 ">
      <Text className="text-xl font-bold text-center text-gray-800 mb-4 mt-8">
        Theo dõi đơn hàng
      </Text>
      <View className="bg-white p-4 rounded-lg mb-4 shadow">
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            placeholder="Nhập mã vận đơn (VD: VN123456789)"
            value={trackingNumber}
            onChangeText={setTrackingNumber}
          />
          <TouchableOpacity
            onPress={handleTrack}
            className="bg-blue-600 p-2 rounded-md"
          >
            <Search size={20} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-sm text-gray-600 mt-2">
          Nhập mã vận đơn để theo dõi tình trạng giao hàng
        </Text>
      </View>

      {isTracking && (
        <>
          <View className="bg-white p-4 rounded-lg mb-4 shadow">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-semibold">Thông tin đơn hàng</Text>
              <Text className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs">
                Đang giao hàng
              </Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-600">Mã vận đơn:</Text>
              <View className="flex-row items-center gap-2">
                <Text className="font-mono text-sm">VN123456789</Text>
                <TouchableOpacity onPress={copyTrackingNumber}>
                  {copied ? (
                    <Check size={16} color="green" />
                  ) : (
                    <Copy size={16} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View className="border-t my-2" />
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Người gửi:</Text>
              <Text className="font-medium">Nguyễn Thi Thu Hoai</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Người nhận:</Text>
              <Text className="font-medium">Nguyễn Hoài</Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Dịch vụ:</Text>
              <Text className="font-medium">Giao hàng nhanh</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Trọng lượng:</Text>
              <Text className="font-medium">1.2 kg</Text>
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

          <View className="bg-white p-4 rounded-lg mb-4 shadow">
            <Text className="text-lg font-semibold mb-2">Thông tin giao hàng</Text>
            <View className="flex-row gap-2 mb-2">
              <MapPin size={20} color="gray" />
              <View>
                <Text className="font-medium">Địa chỉ giao hàng</Text>
                <Text className="text-sm text-gray-600">
                  43 Hoàng Hữu Nam, TP. Hồ Chí Minh
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <Clock size={20} color="gray" />
              <View>
                <Text className="font-medium">Thời gian giao hàng dự kiến</Text>
                <Text className="text-sm text-gray-600">
                  Hôm nay, 10:00 - 12:00
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white p-4 rounded-lg mb-4 shadow">
            <Text className="text-lg font-semibold mb-3">Hỗ trợ khách hàng</Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('tel:1900123456')}
              className="flex-row items-center gap-3 mb-3"
            >
              <Phone size={18} color="gray" />
              <Text>Gọi hotline: 1900 123 456</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:support@shipping.com')}
              className="flex-row items-center gap-3"
            >
              <Mail size={18} color="gray" />
              <Text>Email: support@shipping.com</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Quick Actions */}
      {!isTracking && (
        <View className="bg-white p-4 rounded-lg shadow">
          <Text className="text-lg font-semibold mb-3">Tra cứu nhanh</Text>
          <TouchableOpacity
            onPress={() => {
              setTrackingNumber('VN123456789')
              setIsTracking(true)
            }}
            className="flex-row items-center gap-2 mb-3"
          >
            <Package size={20} />
            <Text>Xem đơn hàng mẫu</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center gap-2">
            <Clock size={20} />
            <Text>Lịch sử tra cứu</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  )
}

export default Tracking