import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.replace('(tabs)/login');
    }, 100); 

    return () => clearTimeout(timer);
  }, [router]);

  return isLoading ? <LoadingIndicator /> : null;
}

const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3F6E8',
  },
  loadingText: {
    fontSize: 18,
    color: '#4CAF50',
  },
});
