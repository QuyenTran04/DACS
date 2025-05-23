import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  StyleSheet
} from "react-native";
import React, { useContext } from "react";
import { useRouter } from "expo-router";
import { CreateTripContext } from "@/context/CreateTripContext";

const locations = [
  {
    name: "Hà Nội",
    coordinate: { lat: 21.0285, lng: 105.8542 },
    photoRef: "/assets/images/hanoi.jpg",
  },
  {
    name: "Đà Nẵng",
    coordinate: { lat: 16.0544, lng: 108.2022 },
    photoRef: "/assets/images/hanoi.jpg",
  },
  {
    name: "TP.HCM",
    coordinate: { lat: 10.7769, lng: 106.7009 },
    photoRef: "/assets/images/hanoi.jpg",
  },
  {
    name: "Nha Trang",
    coordinate: { lat: 12.2388, lng: 109.1967 },
    photoRef: "/assets/images/hanoi.jpg",
  },
];

const SearchPlace = () => {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);

  // Hàm xử lý khi chọn địa điểm
  const handleSelectPlace = (location: {
    name: any;
    coordinate: any;
    photoRef: any;
  }) => {
    setTripData((prev) => {
      const newData = prev.filter((item) => !item.locationInfo);
      return [
        ...newData,
        {
          locationInfo: {
            name: location.name,
            coordinates: location.coordinate,
            photoRef: location.photoRef,
          },
        },
      ];
    });
    router.push("/create-trip/select-traveler");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Bạn muốn đi đâu ?</Text>
          <Text style={styles.subtitle}>Định vị nơi đến của bạn ngay</Text>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={locations}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelectPlace(item)}
                style={styles.locationItem}
              >
                <Text style={styles.locationText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: "Outfit-Bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#B0B0B0", // Gray color for subtitle
    fontFamily: "Outfit",
  },
  listContainer: {
    padding: 16,
    marginTop: 20,
    flex: 1,
  },
  locationItem: {
    backgroundColor: "#e2e2e2",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 16,
    fontFamily: "Outfit",
  },
});

export default SearchPlace;
