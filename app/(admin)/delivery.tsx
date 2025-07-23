import color from '@/assets/Color';
import CustomTable from '@/components/core/CustomTable';
import { useDeliveryPersonnelQuery, useDeliveryQuerry } from '@/tanstack/delivery';
import { IDelivery } from '@/types/delivery';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import { DataTable, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const statusOptions = [
  { label: 'Đơn giao', value: 'pending' },
  { label: 'Xuất kho', value: 'out_for_delivery' },
  { label: 'Đã giao', value: 'delivered' },
  { label: 'Thất bại', value: 'failed' },
];

const Delivery = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [status, setStatus] = React.useState<string>('pending');
  const { data: deliveryPersonnelData, isLoading: isLoadingPersonnel } = useDeliveryPersonnelQuery({
    page: 1,
    limit: 50
  });

  const router = useRouter();

  // Lấy danh sách delivery với status filter
  const { data: deliveryResp = { meta: { totalItems: 0 }, data: [] }, isLoading, isError } = useDeliveryQuerry({
    page: page + 1,
    limit: rowsPerPage,
    status: status === 'pending' ? undefined : status // Gửi status filter lên API
  }) as { data?: { meta: { totalItems: number }, data: IDelivery[] }, isLoading: boolean, isError: boolean };

  const totalItems = deliveryResp.meta.totalItems || 0;
  const deliveries: IDelivery[] = Array.isArray(deliveryResp.data) ? deliveryResp.data : [];

  // Lọc theo trạng thái (nếu API không hỗ trợ filter, fallback về client-side filtering)
  const filteredDeliveries = React.useMemo(() => {
    if (status === 'pending') {
      // Hiển thị cả pending và assigned
      return deliveries.filter((delivery: IDelivery) =>
        delivery.status === 'pending' || delivery.status === 'assigned'
      );
    }
    return deliveries.filter((delivery: IDelivery) => delivery.status === status);
  }, [deliveries, status]);

  const columns = [
    {
      colName: "Mã Giao Hàng",
      render: (delivery: IDelivery) => delivery._id,
    },
    {
      colName: "Khách Hàng",
      render: (delivery: IDelivery) => delivery.shippingAddress?.fullName || "",
    },
    {
      colName: "Shipper",
      render: (delivery: IDelivery) => {
        if (delivery.status === 'pending') {
          return (
            <View style={{ backgroundColor: '#eee', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'center' }}>
              <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 12 }}>Chưa phân công</Text>
            </View>
          );
        }
        const personnel = deliveryPersonnelData?.data?.find(p => p._id === delivery.deliveryPersonnelId);
        const personnelEmail = personnel?.email || delivery.deliveryPersonnelId || 'Không có';

        return (
          <View style={{ backgroundColor: '#1976d2', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'center' }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
              {personnelEmail}
            </Text>
          </View>
        );
      },
      cellStyle: { justifyContent: 'center' as const },
      textStyle: { textAlign: 'center' as const },
    },
  ];

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(0); // Reset về trang đầu tiên khi đổi status
  };

  const handleRowClick = (delivery: IDelivery) => {
    router.push({
      pathname: '/deliveries-manage/[deliveryId]',
      params: { deliveryId: delivery._id },
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#c2185b" />
        <Text>Đang tải danh sách giao hàng...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không thể tải dữ liệu giao hàng.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, padding: 16, paddingTop: Platform.OS === 'ios' ? 0 : 16 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
          Quản lý giao hàng
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
          records={filteredDeliveries}
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

export default Delivery;
