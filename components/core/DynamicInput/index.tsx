import { FormInputType } from "@/types/formInput";
import { Picker } from "@react-native-picker/picker";
import { TextInput, View } from "react-native";

export interface DynamicInputProps {
    fieldType: FormInputType;
    value?: any;
    onChange?: (value: any) => void;
    placeholder?: string;
    options?: { label: string; value: string }[];
    name?: string;
    [x: string]: any;
}   

const DynamicInput = ({
    fieldType,
    value,
    onChange = () => {},
    placeholder,
    options = [],
    name = "",
    ...props
}: DynamicInputProps) => {
    switch (fieldType) {
        case FormInputType.TEXT:
        case FormInputType.NUMBER:
        case FormInputType.DATE:
            return (
                <TextInput
                    {...props}
                    value={value}
                    placeholder={placeholder}
                    keyboardType={
                        fieldType === FormInputType.NUMBER
                            ? "numeric"
                            : "default"
                    }
                    onChangeText={onChange}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 10,
                        borderRadius: 6,
                        marginVertical: 5,
                    }}
                />
            );

        case FormInputType.SELECT:
            return (
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        borderRadius: 6,
                        marginVertical: 5,
                    }}
                >
                    <Picker
                        selectedValue={value}
                        onValueChange={(val: any) => onChange(val)}
                        style={{ padding: 10 }}
                    >
                        {options.map((option) => (
                            <Picker.Item
                                key={option.value}
                                label={option.label}
                                value={option.value}
                            />
                        ))}
                    </Picker>
                </View>
            );
        case FormInputType.PASSWORD:
            return (
                <TextInput
                    {...props}
                    value={value}
                    placeholder={placeholder}
                    onChangeText={onChange}
                    secureTextEntry={true}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 10,
                        borderRadius: 6,
                        marginVertical: 5,
                    }}
                />
            );
        default:
            return (
                <TextInput
                    value={value}
                    placeholder={placeholder}
                    onChangeText={onChange}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ccc",
                        padding: 10,
                        borderRadius: 6,
                        marginVertical: 5,
                    }}
                />
            );
    }
};
export default DynamicInput;
