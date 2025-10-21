import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
  TextInput,
  FlatList,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { X, Share2, MapPin, Clock, Users, Star } from 'lucide-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from 'expo-router';


const screenHeight = Dimensions.get('window').height;
const darkGreen = '#065F46';
const lightGreen = '#ECFDF5';
const accentGreen = '#10B981';

// Mock Google Places autocomplete suggestions
const mockPlaceSuggestions = (query: string) => {
  const places = [
    'Kigali International Airport, Rwanda',
    'Kigali Convention Centre, KN 3 Ave',
    'Kimironko Market, Kigali',
    'Kigali City Tower, KN 4 Ave',
    'Heaven Restaurant, KG 7 Ave',
    'Nyarutarama, Kigali',
    'Remera, Kigali',
    'Gikondo, Kigali',
  ];
  return places.filter(p => p.toLowerCase().includes(query.toLowerCase()));
};

export default function RideBookingScreen() {
  // ✅ Must call hook at top-level
  const params = useLocalSearchParams();

  const [selectedVehicle, setSelectedVehicle] = useState('Economy');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [region, setRegion] = useState<Region | null>(null);
  const [pickupLocation, setPickupLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pickupText, setPickupText] = useState('Current Location');
  const [destinationText, setDestinationText] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showLocationSearch, setShowLocationSearch] = useState<null | 'pickup' | 'destination'>(null);
  const [showVehicleDetails, setShowVehicleDetails] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  const mapRef = useRef<MapView>(null);
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const vehicleCategories = [
    { 
      name: 'Economy', 
      emoji: '🚗', 
      price: '2 RWF',
      description: 'Affordable rides for daily commutes',
      capacity: '4 passengers',
      features: ['Air conditioning', 'Comfortable seats', 'Standard luggage space'],
      rating: 4.5,
    },
    { 
      name: '7-Seater', 
      emoji: '🚐', 
      price: '5 RWF',
      description: 'Perfect for groups and families',
      capacity: '7 passengers',
      features: ['Extra space', 'Air conditioning', 'Large luggage capacity'],
      rating: 4.7,
    },
    { 
      name: 'Mid-Luxury', 
      emoji: '🚙', 
      price: '10 RWF',
      description: 'Premium comfort for special occasions',
      capacity: '4 passengers',
      features: ['Leather seats', 'Premium sound system', 'Bottled water'],
      rating: 4.8,
    },
    { 
      name: 'Corporate/Executive', 
      emoji: '🚘', 
      price: '15 RWF',
      description: 'Elite service for business travelers',
      capacity: '4 passengers',
      features: ['Luxury interior', 'Professional drivers', 'Wi-Fi', 'Refreshments'],
      rating: 4.9,
    },
  ];

  // ✅ Initialize map and pickup location
  useEffect(() => {
    const initialPickup = {
      latitude: Number(params.pickupLat) || -1.9441,
      longitude: Number(params.pickupLng) || 30.0619,
    };
    
    setPickupLocation(initialPickup);
    setRegion({
      latitude: initialPickup.latitude,
      longitude: initialPickup.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });

    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, [params]);

  // ✅ Autocomplete search
  useEffect(() => {
    if (searchQuery.length > 2) {
      setSuggestions(mockPlaceSuggestions(searchQuery));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleConfirmDate = (date: Date) => {
    setSelectedDate(date);
    setDatePickerVisible(false);
  };

  const openLocationSearch = (type: 'pickup' | 'destination') => {
    setShowLocationSearch(type);
    setSearchQuery('');
    setSuggestions([]);
  };

  const closeLocationSearch = () => {
    setShowLocationSearch(null);
    setSearchQuery('');
    setSuggestions([]);
  };

  const selectLocation = (place: string) => {
    // Mock coordinates
    const mockCoords = {
      latitude: -1.9441 + (Math.random() - 0.5) * 0.1,
      longitude: 30.0619 + (Math.random() - 0.5) * 0.1,
    };

    if (showLocationSearch === 'pickup') {
      setPickupText(place);
      setPickupLocation(mockCoords);
    } else {
      setDestinationText(place);
      setDestinationLocation(mockCoords);
    }
    closeLocationSearch();
  };

  if (!region) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Google Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {pickupLocation && (
          <Marker coordinate={pickupLocation} pinColor={accentGreen}>
            <View style={styles.customMarker}>
              <MapPin size={24} color="#fff" fill={accentGreen} />
            </View>
          </Marker>
        )}
        {destinationLocation && (
          <Marker coordinate={destinationLocation} pinColor={darkGreen}>
            <View style={[styles.customMarker, { backgroundColor: darkGreen }]}>
              <MapPin size={24} color="#fff" fill={darkGreen} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Buttons */}
      <TouchableOpacity 
  style={[styles.circleButton, styles.closeButton]}
  onPress={() => router.back()} 
>
  <X size={24} strokeWidth={2.5} color="#fff" />
</TouchableOpacity>

      <TouchableOpacity style={[styles.circleButton, styles.shareButton]}>
        <Share2 size={20} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <Animated.View 
        style={[
          styles.bottomSheet,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.handleBar} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Pickup & Destination */}
          <View style={styles.locationContainer}>
            <Text style={styles.sectionTitle}>Where to?</Text>
            
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => openLocationSearch('pickup')}
              activeOpacity={0.7}
            >
              <View style={[styles.pointLabel, { backgroundColor: accentGreen }]}>
                <MapPin size={20} color="#fff" />
              </View>
              <Text style={styles.inputText} numberOfLines={1}>
                {pickupText || 'Pickup Location'}
              </Text>
            </TouchableOpacity>

            <View style={styles.dotConnector}>
              {[...Array(3)].map((_, i) => (
                <View key={i} style={styles.dot} />
              ))}
            </View>

            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => openLocationSearch('destination')}
              activeOpacity={0.7}
            >
              <View style={[styles.pointLabel, { backgroundColor: darkGreen }]}>
                <MapPin size={20} color="#fff" />
              </View>
              <Text style={[styles.inputText, !destinationText && styles.placeholderText]} numberOfLines={1}>
                {destinationText || 'Where are you going?'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Vehicle Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose your ride</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehicleScroll}>
              {vehicleCategories.map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  onPress={() => setSelectedVehicle(cat.name)}
                  onLongPress={() => setShowVehicleDetails(cat.name)}
                  activeOpacity={0.8}
                  style={[
                    styles.vehicleOption,
                    selectedVehicle === cat.name ? styles.vehicleSelected : styles.vehicleUnselected,
                  ]}
                >
                  <Text style={styles.vehicleEmoji}>{cat.emoji}</Text>
                  <Text style={styles.vehicleLabel}>{cat.name}</Text>
                  <Text style={styles.vehiclePrice}>{cat.price}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={12} color={darkGreen} fill={darkGreen} />
                    <Text style={styles.ratingText}>{cat.rating}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.infoButton}
                    onPress={() => setShowVehicleDetails(cat.name)}
                  >
                    <Text style={styles.infoButtonText}>ℹ️</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Payment & Pre-order */}
          <View style={styles.paymentContainer}>
            <TouchableOpacity 
              onPress={() => setDatePickerVisible(true)} 
              style={[styles.paymentOption, selectedDate && styles.paymentSelected]}
              activeOpacity={0.7}
            >
              <Clock size={20} color={darkGreen} />
              <Text style={styles.paymentLabel}>
                {selectedDate ? selectedDate.toLocaleDateString() : 'Pre-order'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPaymentMethod('cash')}
              style={[styles.paymentOption, paymentMethod === 'cash' && styles.paymentSelected]}
              activeOpacity={0.7}
            >
              <Text style={styles.paymentEmoji}>💵</Text>
              <Text style={styles.paymentLabel}>Cash</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Ride */}
          <TouchableOpacity 
            style={[
              styles.confirmButton,
              !destinationText && styles.confirmButtonDisabled
            ]}
            disabled={!destinationText}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>
              {destinationText ? 'Confirm Ride' : 'Select destination first'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Location Search Modal */}
      <Modal
        visible={showLocationSearch !== null}
        animationType="slide"
        onRequestClose={closeLocationSearch}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {showLocationSearch === 'pickup' ? 'Pickup Location' : 'Destination'}
            </Text>
            <TouchableOpacity onPress={closeLocationSearch} style={styles.modalCloseButton}>
              <X size={24} color={darkGreen} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <MapPin size={20} color={darkGreen} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={suggestions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => selectLocation(item)}
                activeOpacity={0.7}
              >
                <MapPin size={20} color={darkGreen} />
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {searchQuery.length > 2 ? 'No locations found' : 'Start typing to search...'}
                </Text>
              </View>
            }
          />
        </View>
      </Modal>

      {/* Vehicle Details Modal */}
      <Modal
        visible={showVehicleDetails !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setShowVehicleDetails(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.vehicleDetailsCard}>
            {vehicleCategories
              .filter(cat => cat.name === showVehicleDetails)
              .map(cat => (
                <View key={cat.name}>
                  <View style={styles.vehicleDetailsHeader}>
                    <Text style={styles.vehicleDetailsEmoji}>{cat.emoji}</Text>
                    <View style={styles.vehicleDetailsInfo}>
                      <Text style={styles.vehicleDetailsName}>{cat.name}</Text>
                      <View style={styles.vehicleDetailsRating}>
                        <Star size={16} color={darkGreen} fill={darkGreen} />
                        <Text style={styles.vehicleDetailsRatingText}>{cat.rating}</Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => setShowVehicleDetails(null)}
                      style={styles.detailsCloseButton}
                    >
                      <X size={24} color={darkGreen} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.vehicleDetailsDescription}>{cat.description}</Text>

                  <View style={styles.vehicleDetailsRow}>
                    <Users size={20} color={darkGreen} />
                    <Text style={styles.vehicleDetailsCapacity}>{cat.capacity}</Text>
                  </View>

                  <Text style={styles.vehicleDetailsSubtitle}>Features:</Text>
                  {cat.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Text style={styles.featureBullet}>✓</Text>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}

                  <View style={styles.vehicleDetailsPriceRow}>
                    <Text style={styles.vehicleDetailsPriceLabel}>Starting from</Text>
                    <Text style={styles.vehicleDetailsPrice}>{cat.price}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.selectVehicleButton}
                    onPress={() => {
                      setSelectedVehicle(cat.name);
                      setShowVehicleDetails(null);
                    }}
                  >
                    <Text style={styles.selectVehicleButtonText}>Select {cat.name}</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisible(false)}
        minimumDate={new Date()}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  map: { flex: 1 },
  loadingText: { fontSize: 18, color: darkGreen, fontWeight: '600' },
  
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: accentGreen,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  closeButton: { top: 48, left: 24 },
  shareButton: { top: screenHeight * 0.55, right: 24 },

  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  scrollContent: { paddingBottom: 32 },

  section: { marginBottom: 24 },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: darkGreen,
    marginBottom: 16,
  },

  locationContainer: { marginBottom: 24 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: darkGreen,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dotConnector: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 4,
    marginLeft: 20,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: darkGreen,
    marginVertical: 1,
  },
  pointLabel: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inputText: { 
    flex: 1,
    fontSize: 16, 
    fontWeight: '500',
    color: darkGreen,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontWeight: '400',
  },

  vehicleScroll: { marginBottom: 8 },
  vehicleOption: {
    minWidth: 140,
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  vehicleSelected: { 
    borderColor: darkGreen, 
    backgroundColor: '#DCFCE7',
    transform: [{ scale: 1.05 }],
  },
  vehicleUnselected: { 
    borderColor: '#D1D5DB', 
    backgroundColor: '#fff',
  },
  vehicleEmoji: { fontSize: 36, marginBottom: 8 },
  vehicleLabel: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: darkGreen,
    marginBottom: 4,
  },
  vehiclePrice: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: accentGreen,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: darkGreen,
    marginLeft: 4,
  },
  infoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  infoButtonText: {
    fontSize: 16,
  },

  paymentContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 24,
    gap: 12,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
  },
  paymentSelected: { 
    borderColor: darkGreen, 
    backgroundColor: '#DCFCE7',
  },
  paymentEmoji: { fontSize: 20, marginRight: 8 },
  paymentLabel: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: darkGreen,
  },

  confirmButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 24,
    backgroundColor: darkGreen,
    alignItems: 'center',
    shadowColor: darkGreen,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  confirmButtonText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#fff',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: darkGreen,
  },
  modalCloseButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: lightGreen,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: darkGreen,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: darkGreen,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionText: {
    fontSize: 16,
    color: darkGreen,
    marginLeft: 16,
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
  },

  // Vehicle Details Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  vehicleDetailsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  vehicleDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleDetailsEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  vehicleDetailsInfo: {
    flex: 1,
  },
  vehicleDetailsName: {
    fontSize: 22,
    fontWeight: '700',
    color: darkGreen,
    marginBottom: 4,
  },
  vehicleDetailsRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleDetailsRatingText: {
    fontSize: 16,
    fontWeight: '600',
    color: darkGreen,
    marginLeft: 4,
  },
  detailsCloseButton: {
    padding: 4,
  },
  vehicleDetailsDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 24,
  },
  vehicleDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vehicleDetailsCapacity: {
    fontSize: 16,
    fontWeight: '600',
    color: darkGreen,
    marginLeft: 8,
  },
  vehicleDetailsSubtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: darkGreen,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureBullet: {
    fontSize: 16,
    color: accentGreen,
    fontWeight: '700',
    marginRight: 8,
  },
  featureText: {
    fontSize: 15,
    color: '#374151',
  },
  vehicleDetailsPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  vehicleDetailsPriceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  vehicleDetailsPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: accentGreen,
  },
  selectVehicleButton: {
    backgroundColor: darkGreen,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  selectVehicleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});