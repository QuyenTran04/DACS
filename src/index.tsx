// screens/HomeScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigation = useNavigation();

  const handleSearch = () => {
    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chào mừng đến với GoGlobal</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm điểm đến..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Tìm kiếm" onPress={handleSearch} />
      <View style={styles.popularDestinations}>
        <Text style={styles.sectionTitle}>Điểm đến phổ biến</Text>
        {/* Danh sách điểm đến phổ biến */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  popularDestinations: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default HomeScreen;
