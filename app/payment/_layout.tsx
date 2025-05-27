import React from "react";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BookingTourLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "",
        headerTitle: "",
        headerStyle: {
          backgroundColor: "transparent",
        },
        headerLeft: () => (
          <TouchableOpacity className="ml-4" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="momo-redirect" />
    </Stack>
  );
}
