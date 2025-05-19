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
          `http://192.168.1.8:5000/api/tour/getTour/${tourId}`
        );
        const priceFromServer = Number(response.data.tour?.price);
        if (!isNaN(priceFromServer)) {
          setTourPrice(priceFromServer);
        } else {
          throw new Error("Giá tour không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin tour:", error);
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
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập đầy đủ họ tên, số điện thoại và email."
      );
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
        "http://192.168.1.8:5000/api/booking",
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
        // Nếu là Momo, mở URL thanh toán
        Linking.openURL(response.data.payUrl);
        router.push("/mytrip");
      } else {
        Alert.alert("Thành công", "Bạn đã đặt tour thành công!");
      }
    } catch (err) {
      console.error("Lỗi đặt tour:", err);
      Alert.alert(
        "Lỗi",
        `Không thể đặt tour. Lỗi: ${
          err.response?.data?.message || "Vui lòng thử lại."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const increaseGuests = () => setNumberOfGuests(numberOfGuests + 1);
  const decreaseGuests = () =>
    setNumberOfGuests(Math.max(1, numberOfGuests - 1));

  const totalPrice = isNaN(tourPrice) ? 0 : tourPrice * numberOfGuests;
  const totalPoints = POINT_PER_GUEST * numberOfGuests;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title}>Vé tham quan</Text>

        <Text style={styles.label}>Ngày sử dụng:</Text>
        <Text style={styles.value}>{selectedDate}</Text>

        <Text style={styles.label}>Số lượng khách:</Text>
        <View style={styles.counterRow}>
          <TouchableOpacity style={styles.counterBtn} onPress={decreaseGuests}>
            <Text style={styles.counterText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{numberOfGuests}</Text>
          <TouchableOpacity style={styles.counterBtn} onPress={increaseGuests}>
            <Text style={styles.counterText}>+</Text>
          </TouchableOpacity>
        </View>

        {tourDetailsLoading ? (
          <Text style={styles.value}>Đang tải thông tin tour...</Text>
        ) : (
          <View style={styles.priceRow}>
            <Text style={styles.priceText}>
              {totalPrice.toLocaleString()} VND
            </Text>
            <Text style={styles.pointsText}>🎁 Nhận {totalPoints} Xu</Text>
          </View>
        )}

        <Text style={styles.label}>Họ tên người đặt:</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nhập họ tên"
        />

        <Text style={styles.label}>Số điện thoại:</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email liên hệ:</Text>
        <TextInput
          style={styles.input}
          value={contactEmail}
          onChangeText={setContactEmail}
          placeholder="Nhập email"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Ghi chú:</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={note}
          onChangeText={setNote}
          placeholder="Ví dụ: muốn đón ở khách sạn..."
        />

        <Text style={styles.label}>Phương thức thanh toán:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={setPaymentMethod}
          >
            <Picker.Item label="Tiền mặt" value="cash" />
            <Picker.Item label="Momo" value="momo" />
          </Picker>
        </View>

        <Text style={styles.notice}>
          🔒 Không thể hoàn tiền • Không thể đổi lịch
        </Text>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Tổng giá</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    marginHorizontal: 20,
    color: "#333",
  },
  label: {
    marginTop: 20,
    marginHorizontal: 20,
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    marginTop: 8,
    marginHorizontal: 20,
    fontSize: 16,
    color: "#000",
  },
  input: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
  },
  pickerContainer: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  counterRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  counterBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  counterText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#555",
  },
  quantity: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  priceRow: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f97316",
  },
  pointsText: {
    marginTop: 4,
    color: "#999",
    fontSize: 14,
  },
  notice: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    color: "#999",
    fontSize: 14,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f97316",
  },
  bookButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
