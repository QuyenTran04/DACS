import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import { icons } from "@/constants";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
import DummyLogin from "@/components/DummyLogin";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSignUpPress = async () => {
    try {
      if (!form.email || !form.password || !form.name) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Tạo tài khoản thành công
      const user = userCredential.user;
      console.log(user);

      // Điều hướng đến trang chính
      router.replace("/(tabs)/mytrip");
    } catch (error: any) {
      // Xử lý lỗi xác thực Firebase cụ thể
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("Email này đã được đăng ký");
          break;
        case "auth/invalid-email":
          alert("Địa chỉ email không hợp lệ");
          break;
        case "auth/weak-password":
          alert("Mật khẩu phải có ít nhất 6 ký tự");
          break;
        default:
          alert("Lỗi khi tạo tài khoản: " + error.message);
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
            Tạo Tài Khoản Mới
          </Text>
        </View>

        <View className="p-5">
          <InputField
            label="Họ và tên"
            placeholder="Nhập họ và tên của bạn"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Nhập địa chỉ email"
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
            title={isLoading ? "Đang tạo tài khoản..." : "Đăng ký"}
            onPress={onSignUpPress}
            className="mt-6"
            disabled={isLoading}
          />

          <DummyLogin />
          <Link
            href="/(auth)/sign-in"
            className="text-lg text-center mt-10 font-outfit-medium"
          >
            <Text>Đã có tài khoản? </Text>
            <Text className="text-purple-500">Đăng nhập</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignUp;
