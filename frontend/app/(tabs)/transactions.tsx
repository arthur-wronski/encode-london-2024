import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Transactions() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {/* Placeholder transaction history */}
      <View style={styles.transaction}>
        <Text style={styles.transactionType}>Earn</Text>
        <Text style={styles.transactionAmount}>+5 XLM</Text>
        <Text style={styles.transactionDate}>2023-10-22</Text>
      </View>
      <View style={styles.transaction}>
        <Text style={styles.transactionType}>Withdraw</Text>
        <Text style={styles.transactionAmount}>-10 XLM</Text>
        <Text style={styles.transactionDate}>2023-10-21</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FAFAFA' },
  title: { fontSize: 24, color: '#4CAF50', fontWeight: 'bold', marginBottom: 16 },
  transaction: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
  },
  transactionType: { fontSize: 16, color: '#4CAF50' },
  transactionAmount: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  transactionDate: { fontSize: 12, color: '#757575', marginTop: 4 },
});
