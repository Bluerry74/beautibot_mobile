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
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DataTable, SegmentedButtons } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const { mutate: approveReturn, isPending: isApproving } =
    useApproveReturnMutation();
  const { mutate: rejectReturn, isPending: isRejecting } =
    useRejectReturnMutation();
  const { data: returnData, isLoading: returnLoading } = useAllReturnRequests({
    page: returnPage + 1,
    limit: returnRowsPerPage,
  });
  const totalReturnItems = returnData?.meta?.totalItems || 0;
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
                    <Text className="font-semibold">Đơn hàng:</Text>{" "}
                    {item.orderId}
                  </Text>
                  <Text className="text-base text-gray-500">
                    Lý do:{" "}
                    <Text className="font-semibold">
                      {item.reason || "Không có"}
                    </Text>
                  </Text>
                  <Text className="text-base text-gray-500">
                    Số lượng:{" "}
                    <Text className="font-semibold">{item.quantity}</Text>
                  </Text>
                  <View className="mt-2">
                    {item.status === "approved" ? (
                      <Text className="text-xl font-semibold">
                        Trạng thái:
                        <Text className="text-green-600">Đã chấp nhận</Text>
                      </Text>
                    ) : item.status === "rejected" ? (
                      <Text className="text-xl font-semibold">
                        Trạng thái:
                        <Text className="text-red-600">Đã từ chối</Text>
                      </Text>
                    ) : (
                      <View className="flex-row">
                        <TouchableOpacity
                          className="bg-green-500 py-2 rounded-full flex-1 mr-2"
                          onPress={() => approveReturn(item._id)}
                          disabled={isApproving}
                        >
                          <Text className="text-white font-semibold text-center">
                            Duyệt
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="bg-red-500 py-2 rounded-full flex-1"
                          onPress={() => rejectReturn(item._id)}
                          disabled={isRejecting}
                        >
                          <Text className="text-white font-semibold text-center">
                            Từ chối
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
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
    </SafeAreaView>
  );
};

export default Order;
