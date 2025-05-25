import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

type Booking = {
  _id: string;
  selectedDate: string;
  bookingDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: "Không thành công" | "Thành công" | "Đã hủy";
  payment: {
    method: string;
    status: "Chưa thanh toán" | "Thành công" | "Thất bại";
  };
  tourId: {
    _id: string;
    title: string;
    price: number;
    image: string;
  };
};

const BookingHistoryScreen = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error("Người dùng chưa đăng nhập");
        const token = await user.getIdToken();

        const res = await axios.get(
          "http://192.168.3.21:5000/api/booking/History",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setBookings(res.data.bookings);
      } catch (err) {
        console.error("Lỗi lấy lịch sử booking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "Thành công":
        return "#28a745";
      case "Đã hủy":
        return "#dc3545";
      default:
        return "#f0ad4e";
    }
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.tourTitle}>{item.tourId.title}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#555" />
          <Text style={styles.infoText}>
            Ngày khởi hành: {new Date(item.selectedDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <FontAwesome5 name="clock" size={14} color="#555" />
          <Text style={styles.infoText}>
            Đặt ngày: {new Date(item.bookingDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={16} color="#555" />
          <Text style={styles.infoText}>Số khách: {item.numberOfGuests}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={16} color="#555" />
          <Text style={styles.infoText}>
            Tổng tiền: {item.totalPrice.toLocaleString()} VND
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="card-outline" size={16} color="#555" />
          <Text style={styles.infoText}>
            Thanh toán: {item.payment.status} ({item.payment.method})
          </Text>
        </View>

        <View style={styles.statusWrapper}>
          <Ionicons
            name={
              item.status === "Thành công"
                ? "checkmark-circle-outline"
                : item.status === "Đã hủy"
                ? "close-circle-outline"
                : "alert-circle-outline"
            }
            size={18}
            color={getStatusColor(item.status)}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            Trạng thái: {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={{ marginTop: 10 }}>Đang tải lịch sử đặt tour...</Text>
      </SafeAreaView>
    );
  }

  if (bookings.length === 0) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Chưa có lịch sử đặt tour nào.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Lịch sử đặt tour</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default BookingHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: "#1f2937",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  tourImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  tourTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#374151",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
  },
  statusWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  statusText: {
    fontWeight: "600",
    fontSize: 14,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
