import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import CustomButton from "@/components/CustomButton";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Attraction {
  attractionName: string;
  details: string;
  imageUrl: string;
  coordinates: Coordinates;
  price: number | string;
  travelTime: string;
}

interface Hotel {
  hotelName: string;
  address: string;
  price: number | string;
  imageUrl: string;
  coordinates: Coordinates;
  rating: number | string;
  description: string;
  nearbyAttractions: Attraction[];
}

interface Flight {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number | string;
  bookingURL: string;
}

interface ActivityItem {
  time: string;
  activity: string;
  details: string;
}

interface ItineraryDay {
  day: number;
  activities: ActivityItem[];
}

interface TripPlan {
  destination: string;
  duration?: string;
  travelers?: number | string;
  budget?: string;
  flights?: Flight[];
  hotels?: Hotel[];
  itinerary?: ItineraryDay[];
}

const formatDateTime = (input: string) => {
  if (!input || typeof input !== "string") return "Invalid Time";

  // Nếu đã là chuỗi ISO (có "T")
  if (input.includes("T")) {
    const date = new Date(input);
    return isNaN(date.getTime())
      ? "Invalid Time"
      : date.toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        });
  }

  // Nếu chỉ là chuỗi giờ dạng "08:00"
  const timeRegex = /^\d{2}:\d{2}$/;
  if (timeRegex.test(input)) {
    // Thêm ngày giả để parse được
    const mockDate = new Date(`2025-01-01T${input}:00`);
    return isNaN(mockDate.getTime())
      ? "Invalid Time"
      : mockDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return "Invalid Time";
};

const openMap = (latitude: number, longitude: number) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  Linking.openURL(url);
};

