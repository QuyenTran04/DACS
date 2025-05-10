import { View, Text } from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { CreateTripContext } from "@/context/CreateTripContext";
import moment from "moment";

const SelectDates = () => {
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);

  const onDayPress = (day: { dateString: string }) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(day.dateString);
      setSelectedEndDate(null);
    } else if (moment(day.dateString).isBefore(selectedStartDate)) {
      setSelectedStartDate(day.dateString);
    } else {
      setSelectedEndDate(day.dateString);
    }
  };

  const getMarkedDates = () => {
    if (!selectedStartDate) return {};

    const marked: any = {
      [selectedStartDate]: {
        startingDay: true,
        color: "#8b5cf6",
        textColor: "white",
      },
    };

    if (selectedEndDate) {
      const start = moment(selectedStartDate);
      const end = moment(selectedEndDate);
      const range = end.diff(start, "days");

      for (let i = 1; i < range; i++) {
        const date = start.clone().add(i, "days").format("YYYY-MM-DD");
        marked[date] = {
          color: "#c4b5fd",
          textColor: "white",
        };
      }

      marked[selectedEndDate] = {
        endingDay: true,
        color: "#8b5cf6",
        textColor: "white",
      };
    }

    return marked;
  };

  const handleConfirmDates = () => {
    if (selectedStartDate && selectedEndDate) {
      const totalNumberOfDays = moment(selectedEndDate).diff(moment(selectedStartDate), "days") + 1;
      setTripData((prev) => {
        const newData = prev.filter((item) => !item.dates);
        return [
          ...newData,
          {
            dates: {
              startDate: new Date(selectedStartDate),
              endDate: new Date(selectedEndDate),
              totalNumberOfDays,
            },
          },
        ];
      });
      router.push("/create-trip/select-budget");
    } else {
      alert("Please select both start and end dates");
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="px-2 py-6">
        <Text className="text-5xl font-outfit-bold mb-2 px-4">
          Khi nào bạn đi?
        </Text>
        <Text className="text-gray-500 font-outfit-medium mb-6 px-5">
          Chọn ngày bắt đầu và kết thúc chuyến đi của bạn.
        </Text>

        <View className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4">
          <Calendar
            onDayPress={onDayPress}
            markedDates={getMarkedDates()}
            markingType="period"
            minDate={moment().format("YYYY-MM-DD")}
            theme={{
              selectedDayBackgroundColor: "#8b5cf6",
              todayTextColor: "#8b5cf6",
              arrowColor: "#8b5cf6",
              textDayFontFamily: "outfit",
              textMonthFontFamily: "outfit-bold",
              textDayHeaderFontFamily: "outfit-medium",
            }}
          />
        </View>

        <View className="mt-6">
          <CustomButton
            title="Confirm Dates"
            onPress={handleConfirmDates}
            disabled={!selectedEndDate}
            className="disabled:opacity-50"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectDates;
