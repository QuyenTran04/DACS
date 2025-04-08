import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Dữ liệu mẫu
const popularDestinations = [
  {
    id: "1",
    name: "Đà Nẵng",
    image: require("../assets/images/danang.jpg"),
    price: "2.500.000 VND",
  },
  {
    id: "2",
    name: "Nha Trang",
    image: require("../assets/images/nhatrang.jpg"),
    price: "3.200.000 VND",
  },
  {
    id: "3",
    name: "Phú Quốc",
    image: require("../assets/images/phuquoc.jpg"),
    price: "4.500.000 VND",
  },
];

const recommendedTours = [
  {
    id: "1",
    title: "Tour Sài Gòn - Đà Lạt",
    duration: "3 ngày 2 đêm",
    rating: 4.8,
  },
  {
    id: "2",
    title: "Khám phá miền Tây",
    duration: "2 ngày 1 đêm",
    rating: 4.5,
  },
];

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigation = useNavigation<any>(); // ép kiểu để tránh lỗi TS

  const handleSearch = () => {
    // Xử lý tìm kiếm
  };

  const renderDestinationItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.destinationCard}
      onPress={() => navigation.navigate("TourDetail", { destination: item })}
    >
      <Image source={item.image} style={styles.destinationImage} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      >
        <Text style={styles.destinationName}>{item.name}</Text>
        <Text style={styles.destinationPrice}>{item.price}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderTourItem = ({ item }: any) => (
    <TouchableOpacity style={styles.tourCard}>
      <View style={styles.tourInfo}>
        <Text style={styles.tourTitle}>{item.title}</Text>
        <Text style={styles.tourDuration}>{item.duration}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <FontAwesome name="heart-o" size={24} color="#FF5A5F" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Xin chào, Người dùng!</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Bạn muốn đi đâu?"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleSearch}
          >
            <Ionicons name="options" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: "#FF5A5F" }]}>
                <MaterialCommunityIcons name="beach" size={24} color="#FFF" />
              </View>
              <Text style={styles.categoryText}>Biển</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: "#4CAF50" }]}>
                <MaterialCommunityIcons name="fountain" size={24} color="#FFF" />
              </View>
              <Text style={styles.categoryText}>Núi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: "#2196F3" }]}>
                <MaterialCommunityIcons name="city" size={24} color="#FFF" />
              </View>
              <Text style={styles.categoryText}>Thành phố</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: "#9C27B0" }]}>
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={24}
                  color="#FFF"
                />
              </View>
              <Text style={styles.categoryText}>Ẩm thực</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Popular Destinations */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Điểm đến nổi bật</Text>
          <FlatList
            data={popularDestinations}
            renderItem={renderDestinationItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationList}
          />
        </View>

        {/* Recommended Tours */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tour đề xuất</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recommendedTours}
            renderItem={renderTourItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#333",
  },
  filterButton: {
    backgroundColor: "#FF5A5F",
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    color: "#FF5A5F",
    fontSize: 14,
  },
  destinationList: {
    paddingRight: 16,
  },
  destinationCard: {
    width: 200,
    height: 250,
    borderRadius: 12,
    marginRight: 16,
    overflow: "hidden",
    position: "relative",
  },
  destinationImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  destinationName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  destinationPrice: {
    color: "#FFF",
    fontSize: 14,
  },
  tourCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tourInfo: {
    flex: 1,
  },
  tourTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  tourDuration: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
});

export default HomeScreen;