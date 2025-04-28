import { StyleSheet, Text, View, Image } from 'react-native';
import moment from 'moment';
import { Colors } from './../../constants/Colors';

interface Trip {
  tripData?: string;
  tripPlan?: {
    travel_plan?: {
      destination?: string;
    };
  };
}
const UserTripCard = ({ trip }: { trip: Trip }) => {
  const formatData = (data: string | undefined) => {
    try {
      return JSON.parse(data ?? '{}');
    } catch (error) {
      console.error('Error parsing data:', error);
      return null;
    }
  };

  const tripData = formatData(trip?.tripData);

  // Không sử dụng API Google Map nữa
  const imageUrl = tripData?.locationInfo?.photoRef 
    ? `https://example.com/images/${tripData?.locationInfo?.photoRef}.jpg` // Thay thế bằng link ảnh khác nếu cần
    : null;

  return (
    <View style={styles.flexContainer}>
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image} 
        />
      ) : (
        <Image 
          source={require('./../../assets/images/travel.jpg')} 
          style={styles.image} 
        />
      )}
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.paragraph}>
          {trip?.tripPlan?.travel_plan?.destination}
        </Text>
        <Text style={styles.smallPara}>
          {moment(tripData?.startDate).format("DD MMM YYYY")}
        </Text>
        <Text style={styles.smallPara}>
          Travelling: {tripData?.traveler?.title}
        </Text>
      </View>
    </View>
  );
};

export default UserTripCard;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  flexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  paragraph: {
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
  },
  smallPara: {
    fontFamily: 'Outfit',
    fontSize: 14,
    color: Colors.gray,
  },
});
