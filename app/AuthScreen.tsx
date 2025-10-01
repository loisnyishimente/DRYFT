import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../components/styles/theme';
import { colors } from '../components/utils/helpers';

const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Form transition animation
    Animated.spring(formAnim, {
      toValue: otpSent ? 1 : 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [otpSent]);

  const sendOtp = () => {
    if (!email && !phone) {
      Alert.alert('Missing Information', 'Please provide email or phone number');
      return;
    }
    Keyboard.dismiss();
    setOtpSent(true);
    Alert.alert('Verification Code Sent', 'Use code: 1234 for demo');
  };

  const verifyOtp = () => {
    if (otp === '1234') {
      Alert.alert('Success', isRegister ? 'Account created successfully!' : 'Welcome back!');
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Invalid Code', 'Please use 1234 in this demo');
    }
  };

  const toggleAuthMode = (register: boolean) => {
    setIsRegister(register);
    setOtpSent(false);
    setOtp('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={{
              width: '90%',
              maxWidth: 400,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Header Section */}
            <View style={{ marginBottom: 40, alignItems: 'center' }}>
              <Text style={{
                fontSize: 32,
                fontWeight: 'bold',
                color: colors.primary,
                marginBottom: 8,
                letterSpacing: 1,
              }}>
                DRYFT
              </Text>
              <Text style={{
                fontSize: 16,
                color: colors.muted,
                textAlign: 'center',
              }}>
                {isRegister ? 'Create your account' : 'Welcome back'}
              </Text>
            </View>

            {/* Toggle Buttons */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: colors.muted + '20',
              borderRadius: 12,
              padding: 4,
              marginBottom: 30,
            }}>
              <TouchableOpacity 
                onPress={() => toggleAuthMode(true)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: isRegister ? colors.primary : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: isRegister ? '#fff' : colors.muted,
                  fontWeight: isRegister ? '600' : '400',
                  fontSize: 15,
                }}>
                  Register
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => toggleAuthMode(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 10,
                  backgroundColor: !isRegister ? colors.primary : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: !isRegister ? '#fff' : colors.muted,
                  fontWeight: !isRegister ? '600' : '400',
                  fontSize: 15,
                }}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={{ gap: 16 }}>
              {isRegister && (
                <View>
                  <Text style={{
                    fontSize: 13,
                    color: colors.muted,
                    marginBottom: 6,
                    marginLeft: 4,
                    fontWeight: '500',
                  }}>
                    Full Name
                  </Text>
                  <TextInput
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.muted + '80'}
                    style={[styles.input, {
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: colors.muted + '30',
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 15,
                    }]}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              )}
              
              <View>
                <Text style={{
                  fontSize: 13,
                  color: colors.muted,
                  marginBottom: 6,
                  marginLeft: 4,
                  fontWeight: '500',
                }}>
                  Email
                </Text>
                <TextInput
                  placeholder="your@email.com"
                  placeholderTextColor={colors.muted + '80'}
                  style={[styles.input, {
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: colors.muted + '30',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 15,
                  }]}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text style={{
                  fontSize: 13,
                  color: colors.muted,
                  marginBottom: 6,
                  marginLeft: 4,
                  fontWeight: '500',
                }}>
                  Phone Number
                </Text>
                <TextInput
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor={colors.muted + '80'}
                  style={[styles.input, {
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: colors.muted + '30',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 15,
                  }]}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {otpSent && (
                <Animated.View style={{
                  opacity: formAnim,
                  transform: [{
                    translateY: formAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  }],
                }}>
                  <Text style={{
                    fontSize: 13,
                    color: colors.muted,
                    marginBottom: 6,
                    marginLeft: 4,
                    fontWeight: '500',
                  }}>
                    Verification Code
                  </Text>
                  <TextInput
                    placeholder="Enter 6-digit code"
                    placeholderTextColor={colors.muted + '80'}
                    style={[styles.input, {
                      backgroundColor: '#fff',
                      borderWidth: 1,
                      borderColor: colors.accent + '50',
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 15,
                      letterSpacing: 4,
                      textAlign: 'center',
                      fontWeight: '600',
                    }]}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </Animated.View>
              )}
            </View>

            {/* Action Button */}
            <TouchableOpacity 
              style={[styles.primaryButton, {
                marginTop: 30,
                backgroundColor: colors.primary,
                borderRadius: 12,
                paddingVertical: 16,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }]}
              onPress={otpSent ? verifyOtp : sendOtp}
            >
              <Text style={{ 
                color: '#fff', 
                fontSize: 16, 
                fontWeight: '600',
                letterSpacing: 0.5,
              }}>
                {otpSent ? 'Verify & Continue' : 'Send Verification Code'}
              </Text>
            </TouchableOpacity>

            {otpSent && (
              <TouchableOpacity 
                onPress={() => setOtpSent(false)}
                style={{ marginTop: 16, alignItems: 'center' }}
              >
                <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '500' }}>
                  Resend Code
                </Text>
              </TouchableOpacity>
            )}

            {/* Footer */}
            <Text style={{
              textAlign: 'center',
              color: colors.muted,
              fontSize: 12,
              marginTop: 30,
              lineHeight: 18,
            }}>
              By continuing, you agree to our{'\n'}
              <Text style={{ color: colors.primary, fontWeight: '500' }}>Terms of Service</Text>
              {' & '}
              <Text style={{ color: colors.primary, fontWeight: '500' }}>Privacy Policy</Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}