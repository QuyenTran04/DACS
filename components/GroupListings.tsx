import { Colors } from "@/constants/Colors"
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
  useColorScheme, // Hook để xác định chế độ sáng/tối
} from 'react-native'

export interface GroupType {
  id: string
  name: string
  image: string
  rating: number
  reviews: number
}

interface GroupListingsProps {
  listings: GroupType[]
}

const GroupListings = ({ listings }: GroupListingsProps) => {
  // Lấy chế độ màu sắc hiện tại (sáng/tối)
  const colorScheme = useColorScheme()

  // Sử dụng các màu phù hợp với chế độ sáng/tối
  const currentColors = Colors[colorScheme || 'light']

  const renderItem: ListRenderItem<GroupType> = ({ item }) => {
    return (
      <View style={styles.item}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View>
          <Text style={[styles.itemTxt, { color: currentColors.text }]}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color={currentColors.tint} />
            <Text style={[styles.itemRating, { color: currentColors.text }]}>{item.rating}</Text>
            <Text style={styles.itemReviews}>({item.reviews})</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <Text style={[styles.title, { color: currentColors.text }]}>Top Travel Groups</Text>
      <FlatList
        data={listings}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

export default GroupListings

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  itemTxt: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  itemRating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  itemReviews: {
    fontSize: 14,
    color: '#999',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
