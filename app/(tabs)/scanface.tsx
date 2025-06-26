import { View, Text, TouchableOpacity, Button, StyleSheet,Alert  } from 'react-native'
import React, { useState } from 'react'
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

const Scanface = () => {
 const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

    const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert('Ảnh đã chọn', result.assets[0].uri);
    }
  };
  const handleCapture = () => {
    Alert.alert('Chụp ảnh', 'Tính năng chụp ảnh chưa triển khai.');

  };


  return (
    <View className="flex-1">
      <CameraView style={styles.camera} facing={facing} />

      <View className="absolute bottom-10 w-full flex-row justify-around px-6">
        <TouchableOpacity
          className="bg-white px-4 py-2 rounded"
          onPress={handlePickImage}
        >
          <Text className="text-black font-semibold">Upload ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white px-4 py-2 rounded"
          onPress={handleCapture}
        >
          <Text className="text-black font-semibold">Chụp ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white px-4 py-2 rounded"
          onPress={toggleCameraFacing}
        >
          <Text className="text-black font-semibold">Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Scanface

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});