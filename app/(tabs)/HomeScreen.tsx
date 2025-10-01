// src/screens/HomeScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { styles } from '../../components/styles/theme';
import { genRideNumber } from '../../components/utils/helpers';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, HomeTabParamList } from '../../components/navigation/types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Correct Props type: Bottom Tab + Stack navigation for nested stack screens
type Props = BottomTabScreenProps<HomeTabParamList> & {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export default function HomeScreen({ navigation }: Props) {
  const [pickup, setPickup] = useState<string>('Current location (GPS)');
  const [destination, setDestination] = useState<string>('');
  const [category, setCategory] = useState<string>('Economy');

  const categories = ['Economy', '7-Seater', 'Mid-Luxury', 'Corporate/Executive'];

  const confirmRide = () => {
    if (!destination) {
      Alert.alert('Enter a destination');
      return;
    }

    const rideNumber = genRideNumber();

    // Navigate to Stack screen from Tab
    navigation.navigate('RideStatus', {
      rideNumber,
      pickup,
      destination,
      category,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f6fbf9' }]}>
      <View style={{ width: '95%' }}>
        <Text style={styles.sectionTitle}>Where to?</Text>
        <TextInput style={styles.input} value={pickup} onChangeText={setPickup} />
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={destination}
          onChangeText={setDestination}
        />

        <Text style={{ marginTop: 8, marginBottom: 6 }}>Choose vehicle category</Text>
        <FlatList
          data={categories}
          horizontal
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setCategory(item)}
              style={[styles.categoryCard, category === item && { borderColor: '#00C16A', borderWidth: 2 }]}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={{ marginTop: 14 }}>
          <TouchableOpacity style={styles.primaryButton} onPress={confirmRide}>
            <Text style={{ color: '#fff' }}>Confirm Ride</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
