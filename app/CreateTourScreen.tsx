import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToFirebase } from "../config/uploadImage";

interface TourData {
  title: string;
  description: string;
  address: string;
  locationId: string;
  price: number;
  duration: number;
  maxGuests: number;
  availableDates: string[];
  images: string[];
}

export default function CreateTourScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [maxGuests, setMaxGuests] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<string>("2025-06-01");
  const [locationId, setLocationId] = useState<string>("6635df..."); // bạn sẽ lấy từ danh sách location thực tế
  const [images, setImages] = useState<string[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uris = result.assets?.map((asset) => asset.uri) || [];
      setImages((prev) => [...prev, ...uris]);
    }
  };

  const handleCreateTour = async () => {
    try {
      const imageUrls = await Promise.all(
        images.map((uri) => uploadImageToFirebase(uri))
      );

      const tourData: TourData = {
        title,
        description,
        address,
        locationId,
        price: parseInt(price),
        duration: parseInt(duration),
        maxGuests: parseInt(maxGuests),
        availableDates: [availableDates],
        images: imageUrls,
      };

      const response = await fetch(
        "http://192.168.1.6:5000/api/tour/createTour",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tourData),
        }
      );

      const result = await response.json();
      if (response.ok) {
        Alert.alert("Thành công", result.message);
      } else {
        Alert.alert("Lỗi", result.message || "Tạo tour thất bại");
      }
    } catch (error: any) {
      Alert.alert(" Lỗi", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Giá (VND)</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Số ngày</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Số khách tối đa</Text>
      <TextInput
        style={styles.input}
        value={maxGuests}
        onChangeText={setMaxGuests}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Ngày khả dụng</Text>
      <TextInput
        style={styles.input}
        value={availableDates}
        onChangeText={setAvailableDates}
      />

      <Button title="Chọn ảnh" onPress={pickImage} />

      <ScrollView horizontal style={{ marginVertical: 10 }}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.imagePreview} />
        ))}
      </ScrollView>

      <Button title="Tạo tour" onPress={handleCreateTour} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: "bold", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
});
