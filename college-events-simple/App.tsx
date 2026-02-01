import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';

export default function App() {
  const [testMessage, setTestMessage] = useState('App loaded successfully!');

  const testFunction = () => {
    setTestMessage('Button works!');
    Alert.alert('Success', 'The app is working correctly!');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient 
        colors={['#E8E8E8', '#C0C0C0', '#A8A8A8']} 
        style={styles.header}
      >
        <Text style={styles.headerTitle}>College Events - Test</Text>
        <Ionicons name="school" size={24} color="#000" />
      </LinearGradient>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>App Loading Test</Text>
          <Text style={styles.cardText}>{testMessage}</Text>
          
          <TouchableOpacity style={styles.button} onPress={testFunction}>
            <Text style={styles.buttonText}>Test Button</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status Check</Text>
          <Text style={styles.cardText}>✅ React Native components working</Text>
          <Text style={styles.cardText}>✅ Expo Linear Gradient working</Text>
          <Text style={styles.cardText}>✅ Expo Vector Icons working</Text>
          <Text style={styles.cardText}>✅ State management working</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});