import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { styles } from '../components/styles/theme';
import { colors } from '../components/utils/helpers';

export default function RideStatus() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    rideNumber: string;
    pickup: string;
    destination: string;
    category: string;
  }>();

  const { rideNumber, pickup, destination, category } = params;

  const [driverAssigned, setDriverAssigned] = useState<boolean>(false);
  const [driver, setDriver] = useState<{ name: string; contact: string; plate: string } | null>(null);
  const [position, setPosition] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDriver({ name: 'Jean Bosco', contact: '+250 78 000 000', plate: 'RAB 123A' });
      setDriverAssigned(true);
      intervalRef.current = setInterval(() => setPosition((p) => Math.min(100, p + 10)), 1200) as unknown as number;
    }, 2000);

    return () => {
      clearTimeout(t);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const cancelRide = () => {
    Alert.alert('Ride canceled');
    router.replace('./'); // go back to your home tabs
  };

  const contactDriver = () => {
    if (driver) Alert.alert('Call', `Call ${driver.contact} (mock)`);
  };

  const emergency = () => {
    Alert.alert('Emergency', 'Emergency services will be contacted (mock)');
  };

  const completeRide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const fare = (Math.random() * 10 + 3).toFixed(2);

    router.replace({
      pathname: './(tabs)/PaymentScreen', // must match your PaymentScreen path
      params: { rideNumber, fare },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
      <View style={{ width: '95%' }}>
        <Text style={styles.sectionTitle}>Ride: {rideNumber}</Text>
        <Text>From: {pickup}</Text>
        <Text>To: {destination}</Text>
        <Text style={{ marginTop: 8 }}>Category: {category}</Text>

        {!driverAssigned ? (
          <View style={{ marginTop: 18 }}>
            <Text>Matching with drivers...</Text>
            <ActivityIndicator style={{ marginTop: 8 }} />
          </View>
        ) : (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontWeight: '600' }}>Driver: {driver?.name}</Text>
            <Text>Plate: {driver?.plate}</Text>
            <Text>Contact: {driver?.contact}</Text>

            <View style={{ marginTop: 12 }}>
              <Text>Driver is {position}% close (mock tracking)</Text>
              <View style={{ height: 12, backgroundColor: '#eee', borderRadius: 6, overflow: 'hidden', marginTop: 6 }}>
                <View style={{ width: `${position}%`, height: '100%', backgroundColor: colors.accent }} />
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={[styles.smallButton, { backgroundColor: '#fff', borderColor: colors.primary, borderWidth: 1 }]}
                onPress={cancelRide}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton} onPress={contactDriver}>
                <Text style={{ color: '#fff' }}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallButton, { backgroundColor: '#ff4d4f' }]} onPress={emergency}>
                <Text style={{ color: '#fff' }}>Emergency</Text>
              </TouchableOpacity>
            </View>

            {position >= 100 && (
              <TouchableOpacity style={[styles.primaryButton, { marginTop: 18 }]} onPress={completeRide}>
                <Text style={{ color: '#fff' }}>Start / Complete Ride</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
