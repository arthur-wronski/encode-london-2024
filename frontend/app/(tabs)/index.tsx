// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay if necessary
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.replace('(tabs)/login'); // Redirect to login after loading
    }, 100); // Adjust delay as needed

    // Cleanup
    return () => clearTimeout(timer);
  }, [router]);

  // Show a loading indicator or null
  return isLoading ? null : <LoadingIndicator />;
}

// You can create a simple loading component
const LoadingIndicator = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Loading...</Text>
  </View>
);
