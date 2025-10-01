import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, SafeAreaView, Text, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '../components/styles/theme';
import { colors } from '../components/utils/helpers';

export default function SplashScreen() {
  const router = useRouter(); // expo-router navigation

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const sloganFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Parallel animations for logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Delayed slogan animation
    Animated.timing(sloganFadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    }).start();

    // Navigate to Welcome screen after 1.8s
    const t = setTimeout(() => {
      router.replace('/Welcome'); // expo-router path
    }, 1800);

    return () => clearTimeout(t);
  }, [fadeAnim, scaleAnim, slideAnim, sloganFadeAnim, router]);

  return (
    <SafeAreaView style={[styles.center, splashStyles.container]}>
      <Animated.View
        style={[
          splashStyles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        <Text style={[styles.logo, splashStyles.logo]}>DRYFT</Text>
      </Animated.View>

      <Animated.View
        style={[
          splashStyles.sloganContainer,
          {
            opacity: sloganFadeAnim,
          },
        ]}
      >
        <Text style={[styles.slogan, splashStyles.slogan]}>
          The smarter way to move
        </Text>
      </Animated.View>

      <ActivityIndicator
        size="large"
        color={colors.accent}
        style={splashStyles.loader}
      />
    </SafeAreaView>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logo: {
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  sloganContainer: {
    marginTop: 8,
  },
  slogan: {
    opacity: 0.9,
  },
  loader: {
    marginTop: 40,
  },
});
