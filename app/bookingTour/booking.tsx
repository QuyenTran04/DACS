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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const POINT_PER_GUEST = 960;
const PRIMARY = "#8b5cf6";
const SECONDARY = "#f59e42";

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
        if (!isNaN(priceFromServer)) setTourPrice(priceFromServer);
        else throw new Error("Giá tour không hợp lệ");
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
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );
      if (response.data.payUrl) {
        Linking.openURL(response.data.payUrl);
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fafbff" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>🛫 Đặt vé tham quan</Text>

        <Label
          icon={<Ionicons name="calendar" size={18} color={PRIMARY} />}
          label="Ngày sử dụng"
          value={selectedDate}
        />

        <Text style={styles.label}>Số lượng khách</Text>
        <View style={styles.counterRow}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={22} color={PRIMARY} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{numberOfGuests}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => setNumberOfGuests(numberOfGuests + 1)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={22} color={PRIMARY} />
          </TouchableOpacity>
        </View>

        {tourDetailsLoading ? (
          <View style={styles.priceBox}>
            <Text style={styles.value}>Đang tải giá...</Text>
          </View>
        ) : (
          <View style={styles.priceBox}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 3,
              }}
            >
              <MaterialCommunityIcons
                name="ticket-percent-outline"
                size={20}
                color={SECONDARY}
              />
              <Text style={styles.priceText}>
                {totalPrice.toLocaleString()} VND
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="gift" size={18} color={PRIMARY} />
              <Text style={styles.pointsText}>{totalPoints} điểm thưởng</Text>
            </View>
          </View>
        )}

        <Input
          label="Họ tên người đặt"
          value={fullName}
          onChange={setFullName}
          icon={<Ionicons name="person" size={18} color={PRIMARY} />}
        />
        <Input
          label="Số điện thoại"
          value={phoneNumber}
          onChange={setPhoneNumber}
          keyboardType="phone-pad"
          icon={<Ionicons name="call" size={18} color={PRIMARY} />}
        />
        <Input
          label="Email liên hệ"
          value={contactEmail}
          onChange={setContactEmail}
          keyboardType="email-address"
          icon={<Ionicons name="mail" size={18} color={PRIMARY} />}
        />
        <Input
          label="Ghi chú"
          value={note}
          onChange={setNote}
          multiline
          icon={<Ionicons name="document-text" size={18} color={PRIMARY} />}
        />

        <Text style={styles.label}>Phương thức thanh toán</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={paymentMethod}
            onValueChange={setPaymentMethod}
            style={{ color: PRIMARY, fontWeight: "700" }}
          >
            <Picker.Item label="💵 Tiền mặt tại quầy" value="cash" />
            <Picker.Item label="📱 Ví Momo (QR, thẻ...)" value="momo" />
          </Picker>
        </View>
      </ScrollView>

      {/* Thanh total + nút đặt nổi, đổ bóng */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>
            {totalPrice.toLocaleString()} VND
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.bookButton, loading && { opacity: 0.65 }]}
          onPress={handleBooking}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.bookButtonText}>
            {loading ? "Đang xử lý..." : "Đặt ngay"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default BookingScreen;

// Label có icon
const Label = ({ icon, label, value }) => (
  <View style={styles.labelRow}>
    {icon}
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

// Input đẹp có icon
const Input = ({
  label,
  value,
  onChange,
  multiline = false,
  keyboardType = "default",
  icon,
}) => (
  <View style={styles.inputWrapper}>
    <View style={styles.inputLabelRow}>
      {icon}
      <Text style={styles.label}>{label}</Text>
    </View>
    <TextInput
      style={[
        styles.input,
        multiline && { height: 80, textAlignVertical: "top" },
      ]}
      value={value}
      onChangeText={onChange}
      placeholder={`Nhập ${label.toLowerCase()}`}
      placeholderTextColor="#a5a5b3"
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

const styles = StyleSheet.create({
  scrollContent: { padding: 22, paddingBottom: 170 },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#23235b",
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  value: {
    marginLeft: 10,
    fontSize: 16,
    color: "#3b3d56",
    fontWeight: "600",
  },
  inputWrapper: { marginTop: 17 },
  inputLabelRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  input: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: "#e7e6f5",
    padding: 14,
    fontSize: 16,
    color: "#23235b",
    shadowColor: "#e7e6f5",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  pickerContainer: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1.4,
    borderColor: "#e7e6f5",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  counterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 25,
    marginTop: 12,
    marginBottom: 0,
  },
  counterBtn: {
    width: 48,
    height: 48,
    borderRadius: 100,
    backgroundColor: "#f5f5fa",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#bcbcf2",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  quantity: {
    fontSize: 22,
    fontWeight: "800",
    color: "#3b3d56",
    minWidth: 38,
    textAlign: "center",
  },
  priceBox: {
    marginTop: 18,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    borderColor: "#e7e6f5",
    borderWidth: 1.3,
    shadowColor: "#e7e6f5",
    shadowOpacity: 0.11,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 9,
    marginBottom: 8,
  },
  priceText: {
    fontSize: 19,
    fontWeight: "bold",
    color: SECONDARY,
    marginLeft: 7,
  },
  pointsText: {
    marginLeft: 8,
    fontSize: 15,
    color: PRIMARY,
    fontWeight: "700",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1.5,
    borderColor: "#f2eaff",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#a7a1ff",
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 11,
    elevation: 14,
    zIndex: 99,
  },
  totalLabel: {
    fontSize: 15,
    color: "#878bad",
    fontWeight: "600",
  },
  totalPrice: {
    fontSize: 21,
    fontWeight: "bold",
    color: SECONDARY,
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: PRIMARY,
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  bookButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
});
