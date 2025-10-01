// src/screens/Welcome.tsx
import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import PrimaryButton from '../../components/Primarybutton';
import { styles } from '../../components/styles/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function Welcome({ navigation }: Props) {
  return (
    <SafeAreaView style={[styles.container, { justifyContent: 'center', backgroundColor: '#0b2f2a' }]}>
      <Text style={styles.welcomeTitle}>Welcome to Dryft</Text>
      <Text style={styles.welcomeText}>Fast. Safe. Comfortable.</Text>
      <PrimaryButton title="Get Started" onPress={() => navigation.navigate('Auth')} style={{ width: 200 }} />
    </SafeAreaView>
  );
}
