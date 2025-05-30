import { View, Text, Image } from "react-native";
import React, { useEffect, useState } from "react";
import moment from "moment";
import CustomButton from "../CustomButton";
import UserTripCard from "./UserTripCard";
import { useRouter } from "expo-router";

const UserTripList = ({ userTrips }: { userTrips: any[] }) => {
  const router = useRouter();

  // Sort trips by start date
  const sortedTrips = [...userTrips].sort((a, b) => {
    const aData = JSON.parse(a.tripData);
    const bData = JSON.parse(b.tripData);
    const aStartDate = aData.find((item: any) => item.dates)?.dates?.startDate;
    const bStartDate = bData.find((item: any) => item.dates)?.dates?.startDate;
    return moment(aStartDate).valueOf() - moment(bStartDate).valueOf();
  });

  const LatestTrip = JSON.parse(sortedTrips[0]?.tripData);

  const locationInfo = LatestTrip?.find(
    (item: any) => item.locationInfo
  )?.locationInfo;

  const startDate = LatestTrip?.find((item: any) => item.dates)?.dates
    ?.startDate;
  const endDate = LatestTrip?.find((item: any) => item.dates)?.dates?.endDate;
  const travelersType = LatestTrip?.find((item: any) => item.travelers)
    ?.travelers?.type;

  const isPastTrip = moment().isAfter(moment(endDate));
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
        await Image.prefetch(url);
        return url;
      }
    } catch (error) {
      console.error("Error fetching Unsplash image:", error);
    }
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"; // fallback
  };
  useEffect(() => {
    const loadImage = async () => {
      if (locationInfo) {
        const url = await fetchUnsplashImage(locationInfo);
        setImageUrl(url);
      }
    };
    loadImage();
  }, [locationInfo]);



  return (
    <View className="mb-16">
      <View>
        <View className="w-full h-60 rounded-2xl mt-5 overflow-hidden">
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
        <View className="mt-3">
          <Text
            className={`font-outfit-medium text-xl ${
              isPastTrip ? "text-gray-500" : ""
            }`}
          >
            {locationInfo?.name || "Unknown destination"}
          </Text>
          <View className="flex flex-row justify-between items-center mt-2">
            <Text className="font-outfit text-lg text-gray-500">
              {moment(startDate).format("DD MMM")} →{" "}
              {moment(endDate).format("DD MMM YYYY")}
            </Text>
            <Text className="font-outfit-medium mr-5 text-lg text-gray-500">
              🚌 {travelersType}
            </Text>
          </View>

          <CustomButton
            title="View Trip"
            onPress={() =>
              router.push({
                pathname: "/trip-details",
                params: {
                  tripData: sortedTrips[0].tripData,
                  tripPlan: JSON.stringify(sortedTrips[0].tripPlan, null, 2),
                },
              })
            }
            className={`mt-3 ${isPastTrip ? "opacity-50" : ""}`}
          />
        </View>

        <View className="h-0.5 bg-gray-200 mt-4 mb-2" />

        {sortedTrips?.slice(1).map((trip, idx) => (
          <UserTripCard trip={trip} key={idx} />
        ))}
      </View>
    </View>
  );
};

export default UserTripList;
