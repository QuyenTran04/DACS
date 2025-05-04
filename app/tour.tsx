import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Stack, router } from "expo-router";

const TourListScreen = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://192.168.1.6:5000/api/tour/listTour")
      .then((response) => {
        setTours(response.data.tour);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách tour:", error);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/TourDetailScreen",
          params: { tourId: item._id },
        })
      }
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text numberOfLines={2} style={styles.description}>
        {item.description}
      </Text>
      <Text style={styles.price}>Giá: {item.price.toLocaleString()} VND</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách Tour</Text>
      <FlatList
        data={tours}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  list: { padding: 10 },
  card: {
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 3,
  },
  image: {
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  description: { color: "#555" },
  price: { color: "#d35400", marginTop: 5, fontWeight: "bold" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default TourListScreen;
