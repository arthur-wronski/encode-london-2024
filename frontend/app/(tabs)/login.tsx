// app/(tabs)/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase.ts';
import * as StellarSdk from '@stellar/stellar-sdk';
import axios from 'axios';
import { AuthError } from '@supabase/supabase-js';

/**
 * LoginScreen Component
 * Handles user authentication flow including:
 * - Login with email/password
 * - New user registration with automatic wallet creation
 * - Mobile money account linking
 * Provides real-time feedback and error handling
 */
export default function LoginScreen() {
  // Authentication state management
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [linkingStatus, setLinkingStatus] = useState<'pending' | 'complete' | 'failed' | null>(null);

  /**
   * Creates a new Stellar wallet for the user
   * Includes:
   * - Keypair generation
   * - Testnet account funding
   * - Secure credential storage
   * @param userId - The user's unique identifier
   * @returns Wallet details including public key and balances
   */
  const createWallet = async (userId: string) => {
    try {
      console.log('Creating wallet for user:', userId);
      
      // Generate new Stellar keypair
      const pair = StellarSdk.Keypair.random();
      console.log('Generated keypair');

      // Fund account using Stellar testnet
      const response = await axios.get(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`,
        { headers: { 'Accept': 'application/json' } }
      );
      
      if (!response.data) {
        throw new Error('Failed to fund account with Friendbot');
      }
      console.log('Account funded with Friendbot');

      // Store wallet credentials securely
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

      // Retrieve initial account details
      const accountResponse = await axios.get(
        `https://horizon-testnet.stellar.org/accounts/${pair.publicKey()}`,
        { headers: { 'Accept': 'application/json' } }
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

  /**
   * Links user's mobile money account to their profile
   * Handles API communication and status tracking
   * @param userId - The user's unique identifier
   * @returns Mobile money account linking details
   */
  const linkMobileMoneyAccount = async (userId: string) => {
    try {
      console.log('Linking mobile money account for user:', userId);
    
      // Initiate mobile money linking through proxy
      const response = await axios.post('http://localhost:3000/api/mobile-money/link', {
        mobileNumber,
        userId
      });

      // Store linking reference and status
      const { data: linkData, error: dbError } = await supabase
        .from('mobile_money_links')
        .insert({
          user_id: userId,
          mobile_number: mobileNumber,
          link_reference: response.data.linkReference,
          status: 'active'
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Failed to store mobile money link: ${dbError.message}`);
      }

      setLinkingStatus('complete');
      return linkData;
    } catch (error) {
      console.error('Error linking mobile money account:', error);
      setLinkingStatus('failed');
      throw error;
    }
  };

  /**
   * Handles both login and registration flows
   * Includes:
   * - Input validation
   * - Authentication with Supabase
   * - Wallet creation for new users
   * - Mobile money account linking
   * - Error handling and user feedback
   */
  const handleAuth = async () => {
    setIsLoading(true);
    if (isLogin) {
      try {
        // Authenticate existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (!data.user) {
          throw new Error('No user data returned');
        }

        console.log('Login successful:', data.user);
        router.replace('/dashboard');
      } catch (error: any) {
        console.error('Login Error:', error);
        alert(error.message || 'An error occurred during login');
        return;
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        // Validate mobile number format
        if (!mobileNumber.match(/^\+?[1-9]\d{1,14}$/)) {
          throw new Error('Invalid mobile number format');
        }

        // Register new user
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
        
        // Initialize user services in parallel
        try {
          const [walletData, mobileMoneyLink] = await Promise.all([
            createWallet(data.user.id),
            linkMobileMoneyAccount(data.user.id)
          ]);
          console.log('Wallet created:', walletData);
          console.log('Mobile money account linked:', mobileMoneyLink);
        } catch (error) {
          console.error('Error during wallet/mobile setup:', error);
          if (error instanceof Error) {
            if (error.message.includes('mobile money')) {
              alert('Account created but mobile money linking failed. You can try linking it again later.');
            } else if (error.message.includes('wallet')) {
              throw error;
            }
          }
        }
        
        router.replace('/dashboard');
      } catch (error: unknown) {
        console.error('Error during signup process:', error);
        alert(error instanceof Error ? error.message : 'An error occurred during signup');
        
        if (error instanceof Error && error.message.includes('wallet')) {
          alert('Account created but wallet setup failed. Please try again or contact support.');
        }
        if (error instanceof Error && error.message.includes('mobile money')) {
          alert('Account created but mobile money linking failed. Please try again or contact support.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Cresco!</Text>
      <Text style={styles.subtitle}>
        {isLogin ? 'Please log in to continue' : 'Create a new account'}
      </Text>

      {/* Authentication Form Fields */}
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
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Mobile Money Number (e.g., +254123456789)"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
          autoCapitalize="none"
        />
      )}

      {/* Submit Button with Loading State */}
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

      {/* Toggle between Login and Signup */}
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

/**
 * Component Styles
 * Uses a consistent green theme throughout the application
 * Includes responsive design considerations and visual feedback states
 */
const styles = StyleSheet.create({
  // Container and layout
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E3F6E8',
  },
  
  // Text elements
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
  
  // Form elements
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  
  // Action buttons
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
