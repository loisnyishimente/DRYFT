import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tabs Navigator */}
      <Stack.Screen name="(tabs)" />

      {/* Non-tab screens */}
      <Stack.Screen name="welcome" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="ride-selection" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="rating" />
    </Stack>
  );
}
