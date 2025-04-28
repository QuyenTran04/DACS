import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Use useRouter for navigation
import OptionTravelCard from './../../components/CreateTrip/OptionTravelCard';
import { CreateTripContext } from '../../context/CreateTripContext';
import { selectTravelersList } from './../../constants/data';
import { Colors } from '@/constants/Colors';

const ChonNguoiDi = () => {
  const router = useRouter();
  const [selectedTravelerId, setSelectedTravelerId] = useState<string | null>(null);
  const context = useContext(CreateTripContext);

  if (!context) {
    return <Text>Lỗi: CreateTripContext không có sẵn</Text>;
  }

  const { tripData, setTripData } = context;

  useEffect(() => {
    if (selectedTravelerId && tripData) {
      const selectedTraveler = selectTravelersList.find(item => item.id === Number(selectedTravelerId));
      if (selectedTraveler && selectedTraveler.title !== tripData.traveler?.title) {
        setTripData({
          ...tripData,
          traveler: { title: selectedTraveler.title },
        });
      }
    }
  }, [selectedTravelerId, tripData, setTripData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ai sẽ đi?</Text>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.subTitle}>Chọn người đi cùng</Text>
        <FlatList
          data={selectTravelersList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{ marginVertical: 10 }}
              onPress={() => setSelectedTravelerId(String(item.id))}
            >
              <OptionTravelCard
                option={item}
                selectedOption={selectedTravelerId ? { id: Number(selectedTravelerId) } : null}
              />
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id.toString()}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/create-trip/Select-Dates')}
      >
        <Text style={{ color: Colors.white, textAlign: 'center', fontFamily: 'Outfit-Medium', fontSize: 20 }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChonNguoiDi;

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
  subTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 23,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
});