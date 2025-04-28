import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import styles from "../styles"; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async () => {
    try {
      // Gửi email đến backend (hiện chưa có)
      const response = await fetch('http://192.168.3.35:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Thành công', 'Vui lòng kiểm tra email để đặt lại mật khẩu');
        router.replace("/auth/login");
      } else {
        Alert.alert('Lỗi', data.message || 'Không gửi được email');
      }
    } catch (error) {
      console.error('Lỗi gửi yêu cầu quên mật khẩu:', error);
      Alert.alert('Lỗi mạng', 'Không thể kết nối tới máy chủ');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email của bạn"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleForgotPassword}>
        <Text style={styles.buttonText}>Gửi yêu cầu</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("/auth/login")}>
          <Text style={styles.signUp}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;
