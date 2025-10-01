// src/screens/HomeScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Animated,
  Modal,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { styles } from '../../components/styles/theme';
import { colors } from '../../components/utils/helpers';

const { width, height } = Dimensions.get('window');

type VehicleCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  priceMultiplier: number;
  capacity: string;
};

type LocationCoords = {
  latitude: number;
  longitude: number;
};

const vehicleCategories: VehicleCategory[] = [
  {
    id: 'economy',
    name: 'Economy',
    icon: '🚗',
    description: 'Affordable rides for daily commutes',
    priceMultiplier: 1.0,
    capacity: '4 seats',
  },
  {
    id: 'sevenSeater',
    name: '7-Seater',
    icon: '🚙',
    description: 'Perfect for groups and families',
    priceMultiplier: 1.5,
    capacity: '7 seats',
  },
  {
    id: 'midLuxury',
    name: 'Mid-Luxury',
    icon: '🚘',
    description: 'Premium comfort and style',
    priceMultiplier: 2.0,
    capacity: '4 seats',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    icon: '🏆',
    description: 'Executive VIP experience',
    priceMultiplier: 2.5,
    capacity: '4 seats',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  // State management
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [scheduleRide, setScheduleRide] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [rideNumber, setRideNumber] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [showMap, setShowMap] = useState(true);

  // Map coordinates (simulated - replace with actual geocoding)
  const [pickupCoords, setPickupCoords] = useState<LocationCoords | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<LocationCoords | null>(null);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mapHeightAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Animate map when locations are set
  useEffect(() => {
    if (pickupCoords && destinationCoords && mapRef.current) {
      mapRef.current.fitToCoordinates([pickupCoords, destinationCoords], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [pickupCoords, destinationCoords]);

  // Get current location (simulated)
  const getCurrentLocation = () => {
    setUseCurrentLocation(true);
    setPickupLocation('Current Location (GPS)');
    
    // Simulate getting GPS coordinates
    const coords = {
      latitude: 37.78825,
      longitude: -122.4324,
    };
    setPickupCoords(coords);
    setCurrentRegion({
      ...coords,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    
    Alert.alert('Location Found', 'Using your current location');
  };

  // Simulate geocoding for destination
  const handleDestinationChange = (text: string) => {
    setDestination(text);
    
    // Simulate geocoding - in production, use a geocoding API
    if (text.length > 3) {
      const coords = {
        latitude: 37.78825 + (Math.random() - 0.5) * 0.1,
        longitude: -122.4324 + (Math.random() - 0.5) * 0.1,
      };
      setDestinationCoords(coords);
    }
  };

  // Generate unique ride number
  const generateRideNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `DRYFT-${timestamp}${random}`;
  };

  // Calculate estimated distance (simplified)
  const calculateDistance = () => {
    if (!pickupCoords || !destinationCoords) return null;
    
    const R = 6371; // Earth's radius in km
    const dLat = (destinationCoords.latitude - pickupCoords.latitude) * Math.PI / 180;
    const dLon = (destinationCoords.longitude - pickupCoords.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(pickupCoords.latitude * Math.PI / 180) * 
      Math.cos(destinationCoords.latitude * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(1);
  };

  // Validate and confirm ride
  const handleConfirmRide = () => {
    if (!pickupLocation) {
      Alert.alert('Missing Information', 'Please select a pick-up location');
      return;
    }
    if (!destination) {
      Alert.alert('Missing Information', 'Please enter your destination');
      return;
    }
    if (!selectedVehicle) {
      Alert.alert('Missing Information', 'Please select a vehicle category');
      return;
    }
    if (scheduleRide && (!scheduledDate || !scheduledTime)) {
      Alert.alert('Missing Information', 'Please set date and time for scheduled ride');
      return;
    }

    const newRideNumber = generateRideNumber();
    setRideNumber(newRideNumber);
    setShowConfirmation(true);
  };

  // Reset form
  const resetForm = () => {
    setPickupLocation('');
    setDestination('');
    setSelectedVehicle(null);
    setScheduleRide(false);
    setScheduledDate('');
    setScheduledTime('');
    setUseCurrentLocation(false);
    setShowConfirmation(false);
    setPickupCoords(null);
    setDestinationCoords(null);
  };

  const selectedVehicleData = vehicleCategories.find(v => v.id === selectedVehicle);
  const estimatedDistance = calculateDistance();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header */}
        <View style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 20,
          paddingVertical: 20,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          zIndex: 10,
        }}>
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 4,
          }}>
            Book Your Ride
          </Text>
          <Text style={{
            fontSize: 14,
            color: colors.accent,
          }}>
            Where would you like to go?
          </Text>
        </View>

        {/* Map View */}
        {showMap && (
          <View style={{
            height: 300,
            width: '100%',
            backgroundColor: '#e0e0e0',
            position: 'relative',
          }}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1 }}
              region={currentRegion}
              showsUserLocation
              showsMyLocationButton
            >
              {pickupCoords && (
                <Marker
                  coordinate={pickupCoords}
                  title="Pick-up Location"
                  pinColor={colors.primary}
                />
              )}
              {destinationCoords && (
                <Marker
                  coordinate={destinationCoords}
                  title="Destination"
                  pinColor={colors.accent}
                />
              )}
            </MapView>

            {/* Map Toggle Button */}
            <TouchableOpacity
              onPress={() => setShowMap(false)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#fff',
                padding: 8,
                borderRadius: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }}>
                Hide Map
              </Text>
            </TouchableOpacity>

            {/* Distance Badge */}
            {estimatedDistance && (
              <View style={{
                position: 'absolute',
                bottom: 10,
                left: '50%',
                transform: [{ translateX: -50 }],
                backgroundColor: colors.primary,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              }}>
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
                  {estimatedDistance} km
                </Text>
              </View>
            )}
          </View>
        )}

        {!showMap && (
          <TouchableOpacity
            onPress={() => setShowMap(true)}
            style={{
              backgroundColor: colors.primary,
              marginHorizontal: 20,
              marginTop: 10,
              padding: 12,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Show Map</Text>
          </TouchableOpacity>
        )}

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Pick-up Location */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.text,
              marginBottom: 8,
            }}>
              Pick-up Location
            </Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                onPress={getCurrentLocation}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: useCurrentLocation ? colors.primary : '#fff',
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: useCurrentLocation ? colors.primary : colors.muted + '30',
                }}
              >
                <Text style={{ fontSize: 20, marginRight: 10 }}>📍</Text>
                <Text style={{
                  flex: 1,
                  color: useCurrentLocation ? '#fff' : colors.text,
                  fontWeight: useCurrentLocation ? '600' : '400',
                }}>
                  Use Current Location
                </Text>
              </TouchableOpacity>

              <TextInput
                placeholder="Or enter pick-up address manually"
                placeholderTextColor={colors.muted}
                style={{
                  backgroundColor: '#fff',
                  padding: 14,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.muted + '30',
                  fontSize: 15,
                }}
                value={useCurrentLocation ? '' : pickupLocation}
                onChangeText={(text) => {
                  setPickupLocation(text);
                  setUseCurrentLocation(false);
                }}
                editable={!useCurrentLocation}
              />
            </View>
          </View>

          {/* Destination */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.text,
              marginBottom: 8,
            }}>
              Destination
            </Text>
            <TextInput
              placeholder="Where are you going?"
              placeholderTextColor={colors.muted}
              style={{
                backgroundColor: '#fff',
                padding: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.muted + '30',
                fontSize: 15,
              }}
              value={destination}
              onChangeText={handleDestinationChange}
            />
          </View>

          {/* Vehicle Category Selection */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: colors.text,
              marginBottom: 12,
            }}>
              Select Vehicle Category
            </Text>
            <View style={{ gap: 12 }}>
              {vehicleCategories.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.id}
                  onPress={() => setSelectedVehicle(vehicle.id)}
                  style={{
                    backgroundColor: selectedVehicle === vehicle.id ? colors.primary : '#fff',
                    padding: 16,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: selectedVehicle === vehicle.id ? colors.primary : colors.muted + '20',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 32, marginRight: 14 }}>{vehicle.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '700',
                        color: selectedVehicle === vehicle.id ? '#fff' : colors.text,
                        marginRight: 8,
                      }}>
                        {vehicle.name}
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        color: selectedVehicle === vehicle.id ? colors.accent : colors.muted,
                      }}>
                        {vehicle.capacity}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 13,
                      color: selectedVehicle === vehicle.id ? 'rgba(255,255,255,0.8)' : colors.muted,
                    }}>
                      {vehicle.description}
                    </Text>
                  </View>
                  {selectedVehicle === vehicle.id && (
                    <Text style={{ fontSize: 20 }}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Schedule Ride Option */}
          <View style={{ marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => setScheduleRide(!scheduleRide)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#fff',
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.muted + '30',
              }}
            >
              <View style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: scheduleRide ? colors.primary : colors.muted,
                backgroundColor: scheduleRide ? colors.primary : 'transparent',
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {scheduleRide && <Text style={{ color: '#fff', fontSize: 16 }}>✓</Text>}
              </View>
              <Text style={{
                flex: 1,
                fontSize: 15,
                fontWeight: '500',
                color: colors.text,
              }}>
                Schedule ride for later
              </Text>
              <Text style={{ fontSize: 20 }}>📅</Text>
            </TouchableOpacity>

            {scheduleRide && (
              <View style={{ marginTop: 12, gap: 10 }}>
                <TextInput
                  placeholder="Date (e.g., Dec 25, 2024)"
                  placeholderTextColor={colors.muted}
                  style={{
                    backgroundColor: '#fff',
                    padding: 14,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.accent + '50',
                    fontSize: 15,
                  }}
                  value={scheduledDate}
                  onChangeText={setScheduledDate}
                />
                <TextInput
                  placeholder="Time (e.g., 3:00 PM)"
                  placeholderTextColor={colors.muted}
                  style={{
                    backgroundColor: '#fff',
                    padding: 14,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.accent + '50',
                    fontSize: 15,
                  }}
                  value={scheduledTime}
                  onChangeText={setScheduledTime}
                />
              </View>
            )}
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={handleConfirmRide}
            style={{
              backgroundColor: colors.primary,
              padding: 18,
              borderRadius: 12,
              alignItems: 'center',
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Text style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: '700',
              letterSpacing: 0.5,
            }}>
              Confirm Ride Request
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 20,
            padding: 30,
            width: '100%',
            maxWidth: 400,
            alignItems: 'center',
          }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
              <Text style={{ fontSize: 40 }}>✓</Text>
            </View>

            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: colors.text,
              marginBottom: 8,
            }}>
              Ride Confirmed!
            </Text>

            <Text style={{
              fontSize: 14,
              color: colors.muted,
              marginBottom: 20,
              textAlign: 'center',
            }}>
              Your ride has been successfully requested
            </Text>

            <View style={{
              backgroundColor: colors.primary + '10',
              padding: 16,
              borderRadius: 12,
              width: '100%',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 12,
                color: colors.muted,
                marginBottom: 4,
                textAlign: 'center',
              }}>
                Ride Number
              </Text>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.primary,
                textAlign: 'center',
                letterSpacing: 1,
              }}>
                {rideNumber}
              </Text>
            </View>

            <View style={{ width: '100%', gap: 8, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.muted, fontSize: 14 }}>Pick-up:</Text>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500', flex: 1, textAlign: 'right' }}>
                  {pickupLocation}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.muted, fontSize: 14 }}>Destination:</Text>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500', flex: 1, textAlign: 'right' }}>
                  {destination}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.muted, fontSize: 14 }}>Vehicle:</Text>
                <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>
                  {selectedVehicleData?.name}
                </Text>
              </View>
              {estimatedDistance && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.muted, fontSize: 14 }}>Distance:</Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>
                    {estimatedDistance} km
                  </Text>
                </View>
              )}
              {scheduleRide && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: colors.muted, fontSize: 14 }}>Scheduled:</Text>
                  <Text style={{ color: colors.text, fontSize: 14, fontWeight: '500' }}>
                    {scheduledDate} at {scheduledTime}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                setShowConfirmation(false);
                resetForm();
              }}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 14,
                paddingHorizontal: 40,
                borderRadius: 12,
                width: '100%',
              }}
            >
              <Text style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '600',
                textAlign: 'center',
              }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}