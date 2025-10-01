// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, Text, ActivityIndicator } from 'react-native';
import { styles } from '../../components/styles/theme';
import { colors } from '../../components/utils/helpers';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Welcome'), 1800);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.center, { backgroundColor: colors.primary, flex: 1 }]}>
      <Text style={styles.logo}>DRYFT</Text>
      <Text style={styles.slogan}>The smarter way to move</Text>
      <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 20 }} />
    </SafeAreaView>
  );
}
