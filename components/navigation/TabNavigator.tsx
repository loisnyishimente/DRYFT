// src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeTabParamList } from '../navigation/types';

import HomeScreen from '../../app/(tabs)/HomeScreen';
import ScheduledScreen from '../../app/(tabs)/ScheduledScreen';
import HistoryScreen from '../../app/(tabs)/HistoryScreen';
import WalletScreen from '../../app/(tabs)/WalletScreen';
import ProfileScreen from '../../app/(tabs)/ProfileScreen';

const Tab = createBottomTabNavigator<HomeTabParamList>();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00C16A',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Scheduled') iconName = 'calendar-outline';
          if (route.name === 'History') iconName = 'time-outline';
          if (route.name === 'Wallet') iconName = 'wallet-outline';
          if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: { height: 60, paddingBottom: 6 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Scheduled" component={ScheduledScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
