import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateTrip } from '@/context/CreateTripContext';
import { Colors } from '@/constants/Colors';

const locations = [
  { name: 'Hà Nội', coordinate: { lat: 21.0285, lng: 105.8542 } },
  { name: 'Đà Nẵng', coordinate: { lat: 16.0544, lng: 108.2022 } },
  { name: 'TP.HCM', coordinate: { lat: 10.7769, lng: 106.7009 } },
  { name: 'Nha Trang', coordinate: { lat: 12.2388, lng: 109.1967 } },
];

const SearchPlace = () => {
  const router = useRouter();
  const { tripData, setTripData } = useCreateTrip();

  const handleSelectLocation = (location: typeof locations[0]) => {
    setTripData({
      ...tripData!,
      locationInfo: {
        name: location.name,
        coordinate: location.coordinate,
      },
    });
    router.push('/create-trip/Select-Traveler');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn điểm đến của bạn</Text>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelectLocation(item)}>
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchPlace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  item: {
    backgroundColor: Colors.lightGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 18,
  },
});
