import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { getAuth } from "firebase/auth";

// ✅ Type cho mỗi booking
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) throw new Error("Người dùng chưa đăng nhập");

        const idToken = await user.getIdToken();

        const res = await axios.get(
          "http://192.168.3.21:5000/api/booking/History",
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        setBookings(res.data.bookings);
      } catch (err) {
        console.error("Lỗi khi lấy lịch sử booking", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ✅ Mapping trạng thái tiếng Việt sang styles
  const getStatusStyle = (status: Booking["status"]) => {
    switch (status) {
      case "Thành công":
        return styles.confirmed;
      case "Đã hủy":
        return styles.cancelled;
      case "Không thành công":
      default:
        return styles.pending;
    }
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <View style={styles.bookingCard}>
      <Text style={styles.tourTitle}>{item.tourId.title}</Text>
      <Text>
        Ngày khởi hành: {new Date(item.selectedDate).toLocaleDateString()}
      </Text>
      <Text>Ngày đặt: {new Date(item.bookingDate).toLocaleDateString()}</Text>
      <Text>Số khách: {item.numberOfGuests}</Text>
      <Text>Tổng tiền: {item.totalPrice.toLocaleString()} VND</Text>
      <Text>
        Thanh toán: {item.payment.status.toUpperCase()} ({item.payment.method})
      </Text>
      <Text style={[styles.status, getStatusStyle(item.status)]}>
        Trạng thái: {item.status}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải lịch sử đặt tour...</Text>
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
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

export default BookingHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  bookingCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  tourTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  status: {
    marginTop: 4,
    fontWeight: "600",
  },
  pending: {
    color: "#FFA500",
  },
  confirmed: {
    color: "#28A745",
  },
  cancelled: {
    color: "#DC3545",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
