import { useSendVerifiedTokenMutation, useSendVerifyEmailMutation } from '@/tanstack/user';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function VerifyEmailScreen() {
  const [token, setToken] = useState('');
  const router = useRouter();

  // Gửi email xác thực khi vào trang
  const sendMailMutation = useSendVerifyEmailMutation();
  useEffect(() => {
    sendMailMutation.mutate(undefined, {
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'Đã gửi email xác thực!' });
      },
      onError: () => {
        Toast.show({ type: 'error', text1: 'Gửi email xác thực thất bại!' });
      },
    });
  }, []);

  // Gửi token xác thực
  const verifyTokenMutation = useSendVerifiedTokenMutation();
  const handleVerify = () => {
    if (!token) {
      Toast.show({ type: 'error', text1: 'Vui lòng nhập token!' });
      return;
    }
    verifyTokenMutation.mutate(token, {
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'Xác thực thành công!' });
        setTimeout(() => {
          router.push('/');
        }, 1000);
      },
      onError: () => {
        Toast.show({ type: 'error', text1: 'Xác thực thất bại!' });
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác thực email</Text>
      <Text style={styles.desc}>Nhập mã token đã gửi về email của bạn để xác thực tài khoản.</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập token xác thực"
        value={token}
        onChangeText={setToken}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={verifyTokenMutation.isPending}>
        <Text style={styles.buttonText}>{verifyTokenMutation.isPending ? 'Đang xác thực...' : 'Xác thực'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#c2185b',
  },
  desc: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    marginBottom: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#ff9c86',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
}); 