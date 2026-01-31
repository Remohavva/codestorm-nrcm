# Expo Go Troubleshooting Guide

## Error: "java.io.IOException failed to download remote update"

This error is common and usually related to network connectivity or caching issues. Here are multiple solutions to try:

## 🔧 Solution 1: Clear Cache and Restart

### On Your Computer:
```bash
# Clear Expo cache
npx expo start --clear

# If that doesn't work, clear npm cache too
npm cache clean --force
npx expo start --clear
```

### On Your Phone:
1. **Android**: Go to Settings > Apps > Expo Go > Storage > Clear Cache
2. **iOS**: Delete and reinstall Expo Go app

## 🔧 Solution 2: Network Solutions

### Try Tunnel Mode:
```bash
npx expo start --tunnel
```
This routes traffic through Expo's servers and often fixes network issues.

### Check Network:
- Ensure phone and computer are on the same WiFi network
- Try a different WiFi network
- Disable VPN if you're using one
- Try mobile hotspot from another device

## 🔧 Solution 3: Alternative Connection Methods

### Method 1: Manual Connection
1. Start the server: `npx expo start`
2. In Expo Go app, tap "Enter URL manually"
3. Enter: `exp://YOUR_COMPUTER_IP:8081`
4. Replace YOUR_COMPUTER_IP with your actual IP address

### Method 2: Use Localhost Tunnel
```bash
npx expo start --localhost
```

### Method 3: Web Version
```bash
npx expo start --web
```
Test in your phone's browser first.

## 🔧 Solution 4: Check Your IP Address

### Find Your Computer's IP:
**Windows:**
```cmd
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter.

**Example:** If your IP is `192.168.1.100`, use:
- QR Code URL: `exp://192.168.1.100:8081`
- Manual entry: `192.168.1.100:8081`

## 🔧 Solution 5: Firewall and Security

### Windows Firewall:
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Add Node.js and Expo CLI if not listed
4. Enable for both Private and Public networks

### Antivirus:
- Temporarily disable antivirus
- Add Expo CLI to antivirus exceptions

## 🔧 Solution 6: Alternative Development Setup

### Use Expo Development Build:
```bash
npx create-expo-app --template
npx expo run:android
# or
npx expo run:ios
```

### Use React Native CLI:
```bash
npx react-native init CollegeEventApp
cd CollegeEventApp
npx react-native run-android
```

## 🔧 Solution 7: Test with Simple App

I've created a simple test version in `App.js`. Try this first:

```javascript
// Simple test app (already in App.js)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello Expo!</Text>
    </View>
  );
}
```

## 🔧 Solution 8: Update Everything

```bash
# Update Expo CLI
npm install -g @expo/cli@latest

# Update project dependencies
npx expo install --fix

# Update Expo Go app on your phone
```

## 🔧 Solution 9: Check Expo Status

Visit: https://status.expo.dev/
Check if Expo services are experiencing issues.

## 🔧 Solution 10: Use Different Device

- Try on a different phone/tablet
- Try on an emulator:
  ```bash
  npx expo start --android
  npx expo start --ios
  ```

## 📱 Step-by-Step Testing Process

### 1. Basic Test:
```bash
cd college-event-mobile
npx expo start --clear
```
Scan QR code with Expo Go.

### 2. If Step 1 Fails - Try Tunnel:
```bash
npx expo start --tunnel
```

### 3. If Step 2 Fails - Manual Connection:
1. Note your computer's IP address
2. In Expo Go: "Enter URL manually"
3. Type: `exp://YOUR_IP:8081`

### 4. If Step 3 Fails - Web Version:
```bash
npx expo start --web
```
Open in phone browser.

### 5. If All Fail - Check Network:
- Same WiFi network?
- Firewall blocking?
- Try mobile hotspot

## 🚨 Emergency Alternatives

### Option 1: Use Snack (Online)
1. Go to https://snack.expo.dev/
2. Copy your code there
3. Test online

### Option 2: Use Emulator
```bash
# Android Studio emulator
npx expo start --android

# iOS Simulator (Mac only)
npx expo start --ios
```

### Option 3: Web Development
```bash
npx expo start --web
```
Develop in browser, test mobile features later.

## 📞 Getting Help

If none of these work:
1. Check Expo Discord: https://chat.expo.dev/
2. Expo Forums: https://forums.expo.dev/
3. GitHub Issues: https://github.com/expo/expo/issues

## 🔍 Debug Information to Collect

When asking for help, provide:
- Operating system (Windows/Mac/Linux)
- Expo CLI version: `npx expo --version`
- Node.js version: `node --version`
- Phone OS (Android/iOS)
- Expo Go app version
- Network setup (home/office/mobile)
- Exact error message
- Steps you've already tried

## ✅ Success Indicators

You'll know it's working when:
- QR code appears in terminal
- Expo Go successfully scans code
- App loads on your phone
- You see "College Events Mobile App" screen
- Test button shows alert when pressed