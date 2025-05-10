// components/Listings.tsx
import React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { Colors } from "@/constants/Colors";

const Listings = ({ listings, category }: { listings: any[], category: string }) => {
  const filteredListings = category === 'Tất cả'
    ? listings
    : listings.filter(item => item.category === category)

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.price} VND</Text>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  listItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default Listings
