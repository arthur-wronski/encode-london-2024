// app/(tabs)/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Logo from '../../assets/images/logo2.png';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Add your login logic here, e.g., API call
    // For now, we navigate to the dashboard
    router.replace('dashboard'); // Use replace to avoid going back to login
  };

  return (
    <View style={styles.container}>
      {/* Adjust the style for the logo */}
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>Welcome to Cresco!</Text>
      <Text style={styles.subtitle}>Please log in to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={!username || !password} // Disable if inputs are empty
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E3F6E8', // Light green background
  },
  logo: {
    width: 100, // Set width for logo
    height: 100, // Set height for logo
    marginBottom: 20, // Space below the logo
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50', // Darker green for title
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#A5D6A7', // Light green border
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF', // White input background
  },
  button: {
    backgroundColor: '#4CAF50', // Button color
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF', // White text on button
    fontSize: 18,
    fontWeight: 'bold',
  },
});
