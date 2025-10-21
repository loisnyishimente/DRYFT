import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { MaterialIcons } from "@expo/vector-icons";


type Driver = { id: string; latitude: number; longitude: number };
type MarkerData = { id: string; latitude: number; longitude: number; title: string };


const userLatitude = 37.78825;
const userLongitude = -122.4324;


const destinationLatitude = 37.7897;
const destinationLongitude = -122.434;


const directionsAPI = "YOUR_GOOGLE_MAPS_API_KEY";

export default function MapScreen() {
  const [drivers, setDrivers] = useState<Driver[]>([
    { id: "1", latitude: 37.78925, longitude: -122.4324 },
    { id: "2", latitude: 37.786, longitude: -122.435 },
  ]);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  const markers: MarkerData[] = drivers.map((d) => ({
    id: d.id,
    latitude: d.latitude,
    longitude: d.longitude,
    title: "Driver",
  }));

  if (!userLatitude || !userLongitude) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0286FF" />
      </View>
    );
  }

  const region: Region = {
    latitude: userLatitude,
    longitude: userLongitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <MapView style={{ flex: 1 }} initialRegion={region} showsUserLocation showsMyLocationButton>
    
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
          onPress={() => setSelectedDriver(marker.id)}
        >
          <MaterialIcons
            name="local-taxi"
            size={32}
            color={selectedDriver === marker.id ? "blue" : "green"}
          />
        </Marker>
      ))}


      {destinationLatitude && destinationLongitude && Platform.OS !== "web" && (
        <>
          <Marker
            key="destination"
            coordinate={{ latitude: destinationLatitude, longitude: destinationLongitude }}
            title="Destination"
          >
            <MaterialIcons name="location-pin" size={36} color="red" />
          </Marker>

          <MapViewDirections
            origin={{ latitude: userLatitude, longitude: userLongitude }}
            destination={{ latitude: destinationLatitude, longitude: destinationLongitude }}
            apikey={directionsAPI}
            strokeWidth={3}
            strokeColor="#0286FF"
          />
        </>
      )}
    </MapView>
  );
}
