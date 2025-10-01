import React, { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { 
  Animated, 
  Dimensions, 
  SafeAreaView, 
  Text, 
  View,
  StatusBar,
  TouchableOpacity 
} from 'react-native';
import { styles } from '../components/styles/theme';
import { colors } from '../components/utils/helpers';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.5)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(slideUpAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <SafeAreaView style={[styles.container, { 
        backgroundColor: colors.primary,
        justifyContent: 'space-between',
        paddingVertical: 60,
      }]}>
        {/* Top Section - Logo and Branding */}
        <Animated.View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
          transform: [{ scale: logoScaleAnim }],
        }}>
          {/* Logo/Icon Placeholder - You can replace with actual icon */}
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.accent,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 10,
          }}>
            <Text style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#fff',
              letterSpacing: 2,
            }}>
              D
            </Text>
          </View>

          <Text style={[styles.logo, {
            fontSize: 48,
            fontWeight: 'bold',
            color: '#fff',
            letterSpacing: 3,
            marginBottom: 12,
          }]}>
            DRYFT
          </Text>

          <Text style={{
            fontSize: 18,
            color: colors.accent,
            fontWeight: '500',
            letterSpacing: 1,
          }}>
            The smarter way to move
          </Text>
        </Animated.View>

        {/* Middle Section - Features */}
        <Animated.View style={{
          paddingHorizontal: 40,
          opacity: fadeAnim,
          transform: [{ translateY: slideUpAnim }],
        }}>
          <View style={{ gap: 24 }}>
            <FeatureItem 
              icon="⚡" 
              title="Fast Pickup" 
              description="Get a ride in minutes, anytime"
            />
            <FeatureItem 
              icon="🛡️" 
              title="Safe & Secure" 
              description="Verified drivers and secure payments"
            />
            <FeatureItem 
              icon="💺" 
              title="Comfortable Rides" 
              description="Premium vehicles at your service"
            />
          </View>
        </Animated.View>

        {/* Bottom Section - CTA */}
        <Animated.View style={{
          paddingHorizontal: 30,
          opacity: buttonAnim,
          transform: [{
            translateY: buttonAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [30, 0],
            }),
          }],
        }}>
          <TouchableOpacity
            onPress={() => router.push('/AuthScreen')}
            style={{
              backgroundColor: colors.accent,
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: 'center',
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <Text style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: '700',
              letterSpacing: 0.5,
            }}>
              Get Started
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/AuthScreen')}
            style={{
              marginTop: 16,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{
              color: colors.accent,
              fontSize: 15,
              fontWeight: '500',
            }}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>

          <Text style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: 12,
            marginTop: 20,
            lineHeight: 18,
          }}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </Animated.View>
      </SafeAreaView>
    </>
  );
}

// Feature Item Component
function FeatureItem({ icon, title, description }: { 
  icon: string; 
  title: string; 
  description: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <View style={{
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{ fontSize: 24 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          color: '#fff',
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 4,
        }}>
          {title}
        </Text>
        <Text style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 14,
        }}>
          {description}
        </Text>
      </View>
    </View>
  );
}