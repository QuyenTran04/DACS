import { StyleSheet, Text, View } from 'react-native';
import { Colors } from './../../constants/Colors';

interface OptionTravelCardProps {
    option: { id: number; title: string; desc: string; icon: string };
    selectedOption?: { id: number } | null;
  }

const OptionTravelCard = ({ option, selectedOption }: OptionTravelCardProps) => {
  const isSelected = selectedOption?.id === option?.id;

  return (
    <View style={[
      styles.container,
      { borderWidth: isSelected ? 3 : 0, borderColor: Colors.primary }
    ]}>
      <View>
        <Text style={styles.title}>{option.title}</Text>
        <Text style={styles.desc}>{option.desc}</Text>
      </View>
      <Text style={styles.icon}>{option.icon}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 25,
    backgroundColor: Colors.lightGray,
    borderRadius: 15,
  },
  title: {
    fontFamily: 'Outfit-Bold',
    fontSize: 20,
  },
  desc: {
    fontFamily: 'Outfit',
    fontSize: 17,
    color: Colors.gray,
  },
  icon: {
    fontSize: 35,
  },
});

export default OptionTravelCard;
