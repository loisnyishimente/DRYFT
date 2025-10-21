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
    View
} from 'react-native';
import { colors } from '../../components/utils/helpers';


const { width } = Dimensions.get('window');

export default function AuthScreen() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState<boolean>(true);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');

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
      router.replace('/home');
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
                {isRegister ? 'Create your account' : 'Welcome back'}
              </Text>
            </View>

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

            {/* Form Fields */}
            <View style={{ gap: 18 }}>
              {isRegister && (
                <InputField
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                />
              )}
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

            {/* Action Button */}
            <TouchableOpacity 
              onPress={otpSent ? verifyOtp : sendOtp}
              activeOpacity={0.9}
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
                }}
              >
                <Text style={{
                  color: '#fff',
                  fontSize: 17,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                }}>
                  {otpSent ? 'Verify & Continue' : 'Send'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
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


            {otpSent && (
              <TouchableOpacity 
                onPress={() => setOtpSent(false)}
                style={{ marginTop: 16, alignItems: 'center' }}
              >
                <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '600' }}>
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
  label, placeholder, value, onChangeText, keyboardType = 'default', maxLength, center = false 
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
        />
      </View>
    </View>
  );
}
