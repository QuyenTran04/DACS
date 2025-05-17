import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryButtons from "@/components/CategoryButtons";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack, router } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TourPage = () => {
  const headerHeight = useHeaderHeight();
  const [category, setCategory] = useState<string>("Tất cả");
  const [tourList, setTourList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchTourList = async () => {
      try {
        const response = await axios.get(
          "http://192.168.1.8:5000/api/tour/listTour"
        );
        setTourList(response.data.tour || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tour:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTourList();
  }, []);

  const onCatChanged = (newCategory: string) => {
    setCategory(newCategory);
  };

  const filteredTours = tourList.filter((tour) => {
    const matchesCategory = category === "Tất cả" || tour.category === category;
    const matchesSearch = tour.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderTour = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/(tabs)/TourDetailScreen",
          params: { tourId: item._id },
        })
      }
    >
      <Image
        source={{ uri: item.image || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <Text style={styles.title}>{item.title}</Text>

      <View style={styles.locationRow}>
        <Ionicons
          name="location-outline"
          size={16}
          color="#888"
          style={{ marginRight: 6 }}
        />
        <Text style={styles.description}>
          {item.location?.name || "Không có thông tin"}
        </Text>
      </View>

      <Text style={styles.price}>Giá: {item.price.toLocaleString()} VND</Text>
      <Text style={styles.linkDetail}>Xem chi tiết →</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => {}} style={styles.avatarWrapper}>
              <Image
                source={{
                  uri: "https://xsgames.co/randomusers/avatar.php?g=male",
                }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => {}} style={styles.notificationBtn}>
              <Ionicons name="notifications" size={20} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { paddingTop: headerHeight }]}>
        <FlatList
          data={filteredTours}
          keyExtractor={(item) => item._id}
          renderItem={renderTour}
          ListHeaderComponent={
            <>
              <Text style={styles.headingTxt}>Chọn tour theo danh mục</Text>

              <View style={styles.searchSectionWrapper}>
                <View style={styles.searchBar}>
                  <Ionicons
                    name="search"
                    size={18}
                    style={styles.searchIcon}
                    color="#8b5cf6"
                  />
                  <TextInput
                    placeholder="Tìm kiếm..."
                    style={styles.searchInput}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                  />
                </View>
                <TouchableOpacity onPress={() => {}} style={styles.filterBtn}>
                  <Ionicons name="options" size={28} color="#ffffff" />
                </TouchableOpacity>
              </View>

              <CategoryButtons onCategoryChanged={onCatChanged} />

              {loading && (
                <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
              )}
            </>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          ListEmptyComponent={() =>
            !loading ? (
              <Text style={styles.emptyText}>Không có tour nào phù hợp.</Text>
            ) : null
          }
        />
      </View>
    </>
  );
};

export default TourPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
  },
  headingTxt: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  searchSectionWrapper: {
    flexDirection: "row",
    marginVertical: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  filterBtn: {
    backgroundColor: "#8b5cf6",
    padding: 12,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  notificationBtn: {
    marginRight: 20,
    backgroundColor: "#8b5cf6",
    padding: 10,
    borderRadius: 12,
    shadowColor: "#171717",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loadingText: {
    color: "#8b5cf6",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
    marginTop: 40,
  },
  avatarWrapper: {
    marginLeft: 20,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: "cover",
    backgroundColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  description: {
    color: "#777",
    fontSize: 14,
  },
  price: {
    color: "#f39c12",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkDetail: {
    marginTop: 6,
    color: "#8b5cf6",
    fontSize: 14,
    fontWeight: "500",
  },
});
