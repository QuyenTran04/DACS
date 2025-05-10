import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
import DummyLogin from "@/components/DummyLogin";

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onLoginPress = async () => {
    try {
      if (!form.email || !form.password) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Đăng nhập thành công
      const user = userCredential.user;
      console.log(user);

      // Điều hướng đến màn hình chính
      router.replace("/(tabs)/mytrip");
    } catch (error: any) {
      // Xử lý lỗi xác thực Firebase cụ thể
      switch (error.code) {
        case "auth/invalid-email":
          alert("Địa chỉ email không hợp lệ");
          break;
        case "auth/user-disabled":
          alert("Tài khoản này đã bị vô hiệu hóa");
          break;
        case "auth/user-not-found":
          alert("Không tìm thấy tài khoản với email này");
          break;
        case "auth/wrong-password":
          alert("Mật khẩu không đúng");
          break;
        default:
          alert("Lỗi khi đăng nhập: " + error.message);
      }
      console.error(error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-72">
          <Image
            source={require("@/assets/images/avent-sign.jpg")}
            className="z-0 w-full h-72"
          />
          <Text className="text-3xl font-outfit-bold absolute bottom-0 left-5">
            Chào mừng trở lại !
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Nhập địa chỉ email của bạn"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            icon={icons.lock}
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            onPress={onLoginPress}
            className="mt-6"
            disabled={isLoading}
          />

          <DummyLogin />

          <Link
            href="/(auth)/sign-up"
            className="text-lg text-center mt-10 font-outfit-medium"
          >
            <Text>Chưa có tài khoản ? </Text>
            <Text className="text-purple-500">Đăng ký</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
