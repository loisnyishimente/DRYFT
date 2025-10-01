// src/screens/PaymentScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../../components/styles/theme';
import { colors } from '../../components/utils/helpers';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

export default function PaymentScreen({ route, navigation }: Props) {
  const { rideNumber, fare } = route.params;
  const [method, setMethod] = useState<string>('Mobile Money');

  const pay = () => {
    Alert.alert('Payment Success', `Paid ${fare} via ${method}`);
    navigation.replace('Rating', { rideNumber });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
      <View style={{ width: '95%' }}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <Text>Ride: {rideNumber}</Text>
        <Text style={{ marginTop: 8 }}>Fare: ${fare}</Text>

        <Text style={{ marginTop: 12 }}>Choose Payment Method</Text>
        <TouchableOpacity style={[styles.pill, method === 'Mobile Money' && { borderColor: colors.accent, borderWidth: 2 }]} onPress={() => setMethod('Mobile Money')}>
          <Text>Mobile Money</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.pill, method === 'Card' && { borderColor: colors.accent, borderWidth: 2 }]} onPress={() => setMethod('Card')}>
          <Text>Credit/Debit Card</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.primaryButton, { marginTop: 18 }]} onPress={pay}>
          <Text style={{ color: '#fff' }}>Pay ${fare}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
