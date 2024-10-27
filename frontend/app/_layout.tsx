// app/(tabs)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/transactions" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/earn" options={{ headerShown: false }} /> 
        <Stack.Screen name="(tabs)/pay" options={{ headerShown: false }} /> 
        <Stack.Screen name="(tabs)/settings" options={{ headerShown: false }} /> 
        <Stack.Screen name="+not-found" />
      </Stack>
    </SafeAreaView>
  );
}
