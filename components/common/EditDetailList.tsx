import { X } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
    label: string;
    values: string[];
    onChange?: (updatedList: string[]) => void;
}

export default function EditDetailList({ label, values, onChange }: Props) {
    const [input, setInput] = useState("");
    const inputRef = useRef<TextInput>(null);

    const handleAdd = () => {
        const trimmed = input.trim();
        if (trimmed && !values.includes(trimmed)) {
            onChange?.([...values, trimmed]);
        }
        setInput("");
        inputRef.current?.focus();
    };

    const handleRemove = (item: string) => {
        onChange?.(values.filter((v) => v !== item));
    };

    return (
        <View style={{ marginTop: 16 }}>
            <Text style={styles.label}>{label}</Text>
            <ScrollView
                horizontal
                contentContainerStyle={styles.badgeContainer}
                showsHorizontalScrollIndicator={false}
            >
                {values.map((item) => (
                    <View key={item} style={styles.badge}>
                        <Text style={styles.badgeText}>{item}</Text>
                        <TouchableOpacity onPress={() => handleRemove(item)}>
                            <X size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputGroup}>
                <TextInput
                    ref={inputRef}
                    placeholder="Nhập và nhấn Thêm"
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={handleAdd}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                    <Text style={styles.addButtonText}>Thêm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontWeight: "600",
        marginBottom: 6,
    },
    badgeContainer: {
        flexDirection: "row",
        flexWrap: "nowrap",
        gap: 6,
        marginBottom: 10,
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#9333ea",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    badgeText: {
        color: "#fff",
        marginRight: 4,
    },
    inputGroup: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: "#fff",
    },
    addButton: {
        backgroundColor: "#e11d48",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
