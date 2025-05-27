// BookingScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  Linking,
} from "react-native";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";

const POINT_PER_GUEST = 960;

const BookingScreen = () => {
  const { tourId, selectedDate } = useLocalSearchParams();
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [tourPrice, setTourPrice] = useState(0);
  const [tourDetailsLoading, setTourDetailsLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await axios.get(
          `http://192.168.3.21:5000/api/tour/getTour/${tourId}`
        );
        const priceFromServer = Number(response.data.tour?.price);
        if (!isNaN(priceFromServer)) {
          setTourPrice(priceFromServer);
        } else {
          throw new Error("Giá tour không hợp lệ");
        }
      } catch (error) {
        Alert.alert(
          "Lỗi",
          "Không thể lấy thông tin tour hoặc giá không hợp lệ."
        );
        setTourPrice(0);
      } finally {
        setTourDetailsLoading(false);
      }
    };
    fetchTourDetails();
  }, [tourId]);

  const handleBooking = async () => {
    if (!selectedDate || !tourId) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn tour và ngày hợp lệ.");
      return;
    }
    if (numberOfGuests <= 0) {
      Alert.alert("Lỗi", "Số lượng khách phải lớn hơn 0.");
      return;
    }
    if (!fullName || !phoneNumber || !contactEmail) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      setLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập trước khi đặt tour.");
        return;
      }

      const idToken = await user.getIdToken();
      const response = await axios.post(
        "http://192.168.3.21:5000/api/booking",
        {
          tourId,
          selectedDate,
          numberOfGuests,
          note,
          paymentMethod,
          fullName,
          phoneNumber,
          email: contactEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (response.data.payUrl) {
        Linking.openURL(response.data.payUrl);
        router.push("/mytrip");
      } else {
        Alert.alert("Thành công", "Bạn đã đặt tour thành công!");
      }
    } catch (err) {
      Alert.alert("Lỗi", err.response?.data?.message || "Đặt tour thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = isNaN(tourPrice) ? 0 : tourPrice * numberOfGuests;
  const totalPoints = POINT_PER_GUEST * numberOfGuests;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>🛫 Đặt vé tham quan</Text>

        <Label label="Ngày sử dụng" value={selectedDate} />

        <Text style={styles.label}>Số lượng khách</Text>
        <View style={styles.counterRow}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
          >
            <Text style={styles.counterText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{numberOfGuests}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => setNumberOfGuests(numberOfGuests + 1)}
          >
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>

        {tourDetailsLoading ? (
          <Text style={styles.value}>Đang tải giá...</Text>
        ) : (
          <View style={styles.priceBox}>
            <Text style={styles.priceText}>
              {totalPrice.toLocaleString()} VND
            </Text>
            <Text style={styles.pointsText}>🎁 {totalPoints} điểm thưởng</Text>
          </View>
        )}

        <Input
          label="Họ tên người đặt"
          value={fullName}
          onChange={setFullName}
        />
        <Input
          label="Số điện thoại"
          value={phoneNumber}
          onChange={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <Input
          label="Email liên hệ"
          value={contactEmail}
          onChange={setContactEmail}
          keyboardType="email-address"
        />
        <Input label="Ghi chú" value={note} onChange={setNote} multiline />

        <Text style={styles.label}>Phương thức thanh toán</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={setPaymentMethod}
          >
            <Picker.Item label="💵 Tiền mặt" value="cash" />
            <Picker.Item label="📱 Ví Momo" value="momo" />
          </Picker>
        </View>

      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>
            {totalPrice.toLocaleString()} VND
          </Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking}
          disabled={loading}
        >
          <Text style={styles.bookButtonText}>
            {loading ? "Đang xử lý..." : "Đặt ngay"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingScreen;

// ⬇️ Các thành phần phụ
const Label = ({ label, value }: { label: string; value: string }) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </>
);

const Input = ({
  label,
  value,
  onChange,
  multiline = false,
  keyboardType = "default",
}) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[
        styles.input,
        multiline && { height: 80, textAlignVertical: "top" },
      ]}
      value={value}
      onChangeText={onChange}
      placeholder={`Nhập ${label.toLowerCase()}`}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </>
);

// ⬇️ Style hiện đại hơn
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  scrollContent: { padding: 20, paddingBottom: 140 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
  },
  label: { marginTop: 20, fontSize: 16, fontWeight: "600", color: "#374151" },
  value: { marginTop: 8, fontSize: 16, color: "#111827" },
  input: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
  },
  pickerContainer: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    marginTop: 10,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#374151",
  },
  quantity: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  priceBox: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderColor: "#e5e7eb",
    borderWidth: 1,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f97316",
  },
  pointsText: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  notice: {
    marginTop: 30,
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f97316",
  },
  bookButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
