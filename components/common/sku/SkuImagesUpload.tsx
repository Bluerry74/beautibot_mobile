import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

interface SkuImagesUploadProps {
    skuId: string;
    images: string[];
    onUpload: (files: any[]) => Promise<void>;
    onDelete: (index: number) => Promise<void>;
    onReplace: (index: number, file: any) => Promise<void>;
}
export default function SkuImagesUploadMobile({
    skuId,
    images,
    onUpload,
    onDelete,
}: SkuImagesUploadProps) {
    // Bỏ useState cho images
    // const [images, setImages] = useState<string[]>(initialImages || []);

    const pickImage = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('Permission granted:', permission.granted);
        if (!permission.granted) {
            Alert.alert(
                "Permission required",
                "Please allow access to your media library."
            );
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            quality: 0.8,
            allowsMultipleSelection: false,
        });
        console.log('Picker result:', pickerResult);

        if (!pickerResult.canceled && pickerResult.assets?.length) {
            const file = {
                uri: pickerResult.assets[0].uri,
                name: "image.jpg",
                type: "image/jpeg",
            } as any;

            await onUpload([file]);
            // setImages((prev) => [...prev, file.uri]); // Bỏ setImages
        }
    };
    const handleDelete = async (index: number) => {
        Alert.alert("Xác nhận", "Bạn có chắc muốn xóa ảnh này?", [
            { text: "Hủy", style: "cancel" },
            {
                text: "Xóa",
                style: "destructive",
                onPress: async () => {
                    try {
                        await onDelete(index);
                        // setImages((prev) => prev.filter((_, i) => i !== index)); // Bỏ setImages
                    } catch (err) {
                        Toast.show({
                            type: "error",
                            text1: "Xoá ảnh thất bại!",
                        });
                    }
                },
            },
        ]);
    };
    return (
        <View>
            <Text style={styles.title}>Hình ảnh SKU</Text>
            <ScrollView horizontal style={styles.imageContainer}>
                {images.map((uri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.image} />

                        <View style={styles.iconGroup}>
                            {/* Nút xoá ảnh */}
                            <TouchableOpacity
                                style={styles.iconBtn}
                                onPress={() => handleDelete(index)}
                            >
                                <Ionicons
                                    name="trash"
                                    size={18}
                                    color="#ef4444"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <TouchableOpacity
                    onPress={pickImage}
                    style={styles.uploadButton}
                >
                    <Ionicons
                        name="add-circle-outline"
                        size={36}
                        color="#888"
                    />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
    imageContainer: { flexDirection: "row", paddingVertical: 8 },
    imageWrapper: {
        position: "relative",
        marginRight: 8,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: "#eee",
    },
    deleteBtn: {
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: "#fff",
        borderRadius: 999,
        padding: 1,
    },
    uploadButton: {
        width: 80,
        height: 80,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        borderStyle: "dashed",
    },
    iconGroup: {
        position: "absolute",
        flexDirection: "row",
        right: 4,
        top: 4,
        gap: 4,
    },
    iconBtn: {
        backgroundColor: "#fff",
        borderRadius: 999,
        padding: 2,
        elevation: 1,
    },
});
