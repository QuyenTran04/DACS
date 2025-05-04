import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

// Định nghĩa kiểu dữ liệu cho tour
interface Tour {
  _id: string;
  title: string;
  price: number;
  description: string;
  image?: string;
  duration?: string;
  location?: string;
  // thêm các field khác nếu cần
}

const TourDetailScreen = () => {
  const { tourId } = useLocalSearchParams<{ tourId: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    axios
      .get<{ tour: Tour }>(`http://192.168.1.6:5000/api/tour/getTour/${tourId}`)
      .then((response) => {
        console.log("Dữ liệu trả về:", response.data);
        setTour(response.data.tour);
        setLoading(false);
      })
      .catch(() => {
        console.error("Lỗi tải tour:", err.message);
        setError("Không thể tải thông tin tour.");
        setLoading(false);
      });
  }, [tourId]);

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  if (error || !tour) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={
          tour.image
            ? { uri: `http://192.168.1.6:5000${tour.image[0]}` }
            : require("../assets/images/react-logo.png")
        }
        style={styles.image}
      />
      <Text style={styles.title}>{tour.title}</Text>
      <Text style={styles.price}>Giá: {tour.price.toLocaleString()} VND</Text>
      <Text style={styles.description}>{tour.description}</Text>

      {tour.duration && <Text>🕒 Thời lượng: {tour.duration}</Text>}
      {tour.location && <Text>📍 Địa điểm: {tour.location}</Text>}

      <Button title="Đặt tour" onPress={() => alert("Tính năng đặt tour")} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    color: "#d35400",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default TourDetailScreen;
