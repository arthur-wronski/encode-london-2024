import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Logo from '../../assets/images/logo2.png';

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={Logo} style={styles.logo} />
          <Text style={styles.title}>Welcome to Cresco</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balance}>$120.50</Text>
          <Text style={styles.subBalance}>Mobile Money: $100</Text>
          <Text style={styles.subBalance}>Earn: $20.50 (200 XLM)</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Navigate to Pay')}>
            <Text style={styles.actionText}>Pay</Text>
          </TouchableOpacity>
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

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.replace('dashboard')} style={styles.navButton}>
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('settings')} style={styles.navButton}>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('transactions')} style={styles.navButton}>
          <Text style={styles.navText}>Transactions</Text>
        </TouchableOpacity>
      </View>
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#E3F6E8',
    borderTopWidth: 1,
    borderTopColor: '#A5D6A7',
  },
  navButton: { flex: 1, alignItems: 'center' },
  navText: { color: '#4CAF50', fontWeight: '600' },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
