import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function StatusToggleBadge({ value, onChange }: { value: boolean; onChange: (val: boolean) => void }) {
  return (
    <TouchableOpacity
      style={[
        styles.status,
        { backgroundColor: value ? "#4caf50" : "#f44336" },
      ]}
      onPress={() => onChange(!value)}
    >
      <Text style={styles.statusText}>
        {value ? "Đang bán" : "Ngừng bán"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  status: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  statusText: { color: "#fff", fontWeight: "600" },
});
