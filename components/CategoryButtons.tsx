import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/Colors';

// Khai báo prop `onCategoryChanged` để component có thể nhận props
interface CategoryButtonsProps {
  onCategoryChanged: (category: string) => void;
}

const categories = ['Tất cả', 'Tham quan', 'Ẩm thực', 'Văn hóa', 'Mạo hiểm', 'Nghỉ dưỡng', 'Mua sắm'];

const CategoryButtons: React.FC<CategoryButtonsProps> = ({ onCategoryChanged }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useRef<ScrollView>(null);
  const itemRefs = useRef<(React.ElementRef<typeof TouchableOpacity> | null)[]>([]);

  const handleCategoryPress = (index: number) => {
    const selected = itemRefs.current[index];
    if (selected) {
      selected.measure(
        (x, y, width, height, pageX, pageY) => {
          scrollRef.current?.scrollTo({ x: pageX - 100, y: 0, animated: true });
        }
      );
    }
    onCategoryChanged(categories[index]);  // Gọi hàm truyền vào để thay đổi danh mục
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: Colors[colorScheme].background,
      }}
    >
      {categories.map((category, index) => (
        <TouchableOpacity
          key={category}  // Sử dụng category làm key thay vì index để tránh các lỗi khi dữ liệu thay đổi
          ref={(ref) => (itemRefs.current[index] = ref)}
          onPress={() => handleCategoryPress(index)}
          style={{
            marginRight: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: Colors[colorScheme].tint,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: Colors[colorScheme].background,
            fontWeight: 'bold',
            fontSize: 14,
          }}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryButtons;
