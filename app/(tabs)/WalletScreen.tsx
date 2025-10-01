// src/screens/WalletScreen.tsx
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { styles } from '../../components/styles/theme';

export default function WalletScreen() {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
      <Text style={styles.sectionTitle}>Wallet & Payments</Text>
      <Text style={{ marginTop: 8 }}>Add a card or mobile money (demo)</Text>
    </SafeAreaView>
  );
}
