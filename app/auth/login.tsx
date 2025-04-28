import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Alert, ToastAndroid, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Cấu hình Google Sign-In
GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive'],
  webClientId: '449265858686-joaftiof1ptd8t2ds51kj0lg90p0lism.apps.googleusercontent.com', // Dùng client ID của ứng dụng
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  profileImageSize: 120
});

// Tạo tài khoản giả
const FAKE_ACCOUNT = {
  email: "testuser@example.com",
  password: "Test@1234",
  fullName: "Test User"
};

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLogin, setIsLogin] = useState(true); // State để xác định là đăng nhập hay đăng ký
  const [isForgotPassword, setIsForgotPassword] = useState(false); // State cho chức năng quên mật khẩu

  // Thay đổi giữa màn hình đăng nhập và đăng ký
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false); // Reset forgot password mode when switching auth modes
  };

  // Chuyển sang chế độ quên mật khẩu
  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
  };

  const handleSubmit = async () => {
    if (isForgotPassword) {
      await handleForgotPassword();
      return;
    }

    if (!email || !password || (!isLogin && !fullName)) {
      ToastAndroid.show('Please enter all details', ToastAndroid.LONG);
      return;
    }

    // Nếu là màn hình đăng nhập
    if (isLogin) {
      // Kiểm tra tài khoản giả
      if (email === FAKE_ACCOUNT.email && password === FAKE_ACCOUNT.password) {
        Alert.alert("Đăng nhập thành công!");
        router.replace("/MyTrip"); // Chuyển đến màn hình sau khi đăng nhập thành công
      } else {
        Alert.alert("Lỗi", "Thông tin đăng nhập không chính xác.");
      }
    } else {
      // Nếu là màn hình đăng ký
      if (email === FAKE_ACCOUNT.email) {
        Alert.alert("Lỗi", "Email đã tồn tại.");
        return;
      }

      // Tạo tài khoản giả
      Alert.alert("Đăng ký thành công!");
      router.replace("/MyTrip"); // Chuyển đến màn hình sau khi đăng ký thành công
    }
  };

  // Xử lý chức năng quên mật khẩu
  const handleForgotPassword = async () => {
    if (!email) {
      ToastAndroid.show('Please enter your email', ToastAndroid.LONG);
      return;
    }

    try {
      // Gửi yêu cầu khôi phục mật khẩu
      const response = await fetch("http://192.168.3.35:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Email Sent",
          "If your email exists in our system, you will receive a password reset link."
        );
        setIsForgotPassword(false); // Return to login form
      } else {
        Alert.alert("Lỗi", data.message || "Unable to process your request");
      }
    } catch (error) {
      console.error("Lỗi quên mật khẩu:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi xử lý yêu cầu.");
    }
  };

  // Xử lý đăng nhập qua Google
  const handleLoginWithGoogle = async () => {
    // Thay vì gọi Google SignIn, chúng ta giả lập đăng nhập Google
    if (email === FAKE_ACCOUNT.email && password === FAKE_ACCOUNT.password) {
      Alert.alert("Đăng nhập Google thành công!");
      router.replace("/MyTrip"); // Chuyển đến màn hình sau khi đăng nhập thành công
    } else {
      Alert.alert("Lỗi", "Thông tin đăng nhập Google không chính xác.");
    }
  };

  // Render form theo trạng thái hiện tại
  const renderForm = () => {
    if (isForgotPassword) {
      return (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              onChangeText={(value) => setEmail(value)}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={toggleForgotPassword}>
            <Text style={styles.linkText}>Back to Sign In</Text>
          </TouchableOpacity>
        </>
      );
    }

    return (
      <>
        {!isLogin && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Full Name"
              onChangeText={(value) => setFullName(value)}
              value={fullName}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            onChangeText={(value) => setEmail(value)}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Enter Password"
            onChangeText={(value) => setPassword(value)}
            value={password}
          />
        </View>

        {isLogin && (
          <TouchableOpacity style={styles.forgotButton} onPress={toggleForgotPassword}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isLogin ? "Sign In" : "Create Account"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton} onPress={toggleAuthMode}>
          <Text style={styles.linkText}>
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleLoginWithGoogle}>
            <Text style={styles.socialButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>
        {isForgotPassword ? "Forgot Password" : isLogin ? "Sign In" : "Create New Account"}
      </Text>

      {renderForm()}
    </View>
  );
};

// Định nghĩa styles như trước


const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#4285F4',
    fontSize: 14,
  },
  socialContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 14,
  },
  forgotButton: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  forgotText: {
    color: '#4285F4',
    fontSize: 14,
  }
});

export default Auth;