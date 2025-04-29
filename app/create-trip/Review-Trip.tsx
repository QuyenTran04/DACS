import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useContext } from 'react';
import { CreateTripContext } from '../../context/CreateTripContext';
import { Colors } from './../../constants/Colors';
import moment from 'moment';

const ReviewTrip = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const context = useContext(CreateTripContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: '',
    });
    
    // Log current context state to debug
    console.log("Current tripData:", context?.tripData);
  }, [navigation, context]);

  // Kiểm tra context có null hay không trước khi sử dụng
  if (!context) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading context...</Text>
      </View>
    );
  }

  const { tripData } = context; // Lấy tripData từ context

  if (!tripData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Đang tải dữ liệu chuyến đi...</Text>
      </View>
    );
  }

  // Format dates if they exist, otherwise use placeholders
  const startDateFormatted = tripData.startDate ? moment(tripData.startDate).format('DD MMM') : 'Not set';
  const endDateFormatted = tripData.endDate ? moment(tripData.endDate).format('DD MMM') : 'Not set';
  const totalDays = tripData.totalNumOfDays || 'Calculating...';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xem Lại Chuyến Đi</Text>

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: 'Outfit-Bold', fontSize: 20 }}>
          Vui lòng xem lại lựa chọn của bạn trước khi tạo chuyến đi.
        </Text>

        {/* Màn hình Địa điểm */}
        <View style={[styles.flex, { marginTop: 20 }]}>
          <Text>📍</Text>
          <View>
            <Text style={{ fontFamily: 'Outfit', fontSize: 20, color: Colors.gray }}>
              Địa điểm
            </Text>
            <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 20 }}>
              {tripData?.locationInfo?.name || 'Chưa chọn địa điểm'}
            </Text>
          </View>
        </View>

        {/* Màn hình Ngày tháng */}
        <View style={styles.flex}>
          <Text>📅</Text>
          <View>
            <Text style={{ fontFamily: 'Outfit', fontSize: 20, color: Colors.gray }}>
              Ngày du lịch
            </Text>
            <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 20 }}>
              {startDateFormatted} TO {endDateFormatted} ({totalDays} Ngày)
            </Text>
          </View>
        </View>

        {/* Màn hình Số người */}
        <View style={styles.flex}>
          <Text>👥</Text>
          <View>
            <Text style={{ fontFamily: 'Outfit', fontSize: 20, color: Colors.gray }}>
              Ai sẽ tham gia
            </Text>
            <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 20 }}>
              {tripData?.traveler?.title || 'Chưa chọn người tham gia'}
            </Text>
          </View>
        </View>

        {/* Màn hình Ngân sách */}
        <View style={styles.flex}>
          <Text>💰</Text>
          <View>
            <Text style={{ fontFamily: 'Outfit', fontSize: 20, color: Colors.gray }}>
              Ngân sách
            </Text>
            <Text style={{ fontFamily: 'Outfit-Medium', fontSize: 20 }}>
              {tripData?.budget || 'Chưa chọn ngân sách'}
            </Text>
          </View>
        </View>
      </View>

      {/* Duy trì tính năng xây dựng chuyến đi */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('../create-trip/Generate-Trip')}
      >
        <Text style={{ color: Colors.white, textAlign: 'center', fontFamily: 'Outfit-Medium', fontSize: 20 }}>
          Xây Dựng Chuyến Đi
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewTrip;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingTop: 85,
    padding: 25,
    height: '100%',
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 10,
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 15,
    marginTop: 40,
  },
});