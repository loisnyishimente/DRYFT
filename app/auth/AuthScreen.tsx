import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
    View,
    ActivityIndicator
} from 'react-native';
import { colors } from '../../components/utils/helpers';

const { width } = Dimensions.get('window');

const API_BASE_URL = 'http://149.28.202.162:9090/api/v1';


const fetchWithTimeout = async (url: string, options: any = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export default function AuthScreen() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [showPinSetup, setShowPinSetup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [verificationId, setVerificationId] = useState<string>('');
  const [sentCode, setSentCode] = useState<string>(''); // Store code from backend response

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
    Animated.spring(formAnim, {
      toValue: otpSent ? 1 : 0,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [otpSent]);

  // API call to send verification code
  const sendOtp = async () => {
    if (!email && !phone) {
      Alert.alert('Missing Information', 'Please provide email or phone number');
      return;
    }

    if (isRegister && !name.trim()) {
      Alert.alert('Missing Information', 'Please provide your full name');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      console.log('🚀 Attempting to send OTP to:', `${API_BASE_URL}/auth/send-verification`);
      console.log('📦 Request body:', {
        name: isRegister ? name : undefined,
        email: email || undefined,
        phone: phone || undefined,
        type: isRegister ? 'register' : 'login',
      });

      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: isRegister ? name : undefined,
          email: email || undefined,
          phone: phone || undefined,
          type: isRegister ? 'register' : 'login',
        }),
      }, 15000); // 15 second timeout

      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📥 Response data:', data);

      if (response.ok) {
        setVerificationId(data.verificationId || data.id);
        setOtpSent(true);
        Alert.alert('Success', 'Verification code sent successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to send verification code');
      }
    } catch (error: any) {
      console.error('❌ Send OTP error:', error);
      
      let errorMessage = 'Network error. Please try again.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your internet connection.';
      } else if (error.message?.includes('Network request failed')) {
        errorMessage = 'Cannot connect to server. Please check:\n\n1. Your internet connection\n2. The API URL is correct\n3. The server is running';
      }
      
      Alert.alert('Connection Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // API call to resend verification code
  const resendOtp = async () => {
    setLoading(true);

    try {
      console.log('🔄 Resending OTP...');
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email || undefined,
          phone: phone || undefined,
          verificationId,
        }),
      }, 15000);

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Verification code resent successfully!');
      } else {
        Alert.alert('Error', data.message || 'Failed to resend verification code');
      }
    } catch (error: any) {
      console.error('❌ Resend OTP error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // API call to verify OTP
  const verifyOtp = async () => {
    if (otp.length < 4) {
      Alert.alert('Invalid Code', 'Please enter a valid verification code');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      console.log('🔐 Verifying OTP...');
      
      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email || undefined,
          phone: phone || undefined,
          code: otp,
          verificationId,
        }),
      }, 15000);

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          // For registration, show PIN setup
          setShowPinSetup(true);
        } else {
          // For login, store token and navigate
          // await AsyncStorage.setItem('authToken', data.token);
          Alert.alert('Success', 'Welcome back!');
          router.replace('/home');
        }
      } else {
        Alert.alert('Error', data.message || 'Invalid verification code');
      }
    } catch (error: any) {
      console.error('❌ Verify OTP error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // API call to complete registration with PIN
  const completeRegistration = async () => {
    if (pin.length < 4) {
      Alert.alert('Invalid PIN', 'Please enter a 4-digit PIN');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('PIN Mismatch', 'PINs do not match. Please try again.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/passenger/complete-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email || undefined,
          phone: phone || undefined,
          name,
          pin,
          verificationId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token
        // await AsyncStorage.setItem('authToken', data.token);
        Alert.alert('Success', 'Account created successfully!');
        router.replace('/home');
      } else {
        Alert.alert('Error', data.message || 'Failed to complete registration');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please check your connection.');
      console.error('Complete registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = (register: boolean) => {
    setIsRegister(register);
    setOtpSent(false);
    setOtp('');
    setShowPinSetup(false);
    setPin('');
    setConfirmPin('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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
              maxWidth: 420,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Header */}
            <View style={{ marginBottom: 40, alignItems: 'center' }}>
              <Text style={{
                fontSize: 40,
                fontWeight: '900',
                color: colors.primary,
                letterSpacing: 2,
                textShadowColor: colors.primary + '40',
                textShadowOffset: { width: 0, height: 4 },
                textShadowRadius: 8,
              }}>
                DRYFT
              </Text>
              <Text style={{
                fontSize: 17,
                color: colors.muted,
                textAlign: 'center',
                fontWeight: '500',
                marginTop: 6,
              }}>
                {showPinSetup ? 'Setup your PIN' : isRegister ? 'Create your account' : 'Welcome back'}
              </Text>
              
              {/* Test Connection Button - Remove in production */}
              {__DEV__ && !otpSent && !showPinSetup && (
                <TouchableOpacity 
                  onPress={async () => {
                    try {
                      console.log('🧪 Testing connection to:', API_BASE_URL);
                      const response = await fetchWithTimeout(`${API_BASE_URL}/auth/send-verification`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Accept': 'application/json',
                        },
                        body: JSON.stringify({ test: true }),
                      }, 5000);
                      Alert.alert('Connection Test', `Server responded with status: ${response.status}`);
                    } catch (error: any) {
                      Alert.alert('Connection Test Failed', error.message);
                      console.error('Test error:', error);
                    }
                  }}
                  style={{ marginTop: 10, padding: 8 }}
                >
                  <Text style={{ fontSize: 11, color: colors.muted }}>
                    🧪 Test Server Connection
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {!otpSent && !showPinSetup && (
              <>
                {/* Toggle Buttons */}
                <View style={{
                  flexDirection: 'row',
                  backgroundColor: colors.muted + '18',
                  borderRadius: 30,
                  padding: 4,
                  marginBottom: 30,
                }}>
                  <TouchableOpacity 
                    onPress={() => toggleAuthMode(true)}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 25,
                      backgroundColor: isRegister ? colors.primary : 'transparent',
                      alignItems: 'center',
                      shadowColor: isRegister ? colors.primary : 'transparent',
                      shadowOpacity: isRegister ? 0.25 : 0,
                      shadowRadius: 6,
                      elevation: isRegister ? 3 : 0,
                    }}
                  >
                    <Text style={{
                      color: isRegister ? '#fff' : colors.muted,
                      fontWeight: '600',
                      fontSize: 15,
                    }}>
                      Register
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => toggleAuthMode(false)}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      borderRadius: 25,
                      backgroundColor: !isRegister ? colors.primary : 'transparent',
                      alignItems: 'center',
                      shadowColor: !isRegister ? colors.primary : 'transparent',
                      shadowOpacity: !isRegister ? 0.25 : 0,
                      shadowRadius: 6,
                      elevation: !isRegister ? 3 : 0,
                    }}
                  >
                    <Text style={{
                      color: !isRegister ? '#fff' : colors.muted,
                      fontWeight: '600',
                      fontSize: 15,
                    }}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {/* Form Fields */}
            {!showPinSetup && (
              <View style={{ gap: 18 }}>
                {isRegister && !otpSent && (
                  <InputField
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={setName}
                  />
                )}
                {!otpSent && (
                  <>
                    <InputField
                      label="Email"
                      placeholder="name@email.com"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                    />
                    <InputField
                      label="Phone Number"
                      placeholder="+250-000-0000"
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </>
                )}

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
                    <InputField
                      label="Verification Code"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="number-pad"
                      maxLength={6}
                      center
                    />
                  </Animated.View>
                )}
              </View>
            )}

            {/* PIN Setup Form */}
            {showPinSetup && (
              <View style={{ gap: 18 }}>
                <InputField
                  label="Create PIN"
                  placeholder="Enter 4-digit PIN"
                  value={pin}
                  onChangeText={setPin}
                  keyboardType="number-pad"
                  maxLength={4}
                  center
                  secureTextEntry
                />
                <InputField
                  label="Confirm PIN"
                  placeholder="Re-enter PIN"
                  value={confirmPin}
                  onChangeText={setConfirmPin}
                  keyboardType="number-pad"
                  maxLength={4}
                  center
                  secureTextEntry
                />
              </View>
            )}

            {/* Action Button */}
            <TouchableOpacity 
              onPress={showPinSetup ? completeRegistration : otpSent ? verifyOtp : sendOtp}
              activeOpacity={0.9}
              disabled={loading}
              style={{ marginTop: 36, borderRadius: 14, overflow: 'hidden' }}
            >
              <LinearGradient
                colors={[colors.primary, colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  paddingVertical: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 14,
                  shadowColor: colors.primary,
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{
                    color: '#fff',
                    fontSize: 17,
                    fontWeight: '700',
                    letterSpacing: 0.5,
                  }}>
                    {showPinSetup ? 'Complete Registration' : otpSent ? 'Verify & Continue' : 'Send Verification Code'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {!showPinSetup && !otpSent && (
              <>
                {/* OR Divider */}
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  marginVertical: 30 
                }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: colors.muted + '40' }} />
                  <Text style={{ marginHorizontal: 12, color: colors.muted, fontSize: 13 }}>
                    OR
                  </Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: colors.muted + '40' }} />
                </View>

                {/* Google Button */}
                <TouchableOpacity 
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: colors.muted + '40',
                    paddingVertical: 14,
                    borderRadius: 12,
                    marginBottom: 15,
                  }}
                  onPress={() => Alert.alert('Google Login', 'Google login pressed')}
                >
                  <AntDesign name="google" size={20} color="#DB4437" style={{ marginRight: 10 }} />
                  <Text style={{ fontSize: 15, fontWeight: '500', color: '#333' }}>
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                {/* Facebook Button */}
                <TouchableOpacity 
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    borderWidth: 1,
                    borderColor: colors.muted + '40',
                    paddingVertical: 14,
                    borderRadius: 12,
                  }}
                  onPress={() => Alert.alert('Facebook Login', 'Facebook login pressed')}
                >
                  <FontAwesome name="facebook" size={20} color="#1877F2" style={{ marginRight: 10 }} />
                  <Text style={{ fontSize: 15, fontWeight: '500', color: '#333' }}>
                    Continue with Facebook
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {otpSent && !showPinSetup && (
              <TouchableOpacity 
                onPress={resendOtp}
                disabled={loading}
                style={{ marginTop: 16, alignItems: 'center' }}
              >
                <Text style={{ 
                  color: loading ? colors.muted : colors.primary, 
                  fontSize: 14, 
                  fontWeight: '600' 
                }}>
                  Resend Code
                </Text>
              </TouchableOpacity>
            )}

            {/* Footer */}
            <Text style={{
              textAlign: 'center',
              color: colors.muted,
              fontSize: 12,
              marginTop: 36,
              lineHeight: 18,
            }}>
              By continuing, you agree to our{'\n'}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Terms of Service</Text>
              {' & '}
              <Text style={{ color: colors.primary, fontWeight: '600' }}>Privacy Policy</Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* 🔹 Reusable Input Field */
function InputField({ 
  label, 
  placeholder, 
  value, 
  onChangeText, 
  keyboardType = 'default', 
  maxLength, 
  center = false,
  secureTextEntry = false 
}: any) {
  return (
    <View>
      <Text style={{
        fontSize: 13,
        color: colors.muted,
        marginBottom: 6,
        marginLeft: 4,
        fontWeight: '500',
      }}>
        {label}
      </Text>
      <View style={{
        borderWidth: 1,
        borderColor: colors.muted + '30',
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 6,
        elevation: 2,
      }}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.muted + '70'}
          style={{
            paddingVertical: 14,
            fontSize: 15,
            fontWeight: '500',
            textAlign: center ? 'center' : 'left',
            letterSpacing: center ? 3 : 0,
          }}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </View>
  );
}