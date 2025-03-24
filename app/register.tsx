import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import styles from "./styles";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Kiểm tra dữ liệu nhập vào
  const validateForm = () => {
    const { username, email, password } = formData;
    if (!username || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ!");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự!");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(
        "http://192.168.1.8:5000/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Thành công", "Đăng ký thành công!");
        setFormData({ username: "", email: "", password: "" }); // Reset form
      } else {
        Alert.alert("Lỗi", data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Đăng ký</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default Register;
