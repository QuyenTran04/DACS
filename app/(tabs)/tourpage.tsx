import React, { useEffect, useState, useCallback } from "react";
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
  Animated,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

const PRIMARY = "#8b5cf6";
const SECONDARY = "#f39c12";
const BG = "#f8f7fa";

const TourPage = () => {
  const headerHeight = useHeaderHeight();
  const [category, setCategory] = useState<string>("Tất cả");
  const [tourList, setTourList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      setIsNavigating(false);
    }, [])
  );

  useEffect(() => {
    const fetchTourList = async () => {
      try {
        const response = await axios.get(
          "http://192.168.3.21:5000/api/tour/listTour"
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

  // Hiệu ứng nhấn card
  const renderTour = ({ item }: { item: any }) => {
    const scaleAnim = new Animated.Value(1);

    const onPressIn = () =>
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    const onPressOut = () =>
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={() => {
            setIsNavigating(true);
            router.push({
              pathname: "/bookingTour/TourDetailScreen",
              params: { tourId: item._id },
            });
          }}
          disabled={isNavigating}
        >
          {/* Card Image with Tag & Price */}
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: item.image || "https://via.placeholder.com/300x180",
              }}
              style={styles.image}
            />
            {/* Tag danh mục */}
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.category || "Tour"}</Text>
            </View>
            {/* Giá overlay */}
            <View style={styles.priceOverlay}>
              <Ionicons name="pricetag" size={15} color="#fff" />
              <Text style={styles.priceOverlayText}>
                {item.price.toLocaleString()} đ
              </Text>
            </View>
          </View>
          {/* Nội dung */}
          <Text numberOfLines={1} style={styles.title}>
            {item.title}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons
              name="location"
              size={16}
              color={PRIMARY}
              style={{ marginRight: 5 }}
            />
            <Text style={styles.locationText}>
              {item.location?.name || "Không có thông tin"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.detailBtn}
            onPress={() => {
              setIsNavigating(true);
              router.push({
                pathname: "/bookingTour/TourDetailScreen",
                params: { tourId: item._id },
              });
            }}
            disabled={isNavigating}
            activeOpacity={0.8}
          >
            <Text style={styles.detailBtnText}>Xem chi tiết</Text>
            <Ionicons name="chevron-forward" size={17} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

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
        {(loading || isNavigating) && (
          <View style={styles.loadingOverlay}>
            <Ionicons name="refresh" size={40} color={PRIMARY} />
            <Text style={styles.loadingText}>
              {loading ? "Đang tải dữ liệu..." : "Đang chuyển trang..."}
            </Text>
          </View>
        )}
        <FlatList
          data={filteredTours}
          keyExtractor={(item) => item._id}
          renderItem={renderTour}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 40,
            paddingHorizontal: 8,
            paddingTop: 6,
          }}
          ListHeaderComponent={
            <>
              <Text style={styles.headingTxt}>Khám phá tour nổi bật</Text>
              <View style={styles.searchSectionWrapper}>
                <View style={styles.searchBar}>
                  <Ionicons
                    name="search"
                    size={18}
                    style={styles.searchIcon}
                    color={PRIMARY}
                  />
                  <TextInput
                    placeholder="Tìm kiếm điểm đến, tour, danh mục..."
                    style={styles.searchInput}
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    placeholderTextColor="#aaa"
                  />
                </View>
                <TouchableOpacity onPress={() => {}} style={styles.filterBtn}>
                  <Ionicons name="options" size={26} color="#fff" />
                </TouchableOpacity>
              </View>
              <CategoryButtons onCategoryChanged={onCatChanged} />
            </>
          }
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
    backgroundColor: BG,
  },
  headingTxt: {
    fontSize: 28,
    fontWeight: "800",
    color: "#22223b",
    marginTop: 16,
    marginBottom: 6,
    textAlign: "left",
    paddingLeft: 16,
    letterSpacing: 0.5,
  },
  searchSectionWrapper: {
    flexDirection: "row",
    marginVertical: 10,
    marginBottom: 16,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 28,
    alignItems: "center",
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.11,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 7,
    elevation: 2,
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
    backgroundColor: PRIMARY,
    padding: 12,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 14,
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  notificationBtn: {
    marginRight: 20,
    backgroundColor: PRIMARY,
    padding: 10,
    borderRadius: 14,
    shadowColor: "#171717",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
  },
  avatarWrapper: {
    marginLeft: 20,
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 16,
  },
  loadingText: {
    color: PRIMARY,
    fontSize: 17,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "600",
  },
  emptyText: {
    color: "#9e9e9e",
    fontSize: 16,
    textAlign: "center",
    marginTop: 38,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    marginBottom: 20,
    marginHorizontal: 7,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 178,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    overflow: "hidden",
    backgroundColor: "#e8eaf6",
    marginBottom: 5,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tag: {
    position: "absolute",
    top: 13,
    left: 13,
    backgroundColor: PRIMARY,
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 18,
    zIndex: 2,
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  tagText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  priceOverlay: {
    position: "absolute",
    right: 13,
    bottom: 13,
    flexDirection: "row",
    backgroundColor: SECONDARY,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#f39c12",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  priceOverlayText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 5,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    color: "#23235b",
    marginTop: 6,
    marginHorizontal: 18,
    marginBottom: 2,
    letterSpacing: 0.1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 18,
    marginBottom: 7,
  },
  locationText: {
    color: PRIMARY,
    fontSize: 15,
    fontWeight: "500",
  },
  detailBtn: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 15,
    paddingVertical: 9,
    borderRadius: 18,
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 7,
    elevation: 2,
  },
  detailBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginRight: 7,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
