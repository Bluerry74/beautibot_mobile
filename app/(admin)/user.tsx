import color from '@/assets/Color';
import CustomTable from '@/components/core/CustomTable';
import { useAuthStore } from '@/store/auth';
import { getAllUserPaginationQuerry } from '@/tanstack/user';
import { User } from '@/types/user';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { DataTable, Modal, Portal, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const roleOptions = [
  { label: 'Admin', value: 'admin' },
  { label: 'Delivery', value: 'delivery' },
  { label: 'User', value: 'user' },
];

const roleBadgeColor = (role: string) => {
  switch (role) {
    case 'admin': return '#1976d2'; // xanh dương
    case 'delivery': return '#ff9800'; // cam
    case 'user': return '#fff'; // user: nền trắng
    default: return '#e0e0e0';
  }
};


const UserAdmin = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [role, setRole] = React.useState<string>('admin');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [selectedRole, setSelectedRole] = React.useState<string>('user');

  const router = useRouter();
  const logout = () => {  
    useAuthStore.getState().logout();
    router.push("/");
  }
  const { data, isLoading, isError } = getAllUserPaginationQuerry({ page: page + 1, limit: rowsPerPage });
  const totalItems = data?.metadata?.totalItems || 0;
  const users: User[] = Array.isArray(data?.data) ? data.data : [];

  const filteredUsers = React.useMemo(() => {
    if (!role) return users;
    return users.filter(u => u.role === role);
  }, [users, role]);

  const columns = [
    {
      colName: 'Email',
      render: (user: User) => user.email,
    },
    // {
    //   colName: 'Role',
    //   render: (user: User) => user.role,
    // },
    // {
    //   colName: 'Ngày tạo',
    //   render: (user: User) => formatDate(user.createdAt || ''),
    //   cellStyle: { justifyContent: 'center' as const },
    //   textStyle: { textAlign: 'center' as const },
    // },
    {
      colName: 'Xác thực',
      render: (user: User) => user.isVerified ? (
        <Text style={{ color: '#43a047', fontWeight: 'bold' }}>Đã xác thực</Text>
      ) : (
        <Text style={{ color: '#e53935', fontWeight: 'bold' }}>Chưa xác thực</Text>
      ),
      cellStyle: { justifyContent: 'center' as const },
      textStyle: { textAlign: 'center' as const },
    },
    {
      colName: 'Phân quyền',
      render: (user: User) => (
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              backgroundColor: roleBadgeColor(user.role || 'user'),
              color: user.role === 'admin' ? '#fff' : user.role === 'delivery' ? '#fff' : '#222',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 4,
              fontWeight: 'bold',
              fontSize: 13,
              overflow: 'hidden',
              minWidth: 80,
              textAlign: 'center',
              borderWidth: user.role === 'user' ? 1 : 0,
              borderColor: user.role === 'user' ? '#222' : undefined,
            }}
            onPress={() => {
              setSelectedUser(user);
              setSelectedRole(user.role || 'user');
              setModalVisible(true);
            }}
          >
            {user.role === 'admin' ? 'Admin' : user.role === 'delivery' ? 'Delivery' : 'User'}
          </Text>
        </View>
      ),
      cellStyle: { justifyContent: 'center' as const },
      textStyle: { textAlign: 'center' as const },
    },
    // {
    //   colName: 'Khoá',
    //   render: (user: User) => user.isBanned ? (
    //     <Text style={{ color: '#e53935', fontWeight: 'bold' }}>Đã khoá</Text>
    //   ) : (
    //     <Text style={{ color: '#43a047', fontWeight: 'bold' }}>Hoạt động</Text>
    //   ),
    // },
    // {
    //   colName: 'Điểm',
    //   render: (user: User) => user.points ?? '',
    //   cellStyle: { justifyContent: 'flex-end' as const },
    //   textStyle: { textAlign: 'right' as const },
    // },
  ];

  const handleRoleChange = (value: string) => {
    setRole(value);
    setPage(0);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#c2185b" />
        <Text>Đang tải danh sách người dùng...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không thể tải dữ liệu người dùng.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={{ backgroundColor: 'white', margin: 32, borderRadius: 12, padding: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>Chọn quyền cho user</Text>
          {['admin', 'delivery', 'user'].map(roleOpt => (
            <Text
              key={roleOpt}
              style={{
                backgroundColor: roleBadgeColor(roleOpt),
                color: roleOpt === 'admin' ? '#fff' : roleOpt === 'delivery' ? '#fff' : '#222',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontWeight: selectedRole === roleOpt ? 'bold' : 'normal',
                fontSize: 16,
                marginBottom: 10,
                textAlign: 'center',
                overflow: 'hidden',
                opacity: selectedRole === roleOpt ? 1 : 0.7,
                borderWidth: roleOpt === 'user' ? 1 : 0,
                borderColor: roleOpt === 'user' ? '#222' : undefined,
              }}
              onPress={() => setSelectedRole(roleOpt)}
            >
              {roleOpt === 'admin' ? 'Admin' : roleOpt === 'delivery' ? 'Delivery' : 'User'}
            </Text>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}>
            <Text
              style={{ color: '#e53935', fontWeight: 'bold', fontSize: 16, padding: 8 }}
              onPress={() => setModalVisible(false)}
            >
              Huỷ
            </Text>
            <Text
              style={{ color: '#43a047', fontWeight: 'bold', fontSize: 16, padding: 8 }}
              onPress={() => {
                if (selectedUser) {
                  console.log('Change role:', { userId: selectedUser._id, newRole: selectedRole });
                }
                setModalVisible(false);
              }}
            >
              Xác nhận
            </Text>
          </View>
        </Modal>
      </Portal>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
          Quản lý người dùng
        </Text>
        <SegmentedButtons
          value={role}
          onValueChange={handleRoleChange}
          buttons={roleOptions.map(opt => ({
            value: opt.value,
            label: opt.label,
            style: role === opt.value ? { backgroundColor: color.quaternary } : undefined,
            labelStyle: role === opt.value ? { color: '#fff' } : undefined,
          }))}
          style={{ marginBottom: 16 }}
        />
        <CustomTable
          columns={columns}
          records={filteredUsers}
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
        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              marginTop: 24,
              borderWidth: 1,
              borderColor: '#e53935',
              borderRadius: 999,
              paddingVertical: 12,
              paddingHorizontal: 32,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={logout}
          >
            <MaterialIcons name="logout" size={20} color="#e53935" />
            <Text style={{ color: '#e53935', marginLeft: 8, fontWeight: 'bold', fontSize: 16 }}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserAdmin;