const Discover: React.FC = () => {
  const { tripPlan, tripData } = useLocalSearchParams<{
    tripPlan: string;
    tripData: string;
  }>();

  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [departureAirport, setDepartureAirport] = useState<string>("");

  console.log("departureAirport", departureAirport);
  useEffect(() => {
    if (!tripPlan) return;
    try {
      const parsedPlan = JSON.parse(tripPlan);
      const planData = parsedPlan.trip ?? parsedPlan;

      const parsedTripData = tripData ? JSON.parse(tripData) : [];

      const locationInfo = parsedTripData?.find(
        (d: any) => d.locationInfo
      )?.locationInfo;
      const startDate = parsedTripData?.find((d: any) => d.dates)?.dates
        ?.startDate;
      const endDate = parsedTripData?.find((d: any) => d.dates)?.dates?.endDate;
      const travelers = parsedTripData?.find(
        (d: any) => d.travelers
      )?.travelers;
      const budget = parsedTripData?.find((d: any) => d.budget)?.budget;

      const durationInDays =
        startDate && endDate
          ? moment(endDate).diff(moment(startDate), "days") + 1
          : null;

      const safePlan: TripPlan = {
        destination: locationInfo?.name ?? planData.destination ?? "Unknown",
        duration: durationInDays ? `${durationInDays} days` : "",
        travelers: planData.travelers ?? travelers?.count ?? "N/A",
        budget: planData.budget ?? budget?.type ?? "N/A",
        flights: planData.flights ?? [],
        hotels: planData.hotels ?? [],
        itinerary: planData.itinerary ?? [],
      };

      setPlan(safePlan);
      console.log("✈️ first flight:", safePlan.flights);
      if (Array.isArray(safePlan.flights) && safePlan.flights.length > 0) {
        const airport = safePlan.flights[0]?.departureAirport;
        if (airport) {
          setDepartureAirport(airport);
        }
      }
    } catch (error) {
      console.error("❌ Error parsing tripPlan:", error);
    } finally {
      setLoading(false);
    }
  }, [tripPlan, tripData]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!plan) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl text-gray-600">
          Không có dữ liệu chuyến đi
        </Text>
      </View>
    );
  }

  const airports = [
    "HAN (Hà Nội)",
    "SGN (TP.HCM)",
    "DAD (Đà Nẵng)",
  ];

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 16, paddingTop: 80, paddingBottom: 40 }}
    >
      <Text className="text-3xl font-bold mb-6">
        Trip to {plan.destination}
      </Text>

      <View className="bg-purple-50 p-4 rounded-xl mb-8">
        <Text className="font-bold text-lg mb-2">Trip Overview</Text>
        <Text>Duration: {plan.duration || "N/A"}</Text>
        <Text>Travelers: {plan.travelers || "N/A"}</Text>
        <Text>Budget: {plan.budget || "N/A"}</Text>
      </View>

      {/* Flights */}
      {Array.isArray(plan.flights) && plan.flights.length > 0 && (
        <View className="mb-8">
          <Text className="text-2xl font-bold mb-4">Flight Details</Text>
          <Text className="mb-2">Change Departure Airport:</Text>
          <View className="border border-gray-300 rounded-lg bg-white mb-4">
            <Picker
              selectedValue={departureAirport}
              onValueChange={(val) => {
                setDepartureAirport(val);
                setPlan((prev) =>
                  prev
                    ? {
                        ...prev,
                        flights: prev.flights!.map((f, i) =>
                          i === 0 ? { ...f, departureAirport: val } : f
                        ),
                      }
                    : prev
                );
              }}
            >
              {airports.map((a) => (
                <Picker.Item label={a} value={a} key={a} />
              ))}
            </Picker>
          </View>

          {plan.flights.map((f, i) => (
            <View
              key={i}
              className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100"
            >
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="font-bold">Departure</Text>
                  <Text>{departureAirport}</Text>
                  <Text>{formatDateTime(f.departureTime)}</Text>
                </View>
                <Ionicons name="airplane" size={24} color="#8b5cf6" />
                <View>
                  <Text className="font-bold">Arrival</Text>
                  <Text>{f.arrivalAirport}</Text>
                  <Text>{formatDateTime(f.arrivalTime)}</Text>
                </View>
              </View>
              <Text>Airline: {f.airline}</Text>
              <Text>Flight Number: {f.flightNumber}</Text>
              <Text>Price: {String(f.price)}</Text>
              <CustomButton
                title="Book Flight"
                onPress={() => Linking.openURL(f.bookingURL)}
                disabled={!f.bookingURL}
                className="mt-4"
              />
            </View>
          ))}
        </View>
      )}

      {/* Hotels */}
      {Array.isArray(plan.hotels) && plan.hotels.length > 0 && (
        <View className="mb-8">
          <Text className="text-2xl font-bold mb-4">Hotels</Text>
          {plan.hotels.map((hotel, i) => (
            <View
              key={i}
              className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100"
            >
              {hotel.imageUrl && (
                <Image
                  source={{ uri: hotel.imageUrl }}
                  className="w-full h-48 rounded-xl mb-4"
                />
              )}

              <Text className="font-bold text-lg">{hotel.hotelName}</Text>
              <Text>{hotel.address}</Text>
              <Text>Price: {String(hotel.price)}</Text>
              <Text>Rating: {String(hotel.rating)} ⭐</Text>
              <Text className="mt-2">{hotel.description}</Text>
              <CustomButton
                title="View on Map"
                onPress={() =>
                  openMap(
                    hotel.coordinates.latitude,
                    hotel.coordinates.longitude
                  )
                }
                className="mt-4"
              />
              {Array.isArray(hotel.nearbyAttractions) && (
                <>
                  <Text className="font-bold text-lg mt-6 mb-2">
                    Nearby Attractions
                  </Text>
                  {hotel.nearbyAttractions.map((att, j) => (
                    <View
                      key={j}
                      className="flex-row items-center bg-white p-3 rounded-lg mb-3 border border-gray-200"
                    >
                      {att.imageUrl && (
                        <Image
                          source={{ uri: att.imageUrl }}
                          className="w-16 h-16 rounded-lg mr-3"
                        />
                      )}
                      <View style={{ flex: 1 }}>
                        <Text className="font-semibold">
                          {att.attractionName}
                        </Text>
                        <Text>{att.details}</Text>
                        <Text>Price: {String(att.price)}</Text>
                        <Text>Travel Time: {att.travelTime}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() =>
                          openMap(
                            att.coordinates.latitude,
                            att.coordinates.longitude
                          )
                        }
                        className="p-2 bg-purple-500 rounded-lg"
                      >
                        <Ionicons name="navigate" size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Itinerary */}
      {Array.isArray(plan.itinerary) && plan.itinerary.length > 0 && (
        <View className="mb-8">
          <Text className="text-2xl font-bold mb-4">Itinerary</Text>
          {plan.itinerary.map((day, i) => (
            <View
              key={i}
              className="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100"
            >
              <Text className="font-bold text-lg mb-2">Day {day.day}</Text>
              {day.activities.map((act, k) => (
                <View key={k} className="mb-3">
                  <Text className="font-semibold">{act.time}</Text>
                  <Text className="font-semibold">{act.activity}</Text>
                  <Text>{act.details}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Discover;
