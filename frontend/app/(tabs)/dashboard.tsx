import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { supabase } from '../../lib/supabase';
import axios from 'axios'; // Add this import

export default function Dashboard() {
  const [balance, setBalance] = useState<string>('Loading...');
  
  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // First get the user's public key from stellar_wallets
      const { data: walletData, error: walletError } = await supabase
        .from('stellar_wallets')
        .select('public_key')
        .eq('user_id', user.id)
        .single();

      if (walletError) throw walletError;
      if (!walletData) throw new Error('No wallet found');

      // Fetch account details using axios
      const response = await axios.get(
        `https://horizon-testnet.stellar.org/accounts/${walletData.public_key}`,
        {
          headers: { 'Accept': 'application/json' }
        }
      );

      // Find XLM balance in the balances array
      const xlmBalance = response.data.balances.find((b: any) => b.asset_type === 'native');
      setBalance(xlmBalance ? `${parseFloat(xlmBalance.balance).toFixed(2)} XLM` : '0 XLM');

    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('Error loading balance');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Cresco</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>XLM Balance</Text>
        <Text style={styles.balance}>{balance}</Text>
        <Text style={styles.subBalance}>Mobile Money Balance: 100 USD</Text>
      </View>

      {/* Earn & Withdraw Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Navigate to Earn')}>
          <Text style={styles.actionText}>Earn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Navigate to Withdraw')}>
          <Text style={styles.actionText}>Withdraw</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <View style={styles.transactions}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {/* Placeholder transactions */}
        <View style={styles.transactionItem}>
          <Text style={styles.transactionText}>Earned 5 XLM</Text>
          <Text style={styles.transactionDate}>2023-10-22</Text>
        </View>
        <View style={styles.transactionItem}>
          <Text style={styles.transactionText}>Withdrew 10 XLM</Text>
          <Text style={styles.transactionDate}>2023-10-21</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', paddingHorizontal: 16 },
  header: { paddingVertical: 16, alignItems: 'center' },
  title: { fontSize: 24, color: '#4CAF50', fontWeight: 'bold' },
  balanceCard: {
    backgroundColor: '#81C784',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  balanceLabel: { fontSize: 18, color: '#FFFFFF' },
  balance: { fontSize: 32, color: '#FFFFFF', fontWeight: 'bold' },
  subBalance: { fontSize: 16, color: '#FAFAFA', marginTop: 4 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
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
});
