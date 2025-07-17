import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CheckboxBadge({ title, checked, onCheckedChange }: { title: string; checked: boolean; onCheckedChange: (val: boolean) => void }) {
  return (
    <TouchableOpacity
      onPress={() => onCheckedChange(!checked)}
      style={[
        styles.badge,
        { backgroundColor: checked ? "#9333ea" : "#f3e8ff" },
      ]}
    >
      <Text style={{ color: checked ? "#fff" : "#6b21a8" }}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
});
