import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import Login from './../components/Login';
import { CreateTripContext } from '@/context/CreateTripContext';

export default function Index() {
  const context = useContext(CreateTripContext);
  const tripData = context?.tripData || {};
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (tripData && 'user' in tripData && tripData.user) {
      router.push('/MyTrip');
    }
  }, [tripData, router]);

  return (
    <View style={styles.container}>
      {!(tripData && 'user' in tripData && tripData.user) ? <Login /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});