import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import Logo from '../../assets/images/logo2.png';
import BottomNav from '../../components/BottomNav'; // Make sure the path is correct
import { useRouter } from 'expo-router';

export default function Dashboard() {
  const [balance, setBalance] = useState<string>('Loading...');
  const [transactions, setTransactions] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // fetchBalance()
    fetchTransactions();
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
  }

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
        <View style={styles.header}>
          <Image source={Logo} style={styles.logo} />
          <Text style={styles.title}>Welcome to Cresco</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balance}>$120</Text>
          <Text style={styles.subBalance}>Mobile Money: $100</Text>
          <Text style={styles.subBalance}>Earn: $20 (200 XLM)</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('pay')}>
            <Text style={styles.actionText}>Pay</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('earn')}>
            <Text style={styles.actionText}>Earn</Text>
          </TouchableOpacity>
        </View>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 80 },
  header: { paddingVertical: 16, alignItems: 'center' },
  title: { fontSize: 24, color: '#4CAF50', fontWeight: 'bold' },
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
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
