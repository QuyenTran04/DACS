import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          headerShown: false,
          title: "Ưu đãi",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="gift" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="user"
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          headerShown: false,
          href: null,  // Removing the href makes it not navigate anywhere
          title: "Tài khoản",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="styles"
        options={{
          href: null,
          title: "Tài khoản",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          headerShown: false,
          title: "Tài khoản",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user" color={color} />
          ),
        }}
      />
        <Tabs.Screen
          name="_forgotPassword"  // Tên ban đầu của file
          options={{
            headerShown: false,
            href: null,  // Removing the href makes it not navigate anywhere
            title: "Tài khoản",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="user" color={color} />
            )
          }}
        />      
    </Tabs>
    
  );
}
