import * as ImagePicker from "expo-image-picker";
import React from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  skuId: string;
  images: string[];
  onUpload: (files: any[]) => void;
  onDelete: (index: number) => void;
  onReplace: (index: number, file: any) => void;
}

const SkuImagesUpload = ({ skuId, images, onUpload, onDelete, onReplace }: Props) => {
  const pickMultipleImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your media library");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      onUpload(result.assets);
    }
  };

  const pickSingleImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      onReplace(index, result.assets[0]);
    }
  };

  return (
    <View>
      <Text style={styles.title}>Ảnh SKU</Text>
      <FlatList
        data={images}
        keyExtractor={(_, idx) => String(idx)}
        horizontal
        renderItem={({ item, index }) => (
          <View style={styles.imageItem}>
            <TouchableOpacity onPress={() => pickSingleImage(index)}>
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => onDelete(index)}
            >
              <Ionicons name="close" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.uploadBtn} onPress={pickMultipleImages}>
        <Text style={{ color: "#fff", textAlign: "center" }}>+ Thêm ảnh</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SkuImagesUpload;

const styles = StyleSheet.create({
  title: { fontWeight: "bold", marginTop: 12, marginBottom: 6 },
  imageItem: { marginRight: 10, position: "relative" },
  image: { width: 80, height: 80, borderRadius: 8 },
  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#f44336",
    borderRadius: 10,
    padding: 2,
  },
  uploadBtn: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
});
