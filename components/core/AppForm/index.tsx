import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import DynamicInput from "../DynamicInput";

type AppFormType = {
    items: any;
    onSubmit: (e: any) => void;
    cols?: number;
    btnText?: string;
};

const AppForm = ({ items, onSubmit, btnText = "Submit" }: AppFormType) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    return (
        <View style={styles.form}>
            {items.map((item: any) => (
                <Controller
                    key={item.name}
                    name={item.name}
                    control={control}
                    rules={item.rules || {}}
                    defaultValue={item.defaultValue || ""}
                    render={({ field }) => (
                        <View style={styles.fieldWrapper}>
                            <DynamicInput
                                fieldType={item.fieldType}
                                placeholder={item.placeholder}
                                options={item.options}
                                value={field.value}
                                onChange={field.onChange}
                            />
                            {!!errors[item.name] && (
                                <Text style={styles.errorText}>
                                    This field is required
                                </Text>
                            )}
                        </View>
                    )}
                />
            ))}

            <TouchableOpacity
                onPress={handleSubmit((data) => {
                    onSubmit(data);
                })}
                style={styles.button}
            >
                <Text style={styles.buttonText}>{btnText}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    form: {
        padding: 16,
    },
    fieldWrapper: {
        marginBottom: 16,
    },
    errorText: {
        color: "#ff4d4f",
        fontSize: 12,
        marginTop: 4,
    },
    button: {
        backgroundColor: "#2563eb",
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default AppForm;
