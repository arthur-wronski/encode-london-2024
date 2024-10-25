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
    router.replace('dashboard'); // Use replace to avoid going back to login
  };

  return (
    <View style={styles.container}>
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
        disabled={!username || !password}
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
    backgroundColor: '#E3F6E8',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
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
    borderColor: '#A5D6A7',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
