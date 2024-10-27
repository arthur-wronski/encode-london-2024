import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import BottomNav from '../../components/BottomNav'; // Ensure the path is correct

export default function Settings() {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);

  const toggleNotifications = () => setIsNotificationsEnabled(previousState => !previousState);
  const toggleBiometrics = () => setIsBiometricsEnabled(previousState => !previousState);
  const toggleDarkMode = () => setIsDarkModeEnabled(previousState => !previousState);
  const toggleLocation = () => setIsLocationEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingOption}>
        <Text style={styles.optionText}>Enable Notifications</Text>
        <Switch 
          value={isNotificationsEnabled} 
          onValueChange={toggleNotifications} 
          trackColor={{ false: "#767577", true: "#4CAF50" }}
          thumbColor={isNotificationsEnabled ? "#FFFFFF" : "#f4f3f4"}
        />
      </View>

      <View style={styles.settingOption}>
        <Text style={styles.optionText}>Use Biometrics for Login</Text>
        <Switch 
          value={isBiometricsEnabled} 
          onValueChange={toggleBiometrics} 
          trackColor={{ false: "#767577", true: "#4CAF50" }}
          thumbColor={isBiometricsEnabled ? "#FFFFFF" : "#f4f3f4"}
        />
      </View>

      <View style={styles.settingOption}>
        <Text style={styles.optionText}>Enable Dark Mode</Text>
        <Switch 
          value={isDarkModeEnabled} 
          onValueChange={toggleDarkMode} 
          trackColor={{ false: "#767577", true: "#4CAF50" }}
          thumbColor={isDarkModeEnabled ? "#FFFFFF" : "#f4f3f4"}
        />
      </View>

      <View style={styles.settingOption}>
        <Text style={styles.optionText}>Enable Location Services</Text>
        <Switch 
          value={isLocationEnabled} 
          onValueChange={toggleLocation} 
          trackColor={{ false: "#767577", true: "#4CAF50" }}
          thumbColor={isLocationEnabled ? "#FFFFFF" : "#f4f3f4"}
        />
      </View>

      <BottomNav activeTab="settings" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 20 },
  title: { fontSize: 24, color: '#4CAF50', fontWeight: 'bold', marginBottom: 20 },
  settingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  optionText: {
    fontSize: 18,
    color: '#4CAF50',
  },
});
