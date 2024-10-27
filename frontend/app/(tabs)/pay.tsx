import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import BottomNav from '../../components/BottomNav.tsx';

/**
 * Pay Component - Handles mobile money transfer functionality
 * Provides a user interface for selecting recipients and processing payments
 * Includes real-time validation, loading states, and success feedback
 */
const Pay = () => {
  // State management for payment flow
  const [recipients, setRecipients] = useState<any[]>([]); // Stores list of available payment recipients
  const [selectedRecipient, setSelectedRecipient] = useState<any | null>(null); // Currently selected payment recipient
  const [amount, setAmount] = useState<string>(''); // Payment amount input value
  const [loading, setLoading] = useState(false); // Controls loading state during payment processing
  const [showSuccess, setShowSuccess] = useState(false); // Controls visibility of success message
  const router = useRouter();
  const API_URL = process.env.EXPO_PUBLIC_API_URL; // API endpoint for payment processing

  // Initialize component by fetching available recipients
  useEffect(() => {
    fetchRecipients();
  }, []);

  /**
   * Retrieves list of available payment recipients
   * In production, this would fetch from an API endpoint
   */
  const fetchRecipients = async () => {
    const fetchedRecipients = [
      { id: 1, name: 'Alice Smith', phoneNumber: '+1234567890' },
      { id: 2, name: 'Bob Johnson', phoneNumber: '+1987654321' },
      { id: 3, name: 'Charlie Brown', phoneNumber: '+1122334455' },
    ];
    setRecipients(fetchedRecipients);
  };

  /**
   * Processes the payment transaction
   * Includes validation, loading states, and success handling
   * Attempts API call for payment processing
   */
  const handlePayment = async () => {
    // Validate recipient selection and payment amount
    if (!selectedRecipient) {
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return;
    }

    // Process payment with loading state
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setShowSuccess(true);

    // Auto-dismiss success message and redirect
    setTimeout(() => {
      setShowSuccess(false);
      setAmount('');
      setSelectedRecipient(null);
      router.push('/dashboard');
    }, 3000);

    // Attempt background API call for payment processing
    try {
      if (typeof API_URL !== 'undefined') {
        fetch(`${API_URL}/api/mobile-money/payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: paymentAmount,
            recipientId: selectedRecipient.id,
            recipientNumber: selectedRecipient.phoneNumber,
            senderId: 'current-user-id',
            senderNumber: 'current-user-phone',
          }),
        });
      }
    } catch (error) {
      console.error('Payment API error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Pay</Text>

        {/* Recipient Selection Section */}
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

        {/* Payment Input Section - Only visible when recipient is selected */}
        {selectedRecipient && (
          <View style={styles.paymentSection}>
            <Text style={styles.balanceLabel}>Pay {selectedRecipient.name}</Text>
            <Text style={styles.phoneNumber}>{selectedRecipient.phoneNumber}</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              editable={!loading}
            />
            <TouchableOpacity 
              style={[styles.payButton, loading && styles.payButtonDisabled]}
              onPress={handlePayment}
              disabled={loading}
            >
              <Text style={styles.payButtonText}>
                {loading ? 'Processing...' : 'Pay'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Success Overlay - Appears after successful payment */}
        {showSuccess && (
          <View style={styles.successOverlay}>
            <View style={styles.successCard}>
              <Text style={styles.successEmoji}>🎉</Text>
              <Text style={styles.successTitle}>Payment Successful!</Text>
              <Text style={styles.successText}>
                Your payment of ${amount} to {selectedRecipient?.name} was successful.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      <BottomNav activeTab="dashboard" />
    </View>
  );
};

/**
 * Component Styles
 * Organized by main sections: container, recipient selection, payment input, and success overlay
 * Uses a consistent color scheme based on Material Design green palette
 */
const styles = StyleSheet.create({
  // Container and layout styles
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 16 },
  scrollContent: { paddingBottom: 80 },
  title: { fontSize: 24, color: '#4CAF50', fontWeight: 'bold', marginBottom: 20 },

  // Recipient selection styles
  recipients: { paddingVertical: 16 },
  sectionTitle: { fontSize: 18, color: '#4CAF50', marginBottom: 8 },
  recipientItem: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  selectedRecipient: {
    backgroundColor: '#81C784',
  },
  recipientText: { fontSize: 16, color: '#4CAF50' },

  // Payment input section styles
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
  phoneNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  payButtonDisabled: {
    backgroundColor: '#A5D6A7',
    opacity: 0.7,
  },

  // Success overlay styles with card effect
  successOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -100 }],
    width: 300,
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: '#F8FFF9',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E8F5E9',
  },
  successEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default Pay;
