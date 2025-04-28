import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
import { CreateTripContext } from '../../context/CreateTripContext';
import { Colors } from './../../constants/Colors';

const GenerateTrip = () => {
  const context = useContext(CreateTripContext); // Đảm bảo tripData có kiểu TripDataType
  if (!context) {
    throw new Error('CreateTripContext is null. Make sure the provider is set up correctly.');
  }
  const { tripData, setTripData } = context;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // State to track error
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra nếu dữ liệu chuyến đi không có thì báo lỗi
    if (!tripData) {
      setError('Dữ liệu chuyến đi thiếu!');
    }
  }, [tripData]);

  // Xử lý tạo chuyến đi khi người dùng đã nhập đầy đủ thông tin
  const handleCreateTrip = async () => {
    if (!tripData) {
      setError('Dữ liệu chuyến đi thiếu!');
      return;
    }

    try {
      setLoading(true);
      setError(null); // Reset lỗi khi bắt đầu tạo chuyến đi

      // Bạn có thể gửi tripData tới server của mình để lưu vào database nếu cần
      console.log('Creating Trip with data:', tripData);

      // Giả lập quá trình tạo chuyến đi thành công
      setTimeout(() => {
        setLoading(false);
        router.push('/MyTrip'); // Sau khi tạo chuyến đi thành công, điều hướng người dùng đến trang MyTrip
      }, 2000); // Mô phỏng thời gian tạo chuyến đi
    } catch (error) {
      console.error('Error creating trip:', error);
      setLoading(false);
      setError('Đã có lỗi xảy ra khi tạo chuyến đi, vui lòng thử lại!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đang tạo chuyến đi của bạn...</Text>
      <Text style={styles.paragraph}>Chúng tôi đang xử lý yêu cầu của bạn.</Text>

      {error && <Text style={styles.errorText}>{error}</Text>} {/* Hiển thị lỗi nếu có */}

      <View style={styles.imageContainer}>
        <Image 
          source={require('./../../assets/images/plane.gif')} 
          style={styles.image} 
          resizeMode="contain"
        />
      </View>

      <Text style={styles.paragraph}>Vui lòng đợi...</Text>

      {/* Nút tạo chuyến đi */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateTrip} // Gọi hàm xử lý tạo chuyến đi khi người dùng nhấn
        disabled={loading} // Vô hiệu hóa nút nếu đang trong trạng thái loading
      >
        <Text style={{ color: Colors.white, textAlign: 'center', fontFamily: 'Outfit-Medium', fontSize: 20 }}>
          Tạo Chuyến Đi
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GenerateTrip;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 85,
    padding: 25,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 10,
  },
  paragraph: {
    fontFamily: 'Outfit-Medium',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '70%',
    height: 200,
  },
  errorText: {
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 15,
    marginTop: 40,
  },
});
