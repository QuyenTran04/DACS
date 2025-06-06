import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const { width } = Dimensions.get("window");
const PRIMARY = "#8b5cf6";
const SECONDARY = "#f39c12";

const TourDetailScreen = () => {
  const { tourId } = useLocalSearchParams();
  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        const res = await axios.get(
          `http://172.20.10.3:5000/api/tour/getTour/${tourId}`
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={styles.loadingText}>Đang tải thông tin tour...</Text>
      </View>
    );
  }
  if (!tour) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Không tìm thấy thông tin tour.</Text>
      </View>
    );
  }

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
      }, 500);
    }
  };

  // Helper để format price đẹp hơn
  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + " đ";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Ảnh to, dạng horizontal carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        >
          {tour.images?.length > 0 ? (
            tour.images.map((img: any, index: number) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={{ uri: `data:${img.contentType};base64,${img.data}` }}
                  style={styles.image}
                />
                {/* Giá overlay ngay góc phải */}
                {index === 0 && (
                  <View style={styles.priceOverlay}>
                    <Ionicons name="pricetag" size={15} color="#fff" />
                    <Text style={styles.priceOverlayText}>
                      {formatPrice(tour.price)}
                    </Text>
                  </View>
                )}
                {/* Tag danh mục */}
                {index === 0 && (
                  <View style={styles.categoryTag}>
                    <Ionicons
                      name="compass"
                      size={14}
                      color="#fff"
                      style={{ marginRight: 5 }}
                    />
                    <Text style={styles.tagText}>
                      {tour.category || "Tour"}
                    </Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: "https://via.placeholder.com/350x220" }}
                style={styles.image}
              />
            </View>
          )}
        </ScrollView>

        {/* Tiêu đề và vị trí */}
        <Text style={styles.title}>{tour.title}</Text>
        <View style={styles.row}>
          <Ionicons name="location-outline" size={18} color={PRIMARY} />
          <Text style={styles.locationText}>
            {tour.location?.name || "Không có thông tin"}
          </Text>
        </View>

        {/* Địa chỉ */}
        <View style={styles.infoSection}>
          <Ionicons name="navigate-circle" size={20} color="#a3a3a3" />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.label}>Địa chỉ:</Text>
            <Text style={styles.text}>{tour.address}</Text>
          </View>
        </View>

        {/* Giá, thời gian, max guest */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Ionicons name="pricetag" size={20} color={SECONDARY} />
            <Text style={styles.statLabel}>Giá</Text>
            <Text style={styles.statValue}>{formatPrice(tour.price)}</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="time-outline" size={20} color={PRIMARY} />
            <Text style={styles.statLabel}>Thời gian</Text>
            <Text style={styles.statValue}>{tour.duration} giờ</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="people-outline" size={20} color={PRIMARY} />
            <Text style={styles.statLabel}>Tối đa</Text>
            <Text style={styles.statValue}>{tour.maxGuests} khách</Text>
          </View>
        </View>

        {/* Mô tả */}
        <Text style={styles.sectionTitle}>Mô tả tour</Text>
        <Text style={styles.text}>{tour.description}</Text>

        {/* Lịch trình */}
        <Text style={styles.sectionTitle}>Lịch trình</Text>
        <View style={styles.itineraryContainer}>
          {tour.itinerary?.map((item: any, index: number) => (
            <View key={index} style={styles.itineraryItem}>
              <View style={styles.timelineDot} />
              <View style={styles.itineraryContent}>
                <Text style={styles.itineraryTime}>{item.time}</Text>
                <Text style={styles.itineraryActivity}>{item.activity}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Ngày khả dụng */}
        <Text style={styles.sectionTitle}>Chọn ngày tham gia</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.datesContainer}
        >
          {tour.availableDates?.map((date: string, index: number) => {
            const d = new Date(date);
            const formatted = d.toLocaleDateString("vi-VN", {
              weekday: "short",
              day: "2-digit",
              month: "2-digit",
            });
            const isSelected = selectedDate === date;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dateItem, isSelected && styles.dateItemSelected]}
                onPress={() => setSelectedDate(date)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="calendar"
                  size={15}
                  color={isSelected ? "#fff" : PRIMARY}
                />
                <Text
                  style={[
                    styles.dateText,
                    isSelected && styles.dateTextSelected,
                  ]}
                >
                  {formatted}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Button đặt tour nổi ở dưới cùng */}
      <View style={styles.bookButtonWrapper}>
        <TouchableOpacity
          style={[styles.bookButton, bookingLoading && { opacity: 0.7 }]}
          onPress={handleBooking}
          disabled={bookingLoading}
          activeOpacity={0.88}
        >
          {bookingLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons
                name="cart"
                size={19}
                color="#fff"
                style={{ marginRight: 5 }}
              />
              <Text style={styles.bookButtonText}>Đặt tour ngay</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default TourDetailScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: PRIMARY,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
  },
  carousel: {
    marginTop: 0,
    marginBottom: 15,
    backgroundColor: "#f8f6fd",
  },
  imageContainer: {
    width: width - 40,
    height: 220,
    borderRadius: 18,
    overflow: "hidden",
    marginHorizontal: 10,
    marginBottom: 0,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  priceOverlay: {
    position: "absolute",
    right: 14,
    bottom: 16,
    backgroundColor: SECONDARY,
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#f39c12",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 7,
  },
  priceOverlayText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 6,
    letterSpacing: 0.1,
  },
  categoryTag: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: PRIMARY,
    borderRadius: 13,
    paddingVertical: 3,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  tagText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#22223b",
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 0,
  },
  locationText: {
    marginLeft: 7,
    fontSize: 16,
    color: PRIMARY,
    fontWeight: "600",
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#f5f5fa",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 8,
    padding: 13,
  },
  label: {
    fontWeight: "700",
    fontSize: 15,
    color: "#444",
    marginBottom: 2,
  },
  text: {
    fontSize: 15,
    color: "#555",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 2,
  },
  statBox: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#f3f0fd",
    padding: 14,
    borderRadius: 13,
    marginHorizontal: 5,
    minWidth: 90,
  },
  statLabel: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
    marginTop: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: PRIMARY,
    marginTop: 17,
    marginBottom: 7,
    marginHorizontal: 20,
    letterSpacing: 0.1,
  },
  itineraryContainer: {
    marginHorizontal: 10,
    marginBottom: 8,
  },
  itineraryItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 7,
    paddingHorizontal: 10,
  },
  timelineDot: {
    width: 10,
    height: 10,
    backgroundColor: PRIMARY,
    borderRadius: 5,
    marginTop: 6,
    marginRight: 12,
  },
  itineraryContent: {
    flex: 1,
  },
  itineraryTime: {
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 2,
    fontSize: 14,
  },
  itineraryActivity: {
    fontSize: 15,
    color: "#444",
    lineHeight: 20,
  },
  datesContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    flexDirection: "row",
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 11,
    backgroundColor: "#f3f0fd",
    marginRight: 10,
    marginBottom: 3,
  },
  dateItemSelected: {
    backgroundColor: PRIMARY,
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 15,
    color: PRIMARY,
    fontWeight: "600",
  },
  dateTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  bookButtonWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingHorizontal: 22,
    paddingVertical: 15,
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 7,
    elevation: 8,
  },
  bookButton: {
    flexDirection: "row",
    backgroundColor: PRIMARY,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: PRIMARY,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
    marginLeft: 3,
  },
});
