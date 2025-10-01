// src/navigation/types.ts
export type RootStackParamList = {
    Splash: undefined;
    Welcome: undefined;
    Auth: undefined;
    HomeTabs: undefined;
    RideStatus: { rideNumber: string; pickup?: string; destination?: string; category?: string };
    Payment: { rideNumber: string; fare: string };
    Rating: { rideNumber: string };
  };
  
  export type HomeTabParamList = {
    Home: undefined;
    Scheduled: undefined;
    History: undefined;
    Wallet: undefined;
    Profile: undefined;
  };
  