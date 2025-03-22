import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
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
        Alert.alert("Đăng ký thành công!");
      } else {
        Alert.alert("Lỗi", data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Tên đăng nhập"
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
      />
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mật khẩu"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
      />
      <Button title="Đăng ký" onPress={handleSubmit} />
    </View>
  );
};

export default Register;
