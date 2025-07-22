import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface SkuImagesUploadProps {
    images?: string[];
    onChange: (updatedImages: string[]) => void;
}

export default function SkuImagesUpload({
    images = [],
    onChange,
}: SkuImagesUploadProps) {
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert(
                "Permission required",
                "Please allow access to your media library"
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
            allowsMultipleSelection: true,
        });

        if (!result.canceled) {
            const newImages = result.assets.map((asset) => asset.uri);
            onChange([...images, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Hình ảnh</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((uri, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Image source={{ uri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => removeImage(index)}
                        >
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color="red"
                            />
                        </TouchableOpacity>
                    </View>
                ))}
                <TouchableOpacity onPress={pickImage} style={styles.addButton}>
                    <Ionicons name="camera" size={24} color="#555" />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },
    label: {
        fontWeight: "600",
        marginBottom: 8,
    },
    imageContainer: {
        position: "relative",
        marginRight: 12,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeButton: {
        position: "absolute",
        top: -8,
        right: -8,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    addButton: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
});
