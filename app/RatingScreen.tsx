import React, { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { styles } from '../components/styles/theme';
import { colors } from '../components/utils/helpers';

export default function RatingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ rideNumber: string }>();
  const { rideNumber } = params;

  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState<string>('');

  const submit = () => {
    Alert.alert('Thanks!', `You rated ${rating} stars`);
    // Navigate to your Tabs screen
    router.replace('./'); // <-- match your TabLayout/index.tsx
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
      <View style={{ width: '95%' }}>
        <Text style={styles.sectionTitle}>Rate your ride</Text>
        <Text>Ride: {rideNumber}</Text>

        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i)} style={{ marginRight: 8 }}>
              <Text style={{ fontSize: 28 }}>{i <= rating ? '★' : '☆'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          placeholder="Optional feedback"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={review}
          onChangeText={setReview}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={submit}>
          <Text style={{ color: '#fff' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
