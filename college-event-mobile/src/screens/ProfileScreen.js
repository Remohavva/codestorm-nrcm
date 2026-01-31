import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard} gradient>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
        </View>
      </Card>

      <View style={styles.menuSection}>
        <Card style={styles.menuCard}>
          <View style={styles.menuItem}>
            <Ionicons name="person-outline" size={24} color={COLORS.textSecondary} />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Text style={styles.comingSoon}>Soon</Text>
          </View>
        </Card>

        <Card style={styles.menuCard}>
          <View style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.textSecondary} />
            <Text style={styles.menuText}>Notifications</Text>
            <Text style={styles.comingSoon}>Soon</Text>
          </View>
        </Card>

        <Card style={styles.menuCard}>
          <View style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color={COLORS.textSecondary} />
            <Text style={styles.menuText}>Settings</Text>
            <Text style={styles.comingSoon}>Soon</Text>
          </View>
        </Card>

        <Card style={styles.menuCard}>
          <View style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color={COLORS.textSecondary} />
            <Text style={styles.menuText}>Help & Support</Text>
            <Text style={styles.comingSoon}>Soon</Text>
          </View>
        </Card>
      </View>

      <View style={styles.logoutSection}>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  profileCard: {
    margin: SPACING.md,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  roleBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  roleText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  menuSection: {
    padding: SPACING.md,
    paddingTop: 0,
  },
  menuCard: {
    marginBottom: SPACING.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  menuText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginLeft: SPACING.md,
    flex: 1,
  },
  comingSoon: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  logoutSection: {
    padding: SPACING.md,
  },
  logoutButton: {
    borderColor: COLORS.error,
  },
});

export default ProfileScreen;