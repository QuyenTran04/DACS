import { useEffect } from "react";
import { Alert, View, Text, ActivityIndicator, Linking } from "react-native";
import { useRouter } from "expo-router";

export default function MomoRedirectScreen() {
  const router = useRouter();

  const handleDeepLink = (url: string | null) => {
    if (!url) {
      setTimeout(() => {
        Alert.alert("Thanh toán thành công");
        router.replace("/"); // Quay về trang chủ, hoặc trang chọn tour tuỳ flow bạn
      }, 1000);
      return;
    }

    const params = new URLSearchParams(url.split("?")[1]);
    const resultCode = params.get("resultCode");
    const message = params.get("message");
    const orderId = params.get("orderId");

    console.log("🎯 Params từ MoMo:", { resultCode, message, orderId });

    if (!resultCode) {
      setTimeout(() => {
        Alert.alert("✅ Thành công");
        router.replace("/");
      }, 800);
      return;
    }

    setTimeout(() => {
      if (resultCode === "0") {
        Alert.alert("✅ Thành công", `Đơn hàng ${orderId} đã được thanh toán.`);
        router.replace("/bookingTour/success");
      } else {
        Alert.alert(
          "❌ Thất bại",
          decodeURIComponent(message || "Thanh toán thất bại!")
        );
        router.replace("/"); // hoặc trang /bookingTour/failure nếu có
      }
    }, 350);
  };

  useEffect(() => {
    // 1. Nếu app khởi động từ deep link
    Linking.getInitialURL().then((url) => {
      console.log("Initial URL:", url);
      handleDeepLink(url);
    });

    // 2. Nếu app đang chạy rồi mới nhận deep link
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("🔁 Deep link received while app is running:", url);
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <ActivityIndicator size="large" color="#a50064" />
      <Text
        style={{
          marginTop: 18,
          fontSize: 16,
          color: "#a50064",
          fontWeight: "600",
        }}
      >
        Đang xử lý kết quả thanh toán MoMo...
      </Text>
    </View>
  );
}
