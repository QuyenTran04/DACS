import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const StartNewTripCard = () => {
  const router = useRouter();
  return (
    <View style={styles.mainView}>
      <Entypo name="location" size={24} color="black" />
      <Text style={styles.title}>Chưa có kế hoạch chuyến đi</Text>
      <Text style={styles.paragraph}>
        Đã đến lúc lên kế hoạch cho chuyến đi mới! Thế giới đầy những cuộc phiêu lưu, và tôi rất háo hức khám phá!
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/create-trip/Search-Place')} // Sửa lại dấu gạch chéo
      >
        <Text style={{ textAlign: 'center', color: Colors.white, fontFamily: 'Outfit-Medium', fontSize: 17 }}>
          Bắt đầu chuyến đi mới
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartNewTripCard;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: Colors.white,
    marginTop: 50,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 25,
  },
  title: {
    fontFamily: 'Outfit-Medium',
    fontSize: 25,
    marginTop: 10,
  },
  paragraph: {
    fontFamily: 'Outfit',
    fontSize: 20,
    textAlign: 'center',
    color: Colors.gray,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    paddingHorizontal: 30,
  },
});
