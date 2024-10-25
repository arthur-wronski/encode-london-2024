import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase.ts'; // You'll need to create this
import * as StellarSdk from '@stellar/stellar-sdk';
import axios from 'axios';
import Logo from '../../assets/images/logo2.png';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const createWallet = async (userId: string) => {
    try {
      console.log('Creating wallet for user:', userId);
      
      // Create a new random keypair
      const pair = StellarSdk.Keypair.random();
      console.log('Generated keypair');

      // Fund the account using Friendbot (testnet only)
      const response = await axios.get(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`,
        {
          headers: { 'Accept': 'application/json' }
        }
      );
      
      if (!response.data) {
        throw new Error('Failed to fund account with Friendbot');
      }
      console.log('Account funded with Friendbot');

      // Store wallet credentials in Supabase
      const { data, error: dbError } = await supabase
        .from('stellar_wallets')
        .insert({
          user_id: userId,
          public_key: pair.publicKey(),
          private_key: pair.secret()
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Failed to store wallet credentials: ${dbError.message}`);
      }

      if (!data) {
        throw new Error('No data returned after storing wallet');
      }

      console.log('Wallet credentials stored in database');

      // Fetch account details using axios
      const accountResponse = await axios.get(
        `https://horizon-testnet.stellar.org/accounts/${pair.publicKey()}`,
        {
          headers: { 'Accept': 'application/json' }
        }
      );

      console.log('Account details retrieved');
      
      return {
        publicKey: pair.publicKey(),
        balances: accountResponse.data.balances,
      };
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  };

  const handleAuth = async () => {
    setIsLoading(true);
    if (isLogin) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (!data.user) {
          throw new Error('No user data returned');
        }

        console.log('Login successful:', data.user);
        router.replace('dashboard');
      } catch (error: any) {
        console.error('Login Error:', error);
        alert(error.message || 'An error occurred during login');
        return;
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) {
          console.error('Signup Error:', error);
          alert(`Signup failed: ${error.message}`);
          return;
        }

        if (!data.user?.id) {
          throw new Error('No user ID returned from signup');
        }
        
        // Create wallet directly
        const walletData = await createWallet(data.user.id);
        console.log('Wallet created:', walletData);
        
        // Only redirect if everything was successful
        router.replace('dashboard');
      } catch (error: any) {
        console.error('Error during signup process:', error);
        alert(error.message || 'An error occurred during signup');
        
        // If we have a user but wallet creation failed, we should handle this case
        if (error.message.includes('wallet')) {
          alert('Account created but wallet setup failed. Please try again or contact support.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>Welcome to Cresco!</Text>
      <Text style={styles.subtitle}>
        {isLogin ? 'Please log in to continue' : 'Create a new account'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
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
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleAuth}
        disabled={!email || !password || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsLogin(!isLogin)}
      >
        <Text style={styles.switchText}>
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
        </Text>
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
  switchButton: {
    marginTop: 20,
  },
  switchText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
