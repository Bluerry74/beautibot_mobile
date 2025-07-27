import color from '@/assets/Color';
import CustomTable from '@/components/core/CustomTable';
import { formatDate } from '@/hooks/formatDate';
import { useAllOrder } from '@/tanstack/order';
import { useAllUser } from '@/tanstack/user/regis';
import { IOrder, OrderStatus } from '@/types/order';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { DataTable, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const statusOptions: { label: string; value: OrderStatus }[] = [
  { label: 'Chờ xử lý', value: 'Pending' },
  { label: 'Đã gửi', value: 'Shipped' },
  { label: 'Đã hủy', value: 'Cancelled' },
  { label: 'Đã giao', value: 'Delivered' },
];

const Order = () => {
  const [page, setPage] = React.useState(0);
  const [status, setStatus] = React.useState<OrderStatus | ''>('Pending');
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
        map[user._id] = user.email || user.username || 'N/A';
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
      totalPages
    };
  }, [data?.data, status, page]);

  const columns = [
    {
      colName: '#',
      render: (order: IOrder) => {
        const index = filteredOrders.findIndex(o => o._id === order._id);
        return page * ITEMS_PER_PAGE + index + 1;
      },
      cellStyle: { justifyContent: 'center' as const, flex: 0.3 },
      textStyle: { textAlign: 'center' as const, fontSize: 12 },
    },
    {
      colName: 'Khách hàng',
      render: (order: IOrder) => userMap[order.userId] || order.userId || '',
    },
    {
      colName: 'Ngày đặt',
      render: (order: IOrder) => formatDate(order.createdAt),
      cellStyle: { justifyContent: 'flex-end' as const },
      textStyle: { textAlign: 'right' as const },
    },
    {
      colName: 'Tổng tiền',
      render: (order: IOrder) => order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      cellStyle: { justifyContent: 'flex-end' as const },
      textStyle: { textAlign: 'right' as const },
    },
  ];

  const handleStatusChange = (value: string) => {
    setStatus(value as OrderStatus | '');
    setPage(0); // Reset về trang đầu khi đổi trạng thái
  };

  const handleRowClick = (order: IOrder) => {
    router.push(`/order-detail/${order._id}`);
  };

  if (isLoading || isLoadingUsers) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#c2185b" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không thể tải dữ liệu đơn hàng.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
          Quản lý đơn hàng
        </Text>
        <SegmentedButtons
          value={status}
          onValueChange={handleStatusChange}
          buttons={statusOptions.map(opt => ({
            value: opt.value,
            label: opt.label,
            style: status === opt.value ? { backgroundColor: color.quaternary } : undefined,
            labelStyle: status === opt.value ? { color: '#fff' } : undefined,
          }))}
          style={{ marginBottom: 16 }}
        />
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
            label={`${page * ITEMS_PER_PAGE + 1}-${Math.min((page + 1) * ITEMS_PER_PAGE, totalItems)} trong ${totalItems}`}
            numberOfItemsPerPage={ITEMS_PER_PAGE}
            onItemsPerPageChange={() => {}} // Không cho phép thay đổi items per page
            showFastPaginationControls
            selectPageDropdownLabel={'Số dòng/trang'}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Order;