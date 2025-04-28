import React, { useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";

const SelectDates = () => {
  const router = useRouter();
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const onDayPress = (day: any) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null); // Reset end date khi chọn lại ngày bắt đầu
    } else if (startDate && !endDate) {
      if (day.dateString >= startDate) {
        setEndDate(day.dateString);
      } else {
        setStartDate(day.dateString); // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu, đổi lại
      }
    }
  };

  const handleContinue = () => {
    if (!startDate || !endDate) {
      Alert.alert("Thông báo", "Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc.");
      return;
    }

    // Tính số ngày giữa 2 ngày
    const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays > 5) {
      Alert.alert("Thông báo", "Bạn chỉ được chọn tối đa 5 ngày!");
    } else {
      // Điều hướng đến trang Select-Budget
      router.push({
        pathname: "/create-trip/Select-Budget",
        params: {
          startDate,
          endDate,
        },
      });
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", backgroundColor: "#f3f4f6" }}>
      <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 20 }}>
        Chọn lịch cho chuyến đi
      </Text>
      
      <Calendar
        onDayPress={onDayPress}
        markingType={"period"}
        markedDates={{
          ...(startDate ? { [startDate]: { startingDay: true, color: "#70d7c7", textColor: "white" } } : {}),
          ...(endDate ? { [endDate]: { endingDay: true, color: "#70d7c7", textColor: "white" } } : {}),
          ...(startDate && endDate ? getMarkedDates(startDate, endDate) : {}),
        }}
        minDate={new Date().toISOString().split('T')[0]} // Ngày tối thiểu là hôm nay
      />

      <Button title="Continue" onPress={handleContinue} />
    </View>
  );
};

// Helper function để đánh dấu các ngày giữa startDate và endDate
const getMarkedDates = (start: string, end: string) => {
  let dates: any = {};
  let current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    const dateString = current.toISOString().split('T')[0];
    dates[dateString] = { color: "#95e1d3", textColor: "white" };
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

export default SelectDates;
