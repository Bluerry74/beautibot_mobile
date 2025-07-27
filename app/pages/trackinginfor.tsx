import { deliverySteps } from "@/components/deliveryStatusMap";
import { post } from "@/httpservices/httpService";
import { getAllTrackingData } from "@/services/tracking";
import { useAuthStore } from "@/store/auth";
import { useRequestReturnMutation } from "@/tanstack/order";
import { ITrackingData } from "@/types/tracking";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import {
  Check,
  CheckCircle,
  Clock,
  Copy,
  MapPin,
  Truck,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const Tracking = () => {
  const user = useAuthStore((state) => state.user);
  const [trackingList, setTrackingList] = useState<ITrackingData[]>([]);
  const [selected, setSelected] = useState<ITrackingData | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const requestReturnMutation = useRequestReturnMutation();

  const fetchTrackingList = async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const deliveries = await getAllTrackingData(user.email);
      setTrackingList(deliveries);
      console.log("Danh sách tracking:", deliveries);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tracking:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyTrackingNumber = async (trackingNumber: string) => {
    await Clipboard.setStringAsync(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    fetchTrackingList();
  }, []);
  const getTrackingSteps = () => {
    if (!selected) return [];

    const currentStatus = selected.delivery.status;
    const currentIndex = deliverySteps.findIndex(
      (step) => step.key === currentStatus
    );

    return deliverySteps.map((step, index) => {
      let status: "completed" | "current" | "upcoming" = "upcoming";
      if (index < currentIndex) status = "completed";
      else if (index === currentIndex) status = "current";

      return {
        ...step,
        status,
        time: selected.delivery.updatedAt
          ? new Date(selected.delivery.updatedAt).toLocaleTimeString("vi-VN")
          : "",
        location: selected.address.city || "Không rõ địa điểm",
      };
    });
  };
  const trackingSteps = selected ? getTrackingSteps() : [];

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSubmit = () => {
    if (!selected) return;
    const payload = {
      orderId: selected.order._id,
      reason: reason.trim() || "Sản phẩm bị hỏng khi vận chuyển",
      images: images || [],
    };
    console.log("Payload gửi đi:", payload);
    requestReturnMutation.mutate(payload);
  };

  return (
    <ScrollView className="bg-gray-100 flex-1 p-4">
      <View className="flex-row items-center justify-between mt-10 mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#ff9c86" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-center text-gray-800">
          Theo dõi đơn hàng
        </Text>
        <Ionicons name="information-circle-outline" size={24} color="#ff9c86" />
      </View>

      {loading && (
        <Text className="text-center text-gray-500 mb-4">
          Đang tải dữ liệu...
        </Text>
      )}

      {!loading &&
        !selected &&
        trackingList.map((item, idx) => (
          <TouchableOpacity
            key={item.delivery._id}
            onPress={() => setSelected(item)}
            className="bg-white p-4 rounded-lg mb-3 shadow"
          >
            <View className="flex-row justify-between">
              <Text className="font-semibold">
                #{item.delivery.trackingNumber}
              </Text>
              <Text className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs">
                {item.delivery.status}
              </Text>
            </View>
            <Text className="text-sm text-gray-600 mt-1">
              {item.address.fullName} - {item.address.city} -{" "}
              {item.address.country} - {item.address.postalCode}
            </Text>
          </TouchableOpacity>
        ))}

      {selected && (
        <>
          <TouchableOpacity onPress={() => setSelected(null)} className="mb-4">
            <Text className="text-blue-500">Quay lại danh sách</Text>
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
                <Text className="font-mono text-sm">
                  {selected.delivery.trackingNumber}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    copyTrackingNumber(selected.delivery.trackingNumber)
                  }
                >
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
              <Text className="font-medium">
                {selected.order.paymentMethod}
              </Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Trạng thái thanh toán:</Text>
              <Text className="font-medium">
                {selected.order.paymentStatus}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Thời gian đặt:</Text>
              <Text className="text-sm text-gray-600">
                {new Date(selected.order.createdAt).toLocaleString("vi-VN")}
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
                      step.status === "completed"
                        ? "bg-green-100"
                        : step.status === "current"
                        ? "bg-blue-100"
                        : "bg-gray-100"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle size={16} color="green" />
                    ) : (
                      <Clock
                        size={16}
                        color={step.status === "current" ? "blue" : "gray"}
                      />
                    )}
                  </View>
                  {index < trackingSteps.length - 1 && (
                    <View
                      className={`w-0.5 h-6 ${
                        step.status === "completed"
                          ? "bg-green-200"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-semibold ${
                      step.status === "current"
                        ? "text-blue-600"
                        : "text-gray-800"
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
            <Text className="text-lg font-semibold mb-2">
              Thông tin giao hàng
            </Text>
            <View className="flex-row gap-2 mb-2">
              <MapPin size={20} color="gray" />
              <View>
                <Text className="font-medium">Địa chỉ giao hàng</Text>
                <Text className="text-sm text-gray-600">
                  {`${selected.address.street}, ${selected.address.city}, ${selected.address.country},, ${selected.address.postalCode}`}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              <Clock size={20} color="gray" />
              <View>
                <Text className="font-medium">Thời gian giao hàng dự kiến</Text>
                <Text className="text-sm text-gray-600">
                  {selected.delivery.estimatedDeliveryDate
                    ? new Date(
                        selected.delivery.estimatedDeliveryDate
                      ).toLocaleString("vi-VN")
                    : "Chưa xác định"}
                </Text>
              </View>
            </View>
          </View>

          {selected?.delivery?.status === "delivered" && (
            <>
              <View>
                <TouchableOpacity
                  disabled={loading || requestReturnMutation.isSuccess}
                  onPress={() => setVisible(true)}
                  className={`rounded-lg p-3 ${
                    requestReturnMutation.isSuccess
                      ? "bg-gray-500"
                      : "bg-red-500"
                  }`}
                >
                  <Text className="text-lg font-semibold text-white text-center">
                    {requestReturnMutation.isSuccess
                      ? "Đã gửi yêu cầu trả hàng"
                      : "Yêu cầu trả hàng"}
                  </Text>
                </TouchableOpacity>
              </View>

              <Modal visible={visible} animationType="slide" transparent>
                <View className="flex-1 bg-black/50 justify-center">
                  <View className="bg-white mx-6 p-4 rounded-lg">
                    <Text className="text-lg font-semibold mb-3">
                      Lý do trả hàng
                    </Text>
                    <TextInput
                      value={reason}
                      onChangeText={setReason}
                      placeholder="Nhập lý do..."
                      className="border border-gray-300 rounded p-2 mb-3"
                      multiline
                    />

                    <Text className="text-lg font-semibold mb-2">
                      Ảnh minh họa
                    </Text>
                    <ScrollView horizontal className="mb-3">
                      {images.map((uri, idx) => (
                        <View key={idx} className="relative mr-2">
                          <Image
                            source={{ uri }}
                            className="w-20 h-20 rounded"
                          />
                          <TouchableOpacity
                            onPress={() =>
                              setImages(images.filter((_, i) => i !== idx))
                            }
                            className="absolute -top-2 -right-2 bg-gray-500 w-6 h-6 rounded-full items-center justify-center"
                          >
                            <Text className="text-white text-xs">✕</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                      <TouchableOpacity
                        onPress={openImagePicker}
                        className="w-20 h-20 bg-gray-200 items-center justify-center rounded"
                      >
                        <Text className="text-gray-600 text-sm">+ Thêm</Text>
                      </TouchableOpacity>
                    </ScrollView>

                    <View className="flex-row justify-between">
                      <TouchableOpacity
                        onPress={() => setVisible(false)}
                        className="bg-gray-300 rounded p-3 flex-1 mr-2"
                      >
                        <Text className="text-center">Hủy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={loading}
                        onPress={handleSubmit}
                        className="bg-red-500 rounded p-3 flex-1 ml-2"
                      >
                        <Text className="text-white text-center">
                          {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default Tracking;
