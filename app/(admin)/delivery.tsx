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
  const [status, setStatus] = React.useState<string>('pending');
  const ITEMS_PER_PAGE = 5; // Số đơn giao hàng trên mỗi trang

  const { data: deliveryPersonnelData, isLoading: isLoadingPersonnel } = useDeliveryPersonnelQuery({
    page: 1,
    limit: 50
  });

  const router = useRouter();

  // Lấy tất cả delivery với limit 1000
  const { data: deliveryResp = { meta: { totalItems: 0 }, data: [] }, isLoading, isError } = useDeliveryQuerry({
    page: 1,
    limit: 1000
  }) as { data?: { meta: { totalItems: number }, data: IDelivery[] }, isLoading: boolean, isError: boolean };

  const allDeliveries: IDelivery[] = Array.isArray(deliveryResp.data) ? deliveryResp.data : [];

  // Lọc delivery theo status và phân trang
  const { filteredDeliveries, totalItems, totalPages } = React.useMemo(() => {
    let statusFiltered: IDelivery[];
    
    if (status === 'pending') {
      // Hiển thị cả pending và assigned
      statusFiltered = allDeliveries.filter((delivery: IDelivery) =>
        delivery.status === 'pending' || delivery.status === 'assigned'
      );
    } else {
      statusFiltered = allDeliveries.filter((delivery: IDelivery) => delivery.status === status);
    }
    
    // Tính toán pagination
    const totalItems = statusFiltered.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    
    // Lấy delivery cho trang hiện tại
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedDeliveries = statusFiltered.slice(startIndex, endIndex);
    
    return {
      filteredDeliveries: paginatedDeliveries,
      totalItems,
      totalPages
    };
  }, [allDeliveries, status, page]);

  const columns = [
    {
      colName: "#",
      render: (delivery: IDelivery) => {
        const index = filteredDeliveries.findIndex(d => d._id === delivery._id);
        return page * ITEMS_PER_PAGE + index + 1;
      },
      cellStyle: { justifyContent: 'center' as const, flex: 0.3 },
      textStyle: { textAlign: 'center' as const, fontSize: 12 },
    },
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

export default Delivery;
