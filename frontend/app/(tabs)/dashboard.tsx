import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function Dashboard() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Cresco</Text>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>XLM Balance</Text>
        <Text style={styles.balance}>120.50 XLM</Text>
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
