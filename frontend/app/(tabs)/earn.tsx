import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, TextInput } from 'react-native';
import Slider from '@react-native-community/slider'; 
import { useRouter } from 'expo-router';
import axios from 'axios'; // for price API
import BottomNav from '../../components/BottomNav';

export default function EarnScreen() {
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [automaticWithdrawal, setAutomaticWithdrawal] = useState(false);
  const [withdrawalMode, setWithdrawalMode] = useState('goal'); // 'goal' or 'timeframe'
  const [thresholdAmount, setThresholdAmount] = useState(50);
  const [targetGoal, setTargetGoal] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState(3);
  const [xlmBalance, setXlmBalance] = useState<number>(200); // Example XLM balance
  const [usdBalance, setUsdBalance] = useState<number>(20); // Example USD balance
  const [previousUsdBalance, setPreviousUsdBalance] = useState<number>(17.50); // Example previous USD balance for PNL
  const [xlmToUsdRate, setXlmToUsdRate] = useState<number>(0.1); // Example rate
  const [addAmount, setAddAmount] = useState(0);

  const router = useRouter();

  useEffect(() => {
    calculatePnl();
  }, []);

  // Calculates the profit/loss percentage based on previous balance
  const calculatePnl = () => {
    const change = usdBalance - previousUsdBalance;
    const percentageChange = ((change / previousUsdBalance) * 100).toFixed(2);
    return { change: change.toFixed(2), percentageChange };
  };

  const handleAddMoney = () => {
    const newBalance = usdBalance + addAmount;
    setUsdBalance(newBalance);  // Update the USD balance
    console.log(`Added: $${addAmount}`);
    setAddAmount(0);  // Reset add amount
  };

  const handleWithdraw = () => {
    console.log(`Withdrawing: $${withdrawAmount}`);
    setWithdrawAmount(0);
  };

  const { change, percentageChange } = calculatePnl();

  const [activeTab, setActiveTab] = useState('add'); // 'add' for Add Money, 'withdraw' for Withdraw

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Earn</Text>

      {/* Balance Display */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Your Earn Balance:</Text>
        <Text style={styles.balance}>${usdBalance.toFixed(2)} (XLM: {xlmBalance.toFixed(2)})</Text>
        <Text style={styles.pnl}>
          {change >= 0 ? '+' : '-'}${change} ({percentageChange}%)
        </Text>
      </View>

      {/* Tab System */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'add' && styles.activeTabButton]}
          onPress={() => setActiveTab('add')}
        >
          <Text style={[styles.tabText, activeTab === 'add' && styles.activeTabText]}>Add Money</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'withdraw' && styles.activeTabButton]}
          onPress={() => setActiveTab('withdraw')}
        >
          <Text style={[styles.tabText, activeTab === 'withdraw' && styles.activeTabText]}>
            Withdraw
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      {activeTab === 'add' ? (
        <View style={styles.tabContent}>
          <Text style={styles.label}>Amount to Add: ${addAmount.toFixed(2)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}  // Example maximum add limit
            step={0.1}
            value={addAmount}
            onValueChange={(value) => setAddAmount(value)}
            minimumTrackTintColor="#2196F3"
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#FFFFFF"
          />
          
          {/* Automatic Withdrawal Toggle */}
          <View style={styles.autoWithdrawContainer}>
            <Text style={styles.autoWithdrawLabel}>Automatic Withdrawal:</Text>
            <Switch
              value={automaticWithdrawal}
              onValueChange={() => setAutomaticWithdrawal((prev) => !prev)}
            />
          </View>

          {/* Automatic Withdrawal Options */}
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

              {/* Goal or Timeframe Input */}
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
                  <Text style={styles.thresholdAmount}>Target goal: ${targetGoal }</Text>

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

              {/* Minimum Withdrawal Slider */}
              {/* <Text style={styles.thresholdLabel}>Minimum Withdrawal Amount:</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={thresholdAmount}
                onValueChange={(value) => setThresholdAmount(value)}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#D3D3D3"
                thumbTintColor="#FFFFFF"
              />
              <Text style={styles.thresholdAmount}>${thresholdAmount}</Text> */}
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={handleAddMoney}>
            <Text style={styles.buttonText}>Add Money</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.tabContent}>
          <Text style={styles.label}>Amount to Withdraw: ${withdrawAmount.toFixed(2)}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={usdBalance}
            step={0.1}
            value={withdrawAmount}
            onValueChange={(value) => setWithdrawAmount(value)}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#D3D3D3"
            thumbTintColor="#FFFFFF"
          />
          <TouchableOpacity style={styles.button} onPress={handleWithdraw}>
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>
      )}
      <BottomNav activeTab="dashboard" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#FAFAFA' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginBottom: 16 },
  balanceCard: {
    backgroundColor: '#81C784',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 16,
  },
  balanceLabel: { fontSize: 18, color: '#FFFFFF' },
  balance: { fontSize: 28, color: '#FFFFFF', fontWeight: 'bold' },
  pnl: { fontSize: 16, color: '#FFFFFF', marginTop: 8 },

  // Tab system styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    padding: 5,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Content inside each tab
  tabContent: {
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  slider: { width: '100%', height: 40, marginBottom: 16 },
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
  autoWithdrawContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  autoWithdrawLabel: { fontSize: 16, marginRight: 8 },
  thresholdContainer: { marginTop: 20 },
  thresholdLabel: { fontSize: 16, marginBottom: 10 },
  modeContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  modeButton: {
    paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, backgroundColor: '#E0E0E0',
  },
  activeModeButton: { backgroundColor: '#4CAF50' },
  modeText: { color: '#FFF', fontSize: 16 },
  goalInputContainer: { marginBottom: 20 },
  input: { borderColor: '#CCC', borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10 },
  timeframeContainer: { marginBottom: 20 },
  timeframeOptions: { flexDirection: 'row', justifyContent: 'space-around' },
  timeframeButton: { padding: 10, backgroundColor: '#E0E0E0', borderRadius: 10 },
  activeTimeframeButton: { backgroundColor: '#4CAF50' },
  timeframeText: { color: '#FFF' },
  thresholdAmount: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginTop: 10 },
});
  

