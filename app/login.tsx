import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import styles from "./styles";
import { router } from "expo-router";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive'],
  webClientId: '449265858686-joaftiof1ptd8t2ds51kj0lg90p0lism.apps.googleusercontent.com',
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  profileImageSize: 120
});

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://192.168.3.35:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Đăng nhập thành công!");
        console.log("Token:", data.token);
        // TODO: Lưu token hoặc chuyển trang tại đây
      } else {
        Alert.alert("Lỗi", data.message);
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi đăng nhập.");
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      console.log("--- Google User Info Object ---");
      console.log(JSON.stringify(userInfo, null, 2));
      console.log("-------------------------------");

      const idToken = (userInfo as any).idToken;

      if (idToken) {
        await fetch("http://192.168.3.35:5000/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: idToken }),
        });
        console.log("Sent idToken to backend.");
        Alert.alert("Google Sign-In Success!", "Authentication successful");
      } else {
        console.warn("idToken not found in userInfo object.");
        Alert.alert("Error", "Không lấy được token từ Google.");
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("Người dùng đã hủy đăng nhập Google.");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("Đăng nhập đang được thực hiện...");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Lỗi", "Google Play Services không khả dụng hoặc đã cũ.");
      } else {
        console.error("Google sign-in error:", error);
        Alert.alert("Lỗi", "Đã xảy ra lỗi khi đăng nhập với Google.");
      }
    }
  };

  const forgotPassword = () => {
    router.push("/_forgotPassword"); // Thay đổi theo cấu trúc thư mục của bạn
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => handleChange("email", text)}
        value={formData.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        onChangeText={(text) => handleChange("password", text)}
        value={formData.password}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <View style={styles.optionsContainer}>
        <Text style={styles.optionText}>Hoặc đăng nhập với</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleLoginWithGoogle}
          >
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={forgotPassword}>
        <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/register")}>
        <Text style={styles.signUp}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
