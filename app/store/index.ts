import { useState } from "react";

export const useLocationStore = () => {
  const [userLatitude, setUserLatitude] = useState<number | null>(37.78825);
  const [userLongitude, setUserLongitude] = useState<number | null>(-122.4324);
  const [destinationLatitude, setDestinationLatitude] = useState<number | null>(null);
  const [destinationLongitude, setDestinationLongitude] = useState<number | null>(null);

  return {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
    setUserLatitude,
    setUserLongitude,
    setDestinationLatitude,
    setDestinationLongitude,
  };
};
