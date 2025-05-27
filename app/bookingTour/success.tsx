// app/bookingTour/success.tsx

import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20 }}>🎉 Thanh toán thành công!</Text>
      <Button title="Quay lại trang chủ" onPress={() => router.push("/")} />
    </View>
  );
}
