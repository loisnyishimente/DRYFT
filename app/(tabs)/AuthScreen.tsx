// src/screens/AuthScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { styles } from '../../components/styles/theme';
import { colors } from '../../components/utils/helpers';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  const [isRegister, setIsRegister] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');

  const sendOtp = () => {
    if (!email && !phone) {
      Alert.alert('Provide email or phone');
      return;
    }
    setOtpSent(true);
    Alert.alert('OTP sent (mock)', 'Code: 1234');
  };

  const verifyOtp = () => {
    if (otp === '1234') {
      Alert.alert('Success', isRegister ? 'Account created' : 'Logged in');
      navigation.replace('HomeTabs');
    } else {
      Alert.alert('Invalid OTP', 'Use 1234 in this demo');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ width: '90%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => setIsRegister(true)}>
            <Text style={[styles.toggle, isRegister && styles.toggleActive]}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsRegister(false)}>
            <Text style={[styles.toggle, !isRegister && styles.toggleActive]}>Login</Text>
          </TouchableOpacity>
        </View>

        {isRegister && (
          <TextInput
            placeholder="Full name"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Phone"
          placeholderTextColor={colors.muted}
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {!otpSent ? (
          <TouchableOpacity style={styles.primaryButton} onPress={sendOtp}>
            <Text style={{ color: '#fff' }}>Send Verification Code</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              placeholder="Enter OTP (mock: 1234)"
              placeholderTextColor={colors.muted}
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.primaryButton} onPress={verifyOtp}>
              <Text style={{ color: '#fff' }}>Verify</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
