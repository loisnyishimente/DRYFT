import React, { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { 
  Animated, 
  Dimensions, 
  SafeAreaView, 
  Text, 
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import { styles } from '../components/styles/theme';
import { colors } from '../components/utils/helpers';
import { FontAwesome5, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const carAnim = useRef(new Animated.Value(-100)).current;
  const featureAnim = useRef(new Animated.Value(0)).current;
  const statsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(carAnim, {
          toValue: 0,
          tension: 30,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(slideUpAnim, {
          toValue: 0,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(featureAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(statsAnim, {
          toValue: 1,
          duration: 600,
          delay: 400,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 500,
          delay: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={[styles.container, { 
        backgroundColor: '#fff',
        flex: 1,
      }]}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Top Login Button */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 5,
          }}>
            <TouchableOpacity
              onPress={() => router.push('/AuthScreen')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 25,
                backgroundColor: colors.primary,
                borderWidth: 1,
                borderColor: colors.primary + '20',
              }}
              activeOpacity={0.7}
            >
              <Text style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: '600',
                marginRight: 6,
              }}>
                Sign In
              </Text>
              <Ionicons name="log-in-outline" size={18} color='#fff' />
            </TouchableOpacity>
          </View>

          {/* Top Section - Hero with Car */}
          <View style={{
            paddingTop: '10%',
            paddingBottom: 20,
            alignItems: 'center',
          }}>
            {/* Decorative Background Elements */}
            <Animated.View style={{
              position: 'absolute',
              top: 40,
              left: -70,
              width: 220,
              height: 220,
              borderRadius: 110,
              backgroundColor: colors.primary + '18',
              opacity: fadeAnim,
            }} />
            
            <Animated.View style={{
              position: 'absolute',
              top: 100,
              right: -50,
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: colors.accent + '20',
              opacity: fadeAnim,
            }} />

            <Animated.View style={{
              position: 'absolute',
              top: 180,
              left: 30,
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary + '12',
              opacity: fadeAnim,
            }} />




            {/* App Logo & Title */}
            <Animated.View style={{
              alignItems: 'center',
              opacity: fadeAnim,
              transform: [{ scale: logoScaleAnim }],
            }}>
              <Text style={{
                fontSize: 62,
                fontWeight: '900',
                color: colors.primary,
                letterSpacing: 4,
                marginBottom: 8,
                textShadowColor: colors.primary + '20',
                textShadowOffset: { width: 0, height: 4 },
                textShadowRadius: 8,
              }}>
                DRYFT
              </Text>

              <Text style={{
                fontSize: 18,
                color: colors.accent,
                fontWeight: '600',
                letterSpacing: 1,
                textAlign: 'center',
                marginBottom: 8,
              }}>
                The Smarter Way to Move
              </Text>

              <Text style={{
                fontSize: 14,
                color: 'rgba(0,0,0,0.5)',
                fontWeight: '400',
                textAlign: 'center',
                paddingHorizontal: 40,
                lineHeight: 20,
              }}>
                Experience seamless rides with premium comfort and unbeatable convenience
              </Text>
            </Animated.View>
                        {/* Car Image with Enhanced Styling */}
           {/* Car Image with Enhanced Styling */}
<Animated.View style={{
  opacity: fadeAnim,
  transform: [{ translateX: carAnim }, { scale: logoScaleAnim }],
  marginBottom: 20,
}}>
  <View style={{
    backgroundColor: colors.primary + '15',
    borderRadius: width * 0.4,
    padding: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  }}>
  <Image 
  source={require('../assets/images/car-welcome.webp')}  
  style={{ width: width * 0.8, height: width * 0.45, resizeMode: 'contain' }}
/>

  </View>
</Animated.View>
          </View>

          {/* Stats Section */}
          <Animated.View style={{
            flexDirection: 'row',
            paddingHorizontal: 30,
            paddingVertical: 25,
            justifyContent: 'space-around',
            opacity: statsAnim,
            transform: [{
              translateY: statsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            }],
          }}>
            <StatCard number="10K+" label="Happy Riders" />
            <StatCard number="500+" label="Pro Drivers" />
            <StatCard number="4.9★" label="Rating" />
          </Animated.View>

          {/* Features Section */}
          <Animated.View style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            opacity: featureAnim,
            transform: [{
              translateY: featureAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }),
            }],
          }}>
            <View style={{ 
              flexDirection: 'row', 
              gap: 12,
              marginBottom: 12,
            }}>
              <FeatureCard 
                icon={<Ionicons name="flash" size={26} color={colors.primary} />}
                title="Instant Booking"
                description="Get a ride in seconds"
              />
              <FeatureCard 
                icon={<MaterialCommunityIcons name="shield-check" size={26} color={colors.primary} />}
                title="Safe & Secure"
                description="Verified drivers only"
              />
            </View>
            
            <View style={{ 
              flexDirection: 'row', 
              gap: 12,
            }}>
              <FeatureCard 
                icon={<FontAwesome5 name="money-bill-wave" size={22} color={colors.primary} />}
                title="Best Prices"
                description="Affordable rates"
              />
              <FeatureCard 
                icon={<MaterialIcons name="support-agent" size={26} color={colors.primary} />}
                title="24/7 Support"
                description="Always here to help"
              />
            </View>
          </Animated.View>

          {/* Value Propositions */}
          <Animated.View style={{
            paddingHorizontal: 30,
            paddingVertical: 20,
            opacity: featureAnim,
          }}>
            <ValuePoint 
              icon={<Ionicons name="location" size={20} color={colors.primary} />}
              text="Real-time tracking for every journey"
            />
            <ValuePoint 
              icon={<MaterialIcons name="payments" size={20} color={colors.primary} />}
              text="Multiple payment options available"
            />
            <ValuePoint 
              icon={<FontAwesome5 name="star" size={18} color={colors.primary} />}
              text="Premium vehicles at your service"
            />
          </Animated.View>

          {/* Bottom Section - CTA Buttons */}
          <Animated.View style={{
            paddingHorizontal: 30,
            paddingTop: 10,
            paddingBottom: 30,
            opacity: buttonAnim,
            transform: [{
              translateY: buttonAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }),
            }],
          }}>
            {/* Primary CTA */}
            <TouchableOpacity
              onPress={() => router.push('/AuthScreen')}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: 'center',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
                elevation: 8,
                marginBottom: 14,
              }}
              activeOpacity={0.85}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{
                  color: '#fff',
                  fontSize: 18,
                  fontWeight: '700',
                  letterSpacing: 0.5,
                  marginRight: 8,
                }}>
                  Get Started
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </View>
            </TouchableOpacity>



            {/* Terms & Privacy */}
            <Text style={{
              textAlign: 'center',
              color: 'rgba(0, 0, 0, 0.4)',
              fontSize: 11,
              marginTop: 20,
              lineHeight: 16,
              paddingHorizontal: 10,
            }}>
              By continuing, you agree to our{'\n'}
              <Text style={{ fontWeight: '600', color: 'rgba(0, 0, 0, 0.5)' }}>Terms of Service</Text> & <Text style={{ fontWeight: '600', color: 'rgba(0, 0, 0, 0.5)' }}>Privacy Policy</Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// Stat Card Component
function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{
        fontSize: 28,
        fontWeight: '800',
        color: colors.primary,
        marginBottom: 4,
      }}>
        {number}
      </Text>
      <Text style={{
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(0,0,0,0.5)',
      }}>
        {label}
      </Text>
    </View>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <View style={{ 
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: 20,
      paddingHorizontal: 12,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: 'rgba(0,0,0,0.06)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    }}>
      <View style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        {icon}
      </View>
      <Text style={{
        color: '#000',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
      }}>
        {title}
      </Text>
      <Text style={{
        color: 'rgba(0,0,0,0.5)',
        fontSize: 11,
        fontWeight: '500',
        textAlign: 'center',
      }}>
        {description}
      </Text>
    </View>
  );
}

// Value Point Component
function ValuePoint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    }}>
      <View style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary + '12',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
      }}>
        {icon}
      </View>
      <Text style={{
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(0,0,0,0.7)',
      }}>
        {text}
      </Text>
    </View>
  );
}