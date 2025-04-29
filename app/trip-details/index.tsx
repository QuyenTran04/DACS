import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from "react";
import { Colors } from '../../constants/Colors';
import moment from 'moment';
import FlightInfo from '../../components/TripDetails/FlightInfo';
import HotelList from '../../components/TripDetails/HotelList';
import PlannedTrip from '../../components/TripDetails/PlannedTrip';
import type { Activity } from '../../components/TripDetails/PlannedTrip';

const Index = () => {
  const navigation = useNavigation();
  const { trip } = useLocalSearchParams();

  // Kiểu dữ liệu chi tiết chuyến đi
  interface TripDetails {
    tripPlan?: {
      trip?: {
        flights?: any[];
        hotels?: any[];
        itinerary?: any[];
      };
      travel_plan?: {
        destination?: string;
      };
    };
    tripData?: {
      locationInfo?: {
        photoRef?: string;
      };
      startDate?: string;
      endDate?: string;
      traveler?: {
        title?: string;
      };
    };
  }

  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading

  // Hàm để format dữ liệu trip (nếu là chuỗi)
  const formatData = (data: string | string[] | { locationInfo?: { photoRef?: string }; startDate?: string; endDate?: string; traveler?: { title?: string }; } | undefined) => {
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
      console.error('Error parsing data:', error);
      return null;
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });

    if (trip) {
      const parsedTrip = formatData(trip);
      setTripDetails(parsedTrip);
      setIsLoading(false); // Đã tải xong dữ liệu
    }
  }, [trip]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!tripDetails) return null;

  const tripData = tripDetails?.tripData;
  const photoRef = tripData?.locationInfo?.photoRef;

  // Bỏ qua việc lấy ảnh từ Google Places API và sử dụng ảnh mặc định
  const imageUrl = photoRef ? `path/to/local/image.jpg` : null;

  const flights = tripDetails?.tripPlan?.trip?.flights || [];
  const hotels = tripDetails?.tripPlan?.trip?.hotels || [];
  const tripDailyPlan: Record<string, Activity[]> = Array.isArray(tripDetails?.tripPlan?.trip?.itinerary)
    ? tripDetails.tripPlan.trip.itinerary.reduce((acc, item, index) => {
        acc[`Day ${index + 1}`] = item.activities || [];
        return acc;
      }, {} as Record<string, Activity[]>)
    : {};

  return (
    <ScrollView>
      {/* Nếu không có ảnh từ Google, hiển thị ảnh mặc định */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Image source={require('./../../assets/images/travel.jpg')} style={styles.image} />
      )}
      <View style={styles.container}>
        <Text style={styles.title}>
          {tripDetails.tripPlan?.travel_plan?.destination || 'Chưa có thông tin điểm đến'}
        </Text>
        <View style={styles.flexBox}>
          <Text style={styles.smallPara}>
            {tripData?.startDate ? moment(tripData?.startDate).format("DD MMM YYYY") : 'N/A'}
          </Text>
          <Text style={styles.smallPara}>
            - {tripData?.endDate ? moment(tripData?.endDate).format("DD MMM YYYY") : 'N/A'}
          </Text>
        </View>
        <Text style={styles.smallPara}>
          🚌 {tripData?.traveler?.title || 'No traveler info'}
        </Text>

        {/* Hiển thị thông tin chuyến bay */}
        {flights.length > 0 ? (
          <FlightInfo flightData={flights} />
        ) : (
          <Text style={styles.noDataText}>Chưa có thông tin chuyến bay</Text>
        )}

        {/* Hiển thị danh sách khách sạn */}
        {hotels.length > 0 ? (
          <HotelList hotelList={hotels} />
        ) : (
          <Text style={styles.noDataText}>Chưa có thông tin khách sạn</Text>
        )}

        {/* Hiển thị lịch trình chi tiết */}
        {Object.keys(tripDailyPlan).length > 0 ? (
          <PlannedTrip details={tripDailyPlan} />
        ) : (
          <Text style={styles.noDataText}>Chưa có lịch trình cho chuyến đi</Text>
        )}
      </View>
    </ScrollView>
  );
}

export default Index;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 330,
  },
  container: {
    padding: 15,
    backgroundColor: Colors.white,
    height: '100%',
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 25,
  },
  smallPara: {
    fontFamily: 'Outfit',
    fontSize: 18,
    color: Colors.gray,
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    height: '100%',
  },
  noDataText: {
    fontFamily: 'Outfit',
    fontSize: 18,
    color: Colors.gray,
    marginTop: 15,
    textAlign: 'center',
  },
});
