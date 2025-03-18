import React, { useState } from 'react';
import { View, Text, Alert, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link,router } from 'expo-router';

export default function LoginScreen({}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Email:', email);
    console.log('Password:', password);
    if (email === "q" && password === "1") {
      router.replace('/home');
    } else {
      Alert.alert("Vui lòng nhập chính xác!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={styles.optionsContainer}>
        <Text style={styles.optionText}>Or Sign in with</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.signUp}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    //backgroundColor: 'blue',
  },
  title: {
    fontSize: 29,
    marginBottom: 20,
    textAlign: 'center',
    color: 'blue'
  },
  input: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  optionsContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  optionText: {
    marginBottom: 10,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    backgroundColor: '#4267B2',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  socialButtonText: {
    color: 'white',
    fontSize: 16,
  },
  forgotPassword: {
    textAlign: 'center',
    color: '#007BFF',
    marginBottom: 10,
  },
  signUp: {
    textAlign: 'center',
    color: '#007BFF',
  },
});
