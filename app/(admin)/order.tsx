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
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [status, setStatus] = React.useState<OrderStatus | ''>('Pending');

  const router = useRouter();

  const { data, isLoading, isError } = useAllOrder({ page: page + 1, limit: rowsPerPage, status: status || undefined });
  const totalItems = data?.meta?.totalItems || 0;

  // Lấy danh sách user
  const { data: userData } = useAllUser();
  const userMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    if (Array.isArray(userData?.data)) {
      userData.data.forEach((user: any) => {
        map[user._id] = user.email;
      });
    }
    return map;
  }, [userData]);

  const columns = [
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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#c2185b" />
        <Text>Đang tải đơn hàng...</Text>
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
          records={Array.isArray(data?.data) ? data.data : []}
          onRowClick={handleRowClick}
        />
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(totalItems / rowsPerPage)}
          onPageChange={setPage}
          label={`${page * rowsPerPage + 1}-${Math.min((page + 1) * rowsPerPage, totalItems)} trong ${totalItems}`}
          numberOfItemsPerPage={rowsPerPage}
          onItemsPerPageChange={setRowsPerPage}
          showFastPaginationControls
          selectPageDropdownLabel={'Số dòng/trang'}
        />
      </View>
    </SafeAreaView>
  );
};

export default Order;