import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function RideHailingScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: -1.9441,
    longitude: 30.0619,
    latitudeDelta: 0.015,
    longitudeDelta: 0.015,
  });
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };

      setRegion(newRegion);
      setUserLocation({ latitude, longitude });

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      }
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Google Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        loadingEnabled={true}
      >
        {userLocation && (
          <Marker coordinate={userLocation} title="Your Location">
            <View style={styles.customMarker}>
              <View style={styles.markerDot} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Top Left - Menu Button */}
      <View style={styles.topLeft}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuOpen(!menuOpen)}>
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Top Right - Top Up Wallet */}
      <TouchableOpacity style={styles.topUpButton}>
        <View style={styles.walletIcon}>
          <View style={styles.walletIconInner} />
        </View>
        <Text style={styles.topUpText}>Top up wallet</Text>
      </TouchableOpacity>

      {/* Feedback Card */}
      <View style={styles.feedbackCard}>
        <View style={styles.megaphoneIcon}>
          <Text style={styles.iconText}>📢</Text>
        </View>
        <View style={styles.feedbackContent}>
          <Text style={styles.feedbackTitle}>Tell us about Your Experience</Text>
          <Text style={styles.chatIcon}>💬</Text>
        </View>
      </View>

      {/* Bottom - Order Now Button */}
      <TouchableOpacity
        style={styles.orderButton}
        onPress={() => router.push('/ride/ride-selection')}
      >
        <Text style={styles.carIcon}>🚗</Text>
        <Text style={styles.orderText}>Order now</Text>
        <Text style={styles.arrowText}>→</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  map: { width, height },
  customMarker: {
    width: 20, height: 20, borderRadius: 10, backgroundColor: '#4285F4',
    borderWidth: 3, borderColor: '#FFFFFF', shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3,
    shadowRadius: 3, elevation: 5,
  },
  markerDot: { flex: 1, borderRadius: 10 },
  topLeft: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, left: 20 },
  menuButton: {
    width: 56, height: 56, backgroundColor: '#FFF', borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15,
    shadowRadius: 8, elevation: 5,
  },
  menuIcon: { width: 24, height: 18, justifyContent: 'space-between' },
  menuLine: { width: 24, height: 3, backgroundColor: '#333', borderRadius: 2 },
  notificationDot: {
    position: 'absolute', top: 8, right: 8, width: 10, height: 10,
    backgroundColor: '#FF5252', borderRadius: 5, borderWidth: 2, borderColor: '#FFF',
  },
  topUpButton: {
    position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, right: 20,
    backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 25,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  walletIcon: {
    width: 24, height: 20, borderWidth: 2, borderColor: '#333', borderRadius: 4,
    marginRight: 8, justifyContent: 'center', alignItems: 'center',
  },
  walletIconInner: { width: 12, height: 8, backgroundColor: '#333', borderRadius: 2 },
  topUpText: { fontSize: 16, fontWeight: '600', color: '#333' },
  feedbackCard: {
    position: 'absolute', top: Platform.OS === 'ios' ? 160 : 130, left: 20, right: 20,
    backgroundColor: '#FFF', borderRadius: 16, padding: 16, flexDirection: 'row',
    alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  megaphoneIcon: {
    width: 48, height: 48, backgroundColor: '#F5F5F5', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  iconText: { fontSize: 24 },
  feedbackContent: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  feedbackTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  chatIcon: { fontSize: 20 },
  orderButton: {
    position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: '#FFF',
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16,
    borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 12, elevation: 8,
  },
  carIcon: { fontSize: 32, marginRight: 12 },
  orderText: { flex: 1, fontSize: 20, fontWeight: '600', color: '#333' },
  arrowText: { fontSize: 24, fontWeight: '600', color: '#333' },
});
