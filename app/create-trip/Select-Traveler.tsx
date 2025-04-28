import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, Link } from 'expo-router';
import OptionTravelCard from './../../components/CreateTrip/OptionTravelCard';
import { CreateTripContext } from '../../context/CreateTripContext';
import { selectTravelersList } from './../../constants/data';
import { Colors } from '@/constants/Colors';

const SelectTraveler = () => {
  const navigation = useNavigation();
  const [selectedTravelerId, setSelectedTravelerId] = useState<string | null>(null);
  const context = useContext(CreateTripContext);

  if (!context) {
    return <Text>Error: CreateTripContext is not available</Text>;
  }

  const { tripData, setTripData } = context;

  // Kiểm tra tripData có null không trước khi truy cập
  useEffect(() => {
    if (selectedTravelerId && tripData) {
      const selectedTraveler = selectTravelersList.find(item => item.id === Number(selectedTravelerId));
      setTripData({
        ...tripData,
        traveler: selectedTraveler ? { title: selectedTraveler.title } : undefined,
      });
    }
  }, [selectedTravelerId, tripData, setTripData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who's traveling?</Text>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.subTitle}>Choose Your Travelers</Text>
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

      <TouchableOpacity style={styles.button}>
        <Link href="/create-trip/Select-Dates" style={{ textAlign: 'center' }}>
          <Text style={{ color: Colors.white, textAlign: 'center', fontFamily: 'Outfit-Medium', fontSize: 20 }}>
            Continue
          </Text>
        </Link>
      </TouchableOpacity>
    </View>
  );
};

export default SelectTraveler;

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
