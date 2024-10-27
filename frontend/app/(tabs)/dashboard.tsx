import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import Logo from '../../assets/images/logo2.png';
import BottomNav from '../../components/BottomNav'; // Make sure the path is correct
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

/**
 * Dashboard Component
 * Main interface displaying user's financial overview including:
 * - Current balance (XLM and mobile money)
 * - Quick action buttons
 * - Recent transaction history
 * Implements caching for offline functionality
 */
export default function Dashboard() {
  // State management for financial data
  const [balance, setBalance] = useState<string>('Loading...');
  const [transactions, setTransactions] = useState<any[]>([]);
  const router = useRouter();

  // Initialize dashboard data on component mount
  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  /**
   * Fetches user's current balance
   * Implements a cache-first strategy:
   * 1. Retrieves cached balance for immediate display
   * 2. Fetches fresh balance from blockchain
   * 3. Updates cache with new balance
   * Handles error states gracefully
   */
  const fetchBalance = async () => {
    try {
      // Initial balance from cache
      const cachedBalance = await AsyncStorage.getItem('userBalance');
      if (cachedBalance) {
        setBalance(cachedBalance);
      }

      // Fetch fresh balance from blockchain
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Retrieve user's wallet information
      const { data: walletData, error: walletError } = await supabase
        .from('stellar_wallets')
        .select('public_key')
        .eq('user_id', user.id)
        .single();

      if (walletError) throw walletError;
      if (!walletData) throw new Error('No wallet found');

      // Query Stellar network for current balance
      const response = await axios.get(
        `https://horizon-testnet.stellar.org/accounts/${walletData.public_key}`
      );

      // Extract and format XLM balance
      const xlmBalance = response.data.balances.find((b: any) => b.asset_type === 'native');
      const newBalance = xlmBalance ? `${parseFloat(xlmBalance.balance).toFixed(2)} XLM` : '0 XLM';
      
      // Update state and cache
      setBalance(newBalance);
      await AsyncStorage.setItem('userBalance', newBalance);

    } catch (error) {
      console.error('Error fetching balance:', error);
      // Fallback to cached balance on error
      const cachedBalance = await AsyncStorage.getItem('userBalance');
      setBalance(cachedBalance || 'Error loading balance');
    }
  };

  /**
   * Updates local balance after transactions
   * Maintains UI consistency before blockchain confirmation
   * @param amount - Transaction amount to deduct
   */
  const updateLocalBalance = async (amount: number) => {
    try {
      const currentBalance = parseFloat(balance.replace(' XLM', ''));
      const newBalance = (currentBalance - amount).toFixed(2) + ' XLM';
      setBalance(newBalance);
      await AsyncStorage.setItem('userBalance', newBalance);
    } catch (error) {
      console.error('Error updating local balance:', error);
    }
  };

  /**
   * Fetches user's recent transactions
   * Includes various transaction types:
   * - Deposits
   * - Withdrawals
   * - Peer transfers
   */
  const fetchTransactions = async () => {
    const fetchedTransactions = [
      { id: 1, type: 'added', amount: 50, date: '2024-10-25', description: 'Added $50 to Earn' },
      { id: 2, type: 'withdrawn', amount: 20, date: '2024-10-22', description: 'Withdrew $20 from Earn' },
      { id: 3, type: 'sent', amount: 15, date: '2024-10-20', description: 'Sent $15 to Alice Smith' },
    ];
    setTransactions(fetchedTransactions);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Image source={Logo} style={styles.logo} />
          <Text style={styles.title}>Welcome to Cresco</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balance}>$120</Text>
          <Text style={styles.subBalance}>Mobile Money: $100</Text>
          <Text style={styles.subBalance}>Earn: $20 (200 XLM)</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('pay')}>
            <Text style={styles.actionText}>Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('earn')}>
            <Text style={styles.actionText}>Earn</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.transactions}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {transactions.map(transaction => (
            <View key={transaction.id} style={styles.transactionItem}>
              <Text style={styles.transactionText}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNav activeTab="dashboard" />
    </View>
  );
}

/**
 * Component Styles
 * Organized by main UI sections:
 * - Container and layout
 * - Balance card with shadow effects
 * - Action buttons
 * - Transaction list
 * Uses Material Design green color palette
 */
const styles = StyleSheet.create({
  // Container and layout styles
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 80 },
  header: { paddingVertical: 16, alignItems: 'center' },
  title: { fontSize: 24, color: '#4CAF50', fontWeight: 'bold' },
  
  // Balance card with elevation
  balanceCard: {
    backgroundColor: '#81C784',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceLabel: { fontSize: 18, color: '#FFFFFF' },
  balance: { fontSize: 32, color: '#FFFFFF', fontWeight: 'bold' },
  subBalance: { fontSize: 16, color: '#FAFAFA', marginTop: 4 },
  
  // Action buttons section
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  
  // Transaction list styles
  transactions: { paddingVertical: 16 },
  sectionTitle: { fontSize: 18, color: '#4CAF50', marginBottom: 8 },
  transactionItem: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  transactionText: { fontSize: 16, color: '#4CAF50' },
  transactionDate: { fontSize: 12, color: '#757575' },
  
  // Logo styling
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
