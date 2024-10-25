// app/(tabs)/earn.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, TextInput } from 'react-native';
import Slider from '@react-native-community/slider'; // Import the community slider
import { useRouter } from 'expo-router';

export default function EarnScreen() {
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [automaticWithdrawal, setAutomaticWithdrawal] = useState(false);
  const [withdrawalMode, setWithdrawalMode] = useState('goal'); // 'goal' or 'timeframe'
  const [thresholdAmount, setThresholdAmount] = useState(50); // Minimum amount for auto-withdrawal
  const [targetGoal, setTargetGoal] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState(3); // Default to 3 months
  const router = useRouter();

  const handleWithdraw = () => {
    console.log(`Withdrawing: $${withdrawAmount}`);
    setWithdrawAmount(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earn</Text>
      <Text style={styles.balanceLabel}>Your Current Earn Balance: $20.50 (200 XLM)</Text>

      <Text style={styles.withdrawLabel}>Amount to Withdraw: ${withdrawAmount.toFixed(2)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={20.50} // Max earn balance
        step={0.1}
        value={withdrawAmount}
        onValueChange={(value) => setWithdrawAmount(value)}
        minimumTrackTintColor="#4CAF50"
        maximumTrackTintColor="#D3D3D3"
        thumbTintColor="#FFFFFF"
      />

      <View style={styles.autoWithdrawContainer}>
        <Text style={styles.autoWithdrawLabel}>Automatic Withdrawal:</Text>
        <Switch
          value={automaticWithdrawal}
          onValueChange={() => setAutomaticWithdrawal((prev) => !prev)}
        />
      </View>

      {automaticWithdrawal && (
        <View style={styles.thresholdContainer}>
          <Text style={styles.thresholdLabel}>Select Automatic Withdrawal Mode:</Text>
          <View style={styles.modeContainer}>
            <TouchableOpacity
              style={[styles.modeButton, withdrawalMode === 'goal' && styles.activeModeButton]}
              onPress={() => setWithdrawalMode('goal')}
            >
              <Text style={styles.modeText}>Target Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeButton, withdrawalMode === 'timeframe' && styles.activeModeButton]}
              onPress={() => setWithdrawalMode('timeframe')}
            >
              <Text style={styles.modeText}>Timeframe</Text>
            </TouchableOpacity>
          </View>

          {withdrawalMode === 'goal' ? (
            <View style={styles.goalInputContainer}>
              <Text style={styles.thresholdLabel}>Set Target Withdrawal Amount:</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter target goal"
                keyboardType="numeric"
                value={targetGoal}
                onChangeText={setTargetGoal}
              />
            </View>
          ) : (
            <View style={styles.timeframeContainer}>
              <Text style={styles.thresholdLabel}>Select Timeframe (Months):</Text>
              <View style={styles.timeframeOptions}>
                {[3, 6, 12].map((month) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.timeframeButton,
                      selectedTimeframe === month && styles.activeTimeframeButton,
                    ]}
                    onPress={() => setSelectedTimeframe(month)}
                  >
                    <Text style={styles.timeframeText}>{month} Months</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <Text style={styles.thresholdLabel}>Minimum Withdrawal Amount:</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100} // Set your desired max threshold
            step={1}
            value={thresholdAmount}
            onValueChange={(value) => setThresholdAmount(value)}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#FFFFFF"
          />
          <Text style={styles.thresholdAmount}>${thresholdAmount}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
        <Text style={styles.buttonText}>Withdraw</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FAFAFA' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 16 },
  balanceLabel: { fontSize: 16, marginBottom: 16 },
  withdrawLabel: { fontSize: 16, marginBottom: 8 },
  slider: { width: '100%', height: 40 },
  autoWithdrawContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  autoWithdrawLabel: { fontSize: 16, marginRight: 10 },
  thresholdContainer: { marginTop: 16 },
  thresholdLabel: { fontSize: 16, marginBottom: 8 },
  goalInputContainer: { marginBottom: 16 },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  modeContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  modeButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    flex: 1,
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#4CAF50',
  },
  modeText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  timeframeContainer: { marginTop: 16 },
  timeframeOptions: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 },
  timeframeButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    flex: 1,
    alignItems: 'center',
  },
  activeTimeframeButton: {
    backgroundColor: '#4CAF50',
  },
  timeframeText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  thresholdAmount: { fontSize: 16, marginTop: 8 },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
