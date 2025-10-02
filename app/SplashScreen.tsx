import React, { useEffect, useRef } from 'react';
import { SafeAreaView, Text, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../components/styles/theme';
import { colors } from '../components/utils/helpers';

export default function SplashScreen() {
  const router = useRouter();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const sloganFadeAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startIdleLoop = () => {
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.06,
              duration: 2000, // slower sway
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(swayAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(swayAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    };

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000, // slower fade
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start(() => startIdleLoop());

    // Delayed slogan
    Animated.timing(sloganFadeAnim, {
      toValue: 1,
      duration: 2000,
      delay: 600,
      useNativeDriver: true,
    }).start();

    // Navigate to Welcome after 3.5 seconds
    const t = setTimeout(() => router.replace('/Welcome'), 5000);
    return () => clearTimeout(t);
  }, [fadeAnim, scaleAnim, slideAnim, sloganFadeAnim, swayAnim, router]);

  const rotate = swayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-2deg', '2deg'],
  });

  return (
    <SafeAreaView style={[styles.center, splashStyles.container]}>
      <Animated.View
        style={[
          splashStyles.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }, { rotate }] },
        ]}
      >
        <Animated.Text style={[styles.logo, splashStyles.logo]}>
          <Text style={splashStyles.logoTextPrimary}>DR</Text>
          <Text style={splashStyles.logoTextAccent}>Y</Text>
          <Text style={splashStyles.logoTextPrimary}>FT</Text>
        </Animated.Text>
        <Animated.View style={[splashStyles.accentBar, { opacity: fadeAnim }]} />
      </Animated.View>

      <Animated.View style={[splashStyles.sloganContainer, { opacity: sloganFadeAnim }]}>

      </Animated.View>
    </SafeAreaView>
  );
}

const splashStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  logoContainer: { alignItems: 'center', marginBottom: 16 },
  logo: {
    fontSize: 56,
    fontWeight: '900',
    letterSpacing: 6,
    color: colors.primary,
    textShadowColor: 'rgba(0, 0, 0, 0.12)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 10,
  },
  logoTextPrimary: { color: colors.primary },
  logoTextAccent: { color: colors.accent },
  accentBar: {
    marginTop: 10,
    height: 6,
    width: 80,
    borderRadius: 4,
    backgroundColor: colors.accent,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  sloganContainer: { marginTop: 10 },
  slogan: { opacity: 0.95, color: '#6b7280', fontSize: 16, letterSpacing: 0.5 },
});
