// app/(tabs)/index.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the login page when the app loads
    router.replace('(tabs)/login'); // Make sure the path matches your file structure
  }, [router]);

  return null; // Render nothing as we are redirecting
}
