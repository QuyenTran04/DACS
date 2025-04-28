import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const Login = () => {
  const router = useRouter();

  return (
    <View>
      <View>
        <Image 
          source={require('./../assets/images/travel.jpg')} 
          style={styles.image} 
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Du Lịch Cùng Tôi</Text>
        <Text style={styles.paragaph}>Lên kế hoạch cho chuyến đi tiếp theo một cách dễ dàng với các lộ trình cá nhân hóa và thông tin du lịch dựa trên AI.</Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.button}>
          <Text style={styles.buttonText}>Bắt đầu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: '100%',
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25
  },
  image: {
    width: '100%',
    height: 520,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 10
  },
  paragaph: {
    fontFamily: 'Outfit',
    fontSize: 17,
    textAlign: 'center',
    color: Colors.gray,
    marginTop: 20
  },
  button: {
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 99,
    marginTop: '25%'
  },
  buttonText: {
    fontFamily: 'Outfit',
    textAlign: 'center',
    color: Colors.white,
    fontSize: 17
  }
});

export default Login;
