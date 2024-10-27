import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BottomNav from '../../components/BottomNav'; // Make sure the path is correct

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

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
      <Text style={styles.title}>Transactions</Text>
      <ScrollView style={styles.scrollView}>
        {transactions.map(transaction => (
          <View key={transaction.id} style={styles.transactionItem}>
            <Text style={styles.transactionText}>{transaction.description}</Text>
            <Text style={styles.transactionDate}>{transaction.date}</Text>
          </View>
        ))}
      </ScrollView>
      <BottomNav activeTab="transactions" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 20 },
  title: { fontSize: 24, color: '#4CAF50', fontWeight: 'bold', marginBottom: 20 },
  scrollView: { marginBottom: 20 },
  transactionItem: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  transactionText: { fontSize: 16, color: '#4CAF50' },
  transactionDate: { fontSize: 12, color: '#757575' },
});
