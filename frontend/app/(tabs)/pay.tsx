import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../../components/BottomNav';

const Pay = () => {
  const [recipients, setRecipients] = useState<any[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<any | null>(null);
  const [amount, setAmount] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    fetchRecipients(); // Fetch recipients on load
  }, []);

  const fetchRecipients = async () => {
    // Simulated recipient data
    const fetchedRecipients = [
      { id: 1, name: 'Alice Smith' },
      { id: 2, name: 'Bob Johnson' },
      { id: 3, name: 'Charlie Brown' },
    ];
    setRecipients(fetchedRecipients);
  };

  const handlePayment = () => {
    if (!selectedRecipient) {
      Alert.alert('Select a recipient', 'Please select a recipient to make a payment.');
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount for payment.');
      return;
    }

    Alert.alert(
      'Confirm Payment',
      `Are you sure you want to pay $${paymentAmount} to ${selectedRecipient.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => console.log(`Payment of $${paymentAmount} made to ${selectedRecipient.name}`) }
      ]
    );

    // Reset input fields after payment
    setAmount('');
    setSelectedRecipient(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Pay</Text>
        <View style={styles.recipients}>
          <Text style={styles.sectionTitle}>Select Recipient</Text>
          {recipients.map(recipient => (
            <TouchableOpacity
              key={recipient.id}
              style={[styles.recipientItem, selectedRecipient?.id === recipient.id && styles.selectedRecipient]}
              onPress={() => setSelectedRecipient(recipient)}
            >
              <Text style={styles.recipientText}>{recipient.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedRecipient && (
          <View style={styles.paymentSection}>
            <Text style={styles.balanceLabel}>Pay {selectedRecipient.name}</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <BottomNav activeTab="dashboard" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 16 },
  scrollContent: { paddingBottom: 80 },
  title: { fontSize: 24, color: '#4CAF50', fontWeight: 'bold', marginBottom: 20 },
  recipients: { paddingVertical: 16 },
  sectionTitle: { fontSize: 18, color: '#4CAF50', marginBottom: 8 },
  recipientItem: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  selectedRecipient: {
    backgroundColor: '#81C784', // Highlighted color for selected recipient
  },
  recipientText: { fontSize: 16, color: '#4CAF50' },
  paymentSection: {
    backgroundColor: '#F0F4C3',
    padding: 15,
    borderRadius: 8,
    marginTop: 16,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Pay;
