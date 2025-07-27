import color from "@/assets/Color";
import CustomTable from "@/components/core/CustomTable";
import { formatDate } from "@/hooks/formatDate";
import {
  useAllOrder,
  useAllReturnRequests,
  useApproveReturnMutation,
  useRejectReturnMutation,
} from "@/tanstack/order";
import { useAllUser } from "@/tanstack/user/regis";
import { IOrder, OrderStatus } from "@/types/order";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DataTable, SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const statusOptions: { label: string; value: OrderStatus }[] = [
  { label: "Chờ xử lý", value: "Pending" },
  { label: "Đã gửi", value: "Shipped" },
  { label: "Đã hủy", value: "Cancelled" },
  { label: "Đã giao", value: "Delivered" },
  { label: "Trả hàng", value: "" },
];

const Order = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [status, setStatus] = React.useState<OrderStatus | "">("Pending");
  const [returnPage, setReturnPage] = React.useState(0);
  const [returnRowsPerPage, setReturnRowsPerPage] = React.useState(5);
  const [rejectModalVisible, setRejectModalVisible] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState("");
  const [currentRejectItem, setCurrentRejectItem] = React.useState<any | null>(
    null
  );
  const [customReason, setCustomReason] = React.useState("");

  const openRejectModal = (item) => {
    setCurrentRejectItem(item);
    setRejectModalVisible(true);
  };

  const confirmReject = () => {
    const finalReason =
      rejectReason === "other" ? customReason.trim() : rejectReason;

    if (!finalReason) {
      Toast.show({ type: "error", text1: "Vui lòng nhập lý do từ chối." });
      return;
    }

    handleReject({ ...currentRejectItem, reason: finalReason });
    setRejectReason("");
    setCustomReason("");
    setRejectModalVisible(false);
  };

  const approve = useApproveReturnMutation();
  const reject = useRejectReturnMutation();

  const {
    data: returnData,
    isLoading: returnLoading,
    refetch,
  } = useAllReturnRequests({
    page: returnPage + 1,
    limit: returnRowsPerPage,
  });
  const totalReturnItems = returnData?.meta?.totalItems || 0;

  const handleApprove = (item: any) => {
    const { _id, orderId, reason, images } = item;

    approve.mutate(
      {
        id: _id,
        body: { orderId, reason, images },
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Yêu cầu trả hàng đã được duyệt.",
          });
          refetch();
        },
        onError: () => {
          Toast.show({ type: "error", text1: "Duyệt yêu cầu thất bại." });
        },
      }
    );
  };

  const handleReject = (item: any) => {
    const { _id, reason } = item;

    reject.mutate(
      {
        id: _id,
        body: { reason },
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Đã từ chối yêu cầu trả hàng.",
          });
          refetch();
        },
        onError: () => {
          Toast.show({ type: "error", text1: "Từ chối yêu cầu thất bại." });
        },
      }
    );
  };

  const ITEMS_PER_PAGE = 5; // Số đơn hàng trên mỗi trang

  const router = useRouter();

  // Lấy tất cả đơn hàng với limit 1000
  const { data, isLoading, isError } = useAllOrder({ page: 1, limit: 1000 });

  // Lấy danh sách user
  const { data: userData, isLoading: isLoadingUsers } = useAllUser();
  const userMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    if (Array.isArray(userData?.data)) {
      userData.data.forEach((user: any) => {
        map[user._id] = user.email || user.username || "N/A";
      });
    }
    return map;
  }, [userData]);

  // Lọc đơn hàng theo status và phân trang
  const { filteredOrders, totalItems, totalPages } = React.useMemo(() => {
    const allOrders = Array.isArray(data?.data) ? data.data : [];

    // Lọc theo status
    const statusFiltered = status
      ? allOrders.filter((order: IOrder) => order.orderStatus === status)
      : allOrders;

    // Tính toán pagination
    const totalItems = statusFiltered.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Lấy đơn hàng cho trang hiện tại
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedOrders = statusFiltered.slice(startIndex, endIndex);

    return {
      filteredOrders: paginatedOrders,
      totalItems,
      totalPages,
    };
  }, [data?.data, status, page]);

  const columns = [
    {
      colName: "#",
      render: (order: IOrder) => {
        const index = filteredOrders.findIndex((o) => o._id === order._id);
        return page * ITEMS_PER_PAGE + index + 1;
      },
      cellStyle: { justifyContent: "center" as const, flex: 0.3 },
      textStyle: { textAlign: "center" as const, fontSize: 12 },
    },
    {
      colName: "Khách hàng",
      render: (order: IOrder) => userMap[order.userId] || order.userId || "",
    },
    {
      colName: "Ngày đặt",
      render: (order: IOrder) => formatDate(order.createdAt),
      cellStyle: { justifyContent: "flex-end" as const },
      textStyle: { textAlign: "right" as const },
    },
    {
      colName: "Tổng tiền",
      render: (order: IOrder) =>
        order.totalAmount.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
      cellStyle: { justifyContent: "flex-end" as const },
      textStyle: { textAlign: "right" as const },
    },
  ];

  const handleStatusChange = (value: string) => {
    setStatus(value as OrderStatus | "");
    setPage(0);
  };

  const handleRowClick = (order: IOrder) => {
    router.push(`/order-detail/${order._id}`);
  };

  if (isLoading || isLoadingUsers) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#c2185b" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Không thể tải dữ liệu đơn hàng.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Quản lý đơn hàng
        </Text>
        <SegmentedButtons
          value={status}
          onValueChange={handleStatusChange}
          buttons={statusOptions.map((opt) => ({
            value: opt.value,
            label: opt.label,
            style:
              status === opt.value
                ? { backgroundColor: color.quaternary }
                : undefined,
            labelStyle: status === opt.value ? { color: "#fff" } : undefined,
          }))}
          style={{ marginBottom: 16 }}
        />
        {status === "" ? (
          <View>
            <Text
              className="ml-4"
              style={{ fontSize: 16, fontWeight: "bold", marginVertical: 10 }}
            >
              Yêu cầu trả hàng
            </Text>
            <ScrollView className="px-4 space-y-4">
              {returnLoading && (
                <Text className="text-center text-gray-500 mt-4">
                  Đang tải yêu cầu trả hàng...
                </Text>
              )}
              {returnData?.data?.map((item: any) => (
                <TouchableOpacity
                  key={item._id}
                  className="p-4 bg-white rounded-lg shadow border space-y-2 mt-2"
                >
                  <Text className="text-lg font-semibold">
                    Người dùng: {item.userId?.email}
                  </Text>
                  <Text className="text-base text-gray-500">
                    <Text className="font-semibold">Mã đơn:</Text>{" "}
                    {item.orderId}
                  </Text>
                  <Text className="text-base text-gray-500">
                    <Text className="font-semibold">Lý do:</Text>{" "}
                    {item.reason || "Không có"}
                  </Text>
                  <Text className="text-base text-gray-500">
                    <Text className="font-semibold">Số lượng:</Text>{" "}
                    {item.quantity}
                  </Text>

                  {item.status === "approved" && (
                    <Text className="text-green-600 font-semibold">
                      Trạng thái: Đã chấp nhận
                    </Text>
                  )}

                  {item.status === "rejected" && (
                    <Text className="text-red-600 font-semibold">
                      Trạng thái: Đã từ chối
                    </Text>
                  )}

                  {!item.status && (
                    <View className="flex-row space-x-2">
                      <TouchableOpacity
                        className="bg-green-600 py-2 px-4 rounded-full flex-1"
                        onPress={() => handleApprove(item)}
                      >
                        <Text className="text-white font-semibold text-center">
                          Duyệt
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-red-600 py-2 px-4 rounded-full flex-1"
                        onPress={() => openRejectModal(item)}
                      >
                        <Text className="text-white font-semibold text-center">
                          Từ chối
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              {returnData?.data?.length === 0 && !returnLoading && (
                <Text className="text-center text-gray-500 mt-4">
                  Không có yêu cầu trả hàng.
                </Text>
              )}
            </ScrollView>
          </View>
        ) : (
          <>
            <CustomTable
              columns={columns}
              records={filteredOrders}
              onRowClick={handleRowClick}
            />

            {totalPages > 1 && (
              <DataTable.Pagination
                page={page}
                numberOfPages={totalPages}
                onPageChange={setPage}
                label={`${page * ITEMS_PER_PAGE + 1}-${Math.min(
                  (page + 1) * ITEMS_PER_PAGE,
                  totalItems
                )} trong ${totalItems}`}
                numberOfItemsPerPage={ITEMS_PER_PAGE}
                onItemsPerPageChange={() => {}} // Không cho phép thay đổi items per page
                showFastPaginationControls
                selectPageDropdownLabel={"Số dòng/trang"}
              />
            )}
          </>
        )}
      </View>
      <Modal visible={rejectModalVisible} transparent animationType="slide">
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <View className="bg-white w-full p-6 rounded-lg">
            <Text className="text-lg font-bold mb-3">Chọn lý do từ chối</Text>

            <View className="border border-gray-300 rounded mb-4">
              <Picker
                selectedValue={rejectReason}
                onValueChange={(itemValue) => setRejectReason(itemValue)}
              >
                <Picker.Item label="Chọn lý do" value="" />
                <Picker.Item
                  label="Không đủ điều kiện"
                  value="Không đủ điều kiện"
                />
                <Picker.Item
                  label="Ngoài thời hạn cho phép"
                  value="Ngoài thời hạn cho phép"
                />
                <Picker.Item
                  label="Thiếu bằng chứng"
                  value="Thiếu bằng chứng"
                />
                <Picker.Item
                  label="Nghi ngờ gian lận"
                  value="Nghi ngờ gian lận"
                />
                <Picker.Item label="Lý do khác" value="other" />
              </Picker>
            </View>

            {rejectReason === "other" && (
              <TextInput
                className="border border-gray-300 rounded p-2 mb-4"
                multiline
                placeholder="Nhập lý do khác..."
                value={customReason}
                onChangeText={setCustomReason}
              />
            )}

            <View className="flex-row justify-end space-x-3 mt-2">
              <TouchableOpacity
                className="px-4 py-2 bg-gray-300 rounded"
                onPress={() => {
                  setRejectModalVisible(false);
                  setRejectReason("");
                  setCustomReason("");
                  setCurrentRejectItem(null);
                }}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 bg-red-600 rounded"
                onPress={confirmReject}
              >
                <Text className="text-white font-semibold">Từ chối</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Order;
