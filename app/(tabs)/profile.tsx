// src/screens/ProfileScreen.tsx
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { styles } from '../../components/styles/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
      <Text style={styles.sectionTitle}>Profile</Text>
      <Text style={{ marginTop: 8 }}>Edit profile and settings (demo)</Text>
    </SafeAreaView>
  );
}
