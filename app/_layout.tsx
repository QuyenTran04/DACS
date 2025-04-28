import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { CreateTripContext } from '@/context/CreateTripContext';
import { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [tripData, setTripData] = useState<any>({
    startDate: '',
    endDate: '',
    totalNumOfDays: 0,
  }); // Đảm bảo tripData có giá trị mặc định hợp lệ

  const [fontsLoaded] = useFonts({
    'Outfit': require('./../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium': require('./../assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Bold': require('./../assets/fonts/Outfit-Bold.ttf'),
  });

  // Kiểm tra khi fonts chưa được tải xong, sẽ render một loading indicator
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <CreateTripContext.Provider value={{ tripData, setTripData }}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Thêm các màn hình khác vào Stack */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </CreateTripContext.Provider>
  );
}
