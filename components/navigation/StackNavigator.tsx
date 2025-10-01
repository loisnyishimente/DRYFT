// src/navigation/StackNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';

import SplashScreen from '../../app/(tabs)/SplashScreen';
import Welcome from '../../app/(tabs)/Welcome';
import AuthScreen from '../../app/(tabs)/AuthScreen';
import HomeTabs from './TabNavigator';
import RideStatus from '../../app/(tabs)/RideStatus';
import PaymentScreen from '../../app/(tabs)/PaymentScreen';
import RatingScreen from '../../app/(tabs)/RatingScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      <Stack.Screen name="RideStatus" component={RideStatus} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
    </Stack.Navigator>
  );
}
