import { get } from "@/httpservices/httpService";
import {
  useUpdateDeliveryStatusMutation,
  useUploadProofMutation,
} from "@/tanstack/delivery";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { ImageUp, Navigation, Phone } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrackingDetail() {
  const { deliveryId } = useLocalSearchParams();
  const [delivery, setDelivery] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { mutate: uploadProof, isPending: isUploading } = useUploadProofMutation();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateDeliveryStatusMutation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleUpload = () => {
    if (selectedImage && deliveryId) {
      uploadProof({
        imageUri: selectedImage.uri,
        deliveryId: deliveryId.toString(),
      });
    }
  };

  const handleStatusChange = (newStatus: string) => {
    if (!delivery) return;
    updateStatus(
      { deliveryId: delivery._id, status: newStatus },
      {
        onSuccess: () => fetchDelivery(),
      }
    );
  };

  const fetchDelivery = async () => {
    try {
      const response = await get(`/delivery/${deliveryId}`);
      setDelivery(response.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu đơn giao:", error);
    }
  };

  useEffect(() => {
    if (deliveryId) {
      fetchDelivery();
    }
  }, [deliveryId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchDelivery();
    setRefreshing(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "processing":
        return "Đang xử lý đơn hàng";
      case "assigned":
        return "Đã sắp xếp người giao hàng";
      case "out_for_delivery":
        return "Đang trên đường giao hàng";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã huỷ";
      case "failed":
        return "Giao hàng thất bại";
      default:
        return "Chờ xác nhận";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processing":
        return "bg-yellow-400";
      case "assigned":
        return "bg-indigo-400";
      case "out_for_delivery":
        return "bg-blue-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!delivery) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <View className="bg-white p-6 rounded-xl shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            Đang tải...
          </Text>
          <Text className="text-gray-600">Vui lòng chờ trong giây lát</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="bg-primary-600 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View className="flex-1 mx-4">
            <Text className="text-black text-2xl font-semibold text-center">
              Chi tiết đơn hàng
            </Text>
            <Text className="text-black text-sm text-center">
              {delivery.trackingNumber}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert("Thông tin đơn", `Mã: ${delivery.trackingNumber}`)
            }
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <View
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    delivery.status
                  )} mr-2`}
                />
                <Text className="text-lg font-semibold text-gray-900">
                  {getStatusText(delivery.status)}
                </Text>
              </View>
              <Text className="text-gray-600">
                Dự kiến giao:{" "}
                {new Date(delivery.deliveryDate).toLocaleDateString("vi-VN")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://maps.google.com/?q=${encodeURIComponent(
                    `${delivery.shippingAddress.street}, ${delivery.shippingAddress.city}, ${delivery.shippingAddress.country}`
                  )}`
                )
              }
              className="bg-blue-50 p-3 rounded-lg"
            >
              <Ionicons name="map-outline" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <View className="border-t border-gray-100 pt-4">
            <Text className="font-semibold text-gray-900 mb-3">
              Thông tin đơn hàng
            </Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Người nhận:</Text>
                <Text className="font-medium">
                  {delivery.shippingAddress.fullName}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">SDT:</Text>
                <Text className="font-medium">
                  {delivery.shippingAddress.phone}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Địa chỉ:</Text>
                <Text className="font-medium">
                  {delivery.shippingAddress.street},{" "}
                  {delivery.shippingAddress.city},{" "}
                  {delivery.shippingAddress.country}
                </Text>
              </View>
              {delivery.deliveryFee !== "0đ" && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Phí giao hàng</Text>
                  <Text className="font-medium text-orange-600">
                    {delivery.deliveryFee.toLocaleString()} VND
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View className="flex-row gap-2 mt-5">
            <TouchableOpacity
              className="flex-1 bg-white border border-gray-300 px-3 py-2 rounded flex-row items-center justify-center"
              onPress={() => Linking.openURL(`tel:${delivery.phone}`)}
            >
              <Phone size={16} className="mr-2" color="red" />
              <Text className="text-red-500"> Gọi khách</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-green-500 border border-gray-300 px-3 py-2 rounded flex-row items-center justify-center"
              onPress={() =>
                Linking.openURL(
                  `https://maps.google.com/?q=${encodeURIComponent(
                    `${delivery.shippingAddress.street}, ${delivery.shippingAddress.city}, ${delivery.shippingAddress.country}`
                  )}`
                )
              }
            >
              <Navigation size={16} className="mr-2" color="white" />
              <Text className="text-white"> Chỉ đường</Text>
            </TouchableOpacity>
          </View>
        </View>

        {delivery.status === "assigned" && (
          <TouchableOpacity
            className="flex-1 px-3 py-2 rounded items-center mx-4 mt-4"
            style={{ backgroundColor: "#ff9c86" }}
            onPress={() => handleStatusChange("out_for_delivery")}
            disabled={isUpdatingStatus}
          >
            <Text className="text-white">
              {isUpdatingStatus ? "Đang cập nhật..." : "Bắt đầu giao hàng"}
            </Text>
          </TouchableOpacity>
        )}
        {delivery.status === "out_for_delivery" && (
          <View className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Bằng chứng giao hàng
            </Text>
            <View className="space-y-4">
              <View>
                <Text className="font-medium text-gray-900 mb-2">
                  Ảnh giao hàng
                </Text>
                <TouchableOpacity
                  className={`mx-32 py-3 rounded-lg items-center flex-row gap-2 justify-center ${
                    isUploading
                      ? "bg-gray-400"
                      : selectedImage
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                  onPress={selectedImage ? handleUpload : pickImage}
                  disabled={isUploading}
                >
                  <ImageUp size={20} color="white" />
                  <Text className="text-white font-semibold">
                    {isUploading
                      ? "Đang gửi..."
                      : selectedImage
                      ? "Tải ảnh lên"
                      : "Chọn ảnh"}
                  </Text>
                </TouchableOpacity>
              </View>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage.uri }}
                  className="w-full h-48 rounded-lg bg-gray-200"
                />
              )}
              <View className="mt-4 flex-row justify-between space-x-4">
                <TouchableOpacity
                  className={`flex-1 px-3 py-2 rounded items-center mr-3 ${
                    isUpdatingStatus ? "bg-gray-400" : "bg-red-600"
                  }`}
                  onPress={() => handleStatusChange("failed")}
                  disabled={isUpdatingStatus}
                >
                  <Text className="text-white">
                    {isUpdatingStatus
                      ? "Đang cập nhật..."
                      : "Giao hàng thất bại"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-1 px-3 py-2 rounded items-center ml-3 ${
                    !selectedImage || isUpdatingStatus
                      ? "bg-gray-400"
                      : "bg-green-600"
                  }`}
                  onPress={() => handleStatusChange("delivered")}
                  disabled={!selectedImage || isUpdatingStatus}
                >
                  <Text className="text-white">
                    {isUpdatingStatus
                      ? "Đang cập nhật..."
                      : "Giao hàng thành công"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        {delivery.status === "delivered" && (
          <View className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Bằng chứng giao hàng
            </Text>
            <View className="space-y-4">
              <View>
                <Text className="font-medium text-gray-900 mb-2">
                  Ảnh giao hàng
                </Text>
                <Image
                  source={{ uri: delivery.proofOfDeliveryUrl }}
                  className="w-full h-48 rounded-lg bg-gray-200"
                />
              </View>
              <View>
                <Text className="font-medium text-gray-900 mb-2">
                  Ghi chú giao hàng
                </Text>
                <Text className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  Giao hàng thành công. Khách hàng nhận hàng trực tiếp tại cửa.
                </Text>
              </View>
            </View>
          </View>
        )}
        {delivery.status === "failed" && (
          <View className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Lý do giao hàng thất bại
            </Text>
            <Text className="text-gray-600">
              Khách hàng không có mặt tại địa chỉ giao hàng hoặc từ chối nhận
              hàng.
            </Text>
            <View className="mt-4 flex-row justify-between space-x-4">
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage.uri }}
                  className="w-full h-48 rounded-lg bg-gray-200"
                />
              )}
              <TouchableOpacity
                className={`flex-1 px-3 py-2 rounded items-center mr-3 ${
                  isUpdatingStatus ? "bg-gray-400" : "bg-gray-400"
                }`}
                onPress={() => handleStatusChange("cancelled")}
                disabled={true}
              >
                <Text className="text-white">
                  Gửi 
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {delivery.status === "cancelled" && (
          <View className="mx-4 mt-4 bg-white rounded-xl shadow-sm p-4">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Đơn hàng đã bị hủy
            </Text>
            <Text className="font-medium text-gray-900 mb-2">
              Lý do huỷ đơn
            </Text>
            <Text className="text-gray-600">
              {delivery.cancellationReason || "Khách hàng đã không nhận hàng."}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
