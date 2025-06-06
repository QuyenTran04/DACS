import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>Thanh toán thành công!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Quay lại trang chủ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F4EA",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
    maxWidth: 350,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 32,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#388E3C",
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 30,
    width: "100%",
    maxWidth: 280,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
