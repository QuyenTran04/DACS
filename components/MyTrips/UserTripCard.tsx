import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import CustomButton from "../CustomButton";
import { useRouter } from "expo-router";

const UserTripCard = ({ trip }: { trip: any }) => {
  const router = useRouter();
  const tripData = JSON.parse(trip?.tripData);
  const locationInfo = tripData?.find(
    (item: any) => item.locationInfo
  )?.locationInfo;
  const startDate = tripData?.find((item: any) => item.dates)?.dates?.startDate;
  const endDate = tripData?.find((item: any) => item.dates)?.dates?.endDate;
  const travelers = tripData?.find((item: any) => item.travelers)?.travelers;

  const isPastTrip = moment().isAfter(moment(endDate));

  const hasImage = !!locationInfo?.photoRef;
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const locationName =
    typeof locationInfo === "object" && locationInfo !== null
      ? locationInfo.name || "Unknown Location"
      : typeof locationInfo === "string"
      ? locationInfo
      : "Unknown Location";

  const fetchUnsplashImage = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query + " travel landscape"
        )}&client_id=${process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const url = data.results[0].urls.small;
        await Image.prefetch(url); // preload
        return url;
      }
    } catch (error) {
      console.error("Error fetching Unsplash image:", error);
    }
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"; // fallback ảnh đẹp
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (locationName) {
        const url = await fetchUnsplashImage(locationName);
        setImageUrl(url);
      }
    };
    fetchImage();
  }, [locationName]);

  return (
    <View className="mt-5 flex flex-row gap-3">
      <View className="w-32 h-32 rounded-2xl overflow-hidden">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className={`w-full h-full ${isPastTrip ? "grayscale" : ""}`}
          />
        ) : (
          <View className="w-full h-full bg-gray-200 items-center justify-center">
            <Text>Loading...</Text>
          </View>
        )}
      </View>

      <View className="flex-1">
        <Text
          className={`font-outfit-medium text-lg ${
            isPastTrip ? "text-gray-500" : ""
          }`}
          numberOfLines={2}
        >
          {locationInfo?.name || "Unknown destination"}
        </Text>

        <Text className="font-outfit text-md text-gray-500 mt-1">
          {startDate && endDate
            ? `${moment(startDate).format("DD MMM")} → ${moment(endDate).format(
                "DD MMM YYYY"
              )}`
            : "Unknown dates"}
        </Text>

        <Text className="font-outfit-medium text-md text-gray-500 mt-1">
          👥 {travelers?.count || "?"} người ({travelers?.type || "?"})
        </Text>

        <CustomButton
          title="View Trip"
          onPress={() =>
            router.push({
              pathname: "/trip-details",
              params: {
                tripData: trip.tripData,
                tripPlan: JSON.stringify(trip.tripPlan, null, 2),
              },
            })
          }
          disabled={isPastTrip}
          className={`mt-2 py-0.5 ${isPastTrip ? "opacity-50" : ""}`}
        />
      </View>
    </View>
  );
};

export default UserTripCard;
