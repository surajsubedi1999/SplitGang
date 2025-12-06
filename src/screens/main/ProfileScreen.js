import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { CustomButton } from '../../components';
import { COLORS, SIZES } from '../../constants/theme';

const ProfileScreen = ({ navigation }) => {
  // User state - will be populated from Firebase by Pawan
  const [user, setUser] = useState({
    name: 'Test User',
    email: 'test@example.com',
  });
  const [loading, setLoading] = useState(false);

  // Handle logout - will be connected to Firebase by Pawan
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            // TODO: Pawan will implement Firebase logout here
            console.log('Logging out...');
            setTimeout(() => {
              setLoading(false);
              // Navigation to auth will be handled after Firebase integration
            }, 500);
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>$0.00</Text>
            <Text style={styles.statLabel}>Total Owed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>$0.00</Text>
            <Text style={styles.statLabel}>You Owe</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            loading={loading}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.large,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  content: {
    flex: 1,
    padding: SIZES.large,
  },
  userCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.xlarge,
    borderRadius: SIZES.base,
    alignItems: 'center',
    marginBottom: SIZES.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.gray,
  },
  statsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    flexDirection: 'row',
    padding: SIZES.large,
    marginBottom: SIZES.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.lightGray,
  },
  actions: {
    marginTop: 'auto',
  },
});

export default ProfileScreen;

