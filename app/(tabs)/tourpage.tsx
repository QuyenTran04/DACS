import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CategoryButtons from '@/components/CategoryButtons'
import Listings from '@/components/Listings'
import { Ionicons } from '@expo/vector-icons'
import { useHeaderHeight } from '@react-navigation/elements'
import { Stack } from 'expo-router'
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

const TourPage = () => {
  const headerHeight = useHeaderHeight()
  const [category, setCategory] = useState('Tất cả')
  const [tourList, setTourList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  // Lấy danh sách tour từ API
  const fetchTourList = async () => {
    try {
      const response = await axios.get('http://192.168.1.6:5000/api/tour/listTour')
      setTourList(response.data)  // Giả sử API trả về danh sách tour
      setLoading(false)
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu tour:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTourList()  // Gọi API khi trang được tải
  }, [])

  const onCatChanged = (category: string) => {
    console.log('Danh mục: ', category)
    setCategory(category)
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity onPress={() => {}} style={styles.avatarWrapper}>
              <Image
                source={{
                  uri: 'https://xsgames.co/randomusers/avatar.php?g=male',
                }}
                style={styles.avatarImage}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => {}} style={styles.notificationBtn}>
              <Ionicons name="notifications" size={20} color="#ffffff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={[styles.container, { paddingTop: headerHeight }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.headingTxt}>Chọn tour theo danh mục</Text>

          <View style={styles.searchSectionWrapper}>
            <View style={styles.searchBar}>
              <Ionicons
                name="search"
                size={18}
                style={styles.searchIcon}
                color="#8b5cf6"
              />
              <TextInput placeholder="Tìm kiếm..." style={styles.searchInput} />
            </View>
            <TouchableOpacity onPress={() => {}} style={styles.filterBtn}>
              <Ionicons name="options" size={28} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <CategoryButtons onCategoryChanged={onCatChanged} />

          {loading ? (
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          ) : (
            <Listings listings={tourList} category={category} />
          )}
        </ScrollView>
      </View>
    </>
  )
}

export default TourPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f7f7f7',  // Màu nền sáng hơn, dễ nhìn
  },
  headingTxt: {
    fontSize: 30,
    fontWeight: '700',
    color: '#8b5cf6',
    marginVertical: 15,
    textAlign: 'center',
  },
  searchSectionWrapper: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  filterBtn: {
    backgroundColor: '#8b5cf6',
    padding: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  notificationBtn: {
    marginRight: 20,
    backgroundColor: '#8b5cf6',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#171717',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  loadingText: {
    color: '#8b5cf6',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  avatarWrapper: {
    marginLeft: 20,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
})
