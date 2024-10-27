import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomNav = ({ activeTab }: { activeTab: string }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={activeTab === 'dashboard' ? styles.activeButton : styles.button}
        onPress={() => router.replace('dashboard')}
      >
        <Icon name="home-outline" size={24} color={activeTab === 'dashboard' ? '#FFFFFF' : '#4CAF50'} />
        <Text style={activeTab === 'dashboard' ? styles.activeText : styles.text}>Dashboard</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={activeTab === 'transactions' ? styles.activeButton : styles.button}
        onPress={() => router.replace('transactions')}
      >
        <Icon name="wallet-outline" size={24} color={activeTab === 'transactions' ? '#FFFFFF' : '#4CAF50'} />
        <Text style={activeTab === 'transactions' ? styles.activeText : styles.text}>Transactions</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={activeTab === 'settings' ? styles.activeButton : styles.button}
        onPress={() => router.replace('settings')}
      >
        <Icon name="settings-outline" size={24} color={activeTab === 'settings' ? '#FFFFFF' : '#4CAF50'} />
        <Text style={activeTab === 'settings' ? styles.activeText : styles.text}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF', // Set background to white
    borderTopWidth: 1,
    borderTopColor: '#A5D6A7',
    position: 'absolute',  // Fixed position
    bottom: 0,             // Align to the bottom
    left: 0,               // Align to the left
    right: 0,              // Align to the right
  },
  button: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  activeButton: {
    alignItems: 'center',
    backgroundColor: '#4CAF50', // Green background for active tab
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10, // Add some horizontal padding for better spacing
  },
  text: {
    color: '#4CAF50', // Green color for inactive text
    fontWeight: '600',
    fontSize: 12,
  },
  activeText: {
    color: '#FFFFFF', // White color for active text
    fontWeight: '600',
    fontSize: 12,
  },
});

export default BottomNav;
