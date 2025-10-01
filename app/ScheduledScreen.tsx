// src/screens/ScheduledScreen.tsx
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { styles } from '../components/styles/theme';

export default function ScheduledScreen() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f6fbf9' }]}>
      <Text style={styles.sectionTitle}>Scheduled Rides</Text>
      <Text style={{ marginTop: 8 }}>No scheduled rides (demo)</Text>
    </SafeAreaView>
  );
}
