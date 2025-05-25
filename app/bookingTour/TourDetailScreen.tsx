import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const TourDetailScreen = () => {
  const { tourId } = useLocalSearchParams(); // Lấy tourId từ query params
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const router = useRouter();

  // Lấy thông tin tour
  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        const res = await axios.get(
          `http://192.168.3.21:5000/api/tour/getTour/${tourId}`
        );
        setTour(res.data.tour);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin tour:", err);
      } finally {
        setLoading(false);
      }
    };

    if (tourId) fetchTourDetail();
  }, [tourId]);

  // Nếu đang tải, hiển thị loading
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Đang tải thông tin tour...</Text>
      </View>
    );
  }

  // Nếu không tìm thấy tour
  if (!tour) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Không tìm thấy thông tin tour.</Text>
      </View>
    );
  }

  // Xử lý khi người dùng nhấn "Đặt tour"
  const handleBooking = () => {
    if (!selectedDate) {
      alert("Vui lòng chọn ngày trước khi đặt tour.");
    } else {
      setBookingLoading(true);
      setTimeout(() => {
        const query = new URLSearchParams({
          tourId: tourId as string,
          selectedDate: selectedDate,
        }).toString();
        router.push(`/bookingTour/booking?${query}`);
        setBookingLoading(false);
      }, 500); // Giả lập delay loading 0.5s
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tour.images?.map((img: any, index: number) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: `data:${img.contentType};base64,${img.data}` }}
              style={styles.image}
            />
          </View>
        ))}
      </ScrollView>

      <Text style={styles.title}>{tour.title}</Text>

      <View style={styles.row}>
        <Ionicons name="location-outline" size={18} color="#8b5cf6" />
        <Text style={styles.locationText}>
          {tour.location?.name || "Không có thông tin"}
        </Text>
      </View>

      <Text style={styles.label}>Địa chỉ:</Text>
      <Text style={styles.text}>{tour.address}</Text>

      <Text style={styles.label}>Giá:</Text>
      <Text style={styles.price}>{tour.price.toLocaleString()} VND</Text>

      <Text style={styles.label}>Thời gian tour:</Text>
      <Text style={styles.text}>{tour.duration} giờ</Text>

      <Text style={styles.label}>Số khách tối đa:</Text>
      <Text style={styles.text}>{tour.maxGuests}</Text>

      <Text style={styles.sectionTitle}>Mô tả</Text>
      <Text style={styles.text}>{tour.description}</Text>

      <Text style={styles.sectionTitle}>Lịch trình</Text>
      {tour.itinerary?.map((item: any, index: number) => (
        <View key={index} style={styles.itineraryItem}>
          <Text style={styles.itineraryTime}>{item.time}</Text>
          <Text style={styles.itineraryActivity}>{item.activity}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Ngày khả dụng</Text>
      <View style={styles.datesContainer}>
        {tour.availableDates?.map((date: string, index: number) => {
          const d = new Date(date);
          const formatted = d.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });

          const isSelected = selectedDate === date;

          return (
            <TouchableOpacity
              key={index}
              style={[styles.dateItem, isSelected && styles.dateItemSelected]}
              onPress={() => setSelectedDate(date)}
            >
              <Ionicons
                name="calendar-outline"
                size={16}
                color={isSelected ? "#fff" : "#555"}
              />
              <Text
                style={[styles.dateText, isSelected && styles.dateTextSelected]}
              >
                {formatted}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.bookButton, bookingLoading && { opacity: 0.7 }]}
        onPress={handleBooking}
        disabled={bookingLoading}
      >
        {bookingLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.bookButtonText}>Đặt tour ngay</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TourDetailScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#8b5cf6",
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
  },
  imageContainer: {
    width: 300,
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 16,
    color: "#555",
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#444",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e67e22",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8b5cf6",
    marginTop: 16,
    marginBottom: 6,
  },
  itineraryItem: {
    flexDirection: "row",
    marginBottom: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  itineraryTime: {
    fontWeight: "600",
    marginRight: 10,
    width: 80,
    color: "#8b5cf6",
  },
  itineraryActivity: {
    flex: 1,
  },
  bookButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#8b5cf6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  datesContainer: {
    marginTop: 6,
    paddingLeft: 4,
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  dateItemSelected: {
    backgroundColor: "#8b5cf6",
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#555",
  },
  dateTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
});
