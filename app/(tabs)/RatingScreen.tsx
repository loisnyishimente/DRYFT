// src/screens/RatingScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { styles } from '../../components/styles/theme';
import { colors } from '../../components/utils/helpers';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Rating'>;

export default function RatingScreen({ route, navigation }: Props) {
  const { rideNumber } = route.params;
  const [rating, setRating] = useState<number>(5);
  const [review, setReview] = useState<string>('');

  const submit = () => {
    Alert.alert('Thanks!', `You rated ${rating} stars`);
    navigation.replace('HomeTabs');
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

        <TextInput placeholder="Optional feedback" placeholderTextColor={colors.muted} style={styles.input} value={review} onChangeText={setReview} />
        <TouchableOpacity style={styles.primaryButton} onPress={submit}>
          <Text style={{ color: '#fff' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
