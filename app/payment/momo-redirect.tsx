import { useEffect } from "react";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Alert, View, Text } from "react-native";

export default function MomoRedirectScreen() {
  const router = useRouter();
  const { resultCode, message } = useGlobalSearchParams();

  useEffect(() => {
    if (!resultCode) return;

    const timeout = setTimeout(() => {
      if (resultCode === "0") {
        Alert.alert("✅ Thành công", decodeURIComponent(String(message || "")));
        router.replace("/bookingTour/success");
      } else {
        Alert.alert("❌ Thất bại", decodeURIComponent(String(message || "")));
        //router.replace("/bookingTour/failure");
      }
    }, 100); // Delay 100ms để đảm bảo layout đã mount

    return () => clearTimeout(timeout);
  }, [resultCode]);

  return (
    <View>
      <Text>Đang xử lý kết quả thanh toán...</Text>
    </View>
  );
}
