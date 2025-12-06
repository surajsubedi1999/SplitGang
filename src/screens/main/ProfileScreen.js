import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { CustomButton } from '../../components';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context';
import { getUserGroups } from '../../services';

const ProfileScreen = ({ navigation }) => {
  // Get user and logout from AuthContext - Pawan's implementation
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    groupCount: 0,
    totalOwed: 0,
    youOwe: 0
  });

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      if (user?.uid) {
        const result = await getUserGroups(user.uid);
        if (result.success) {
          setStats(prev => ({
            ...prev,
            groupCount: result.groups.length
          }));
        }
      }
    };
    fetchStats();
  }, [user]);

  // Handle logout with Firebase - Pawan's implementation
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
            const result = await logout();
            setLoading(false);
            
            if (!result.success) {
              Alert.alert('Error', result.error);
            }
            // Navigation is handled automatically by AuthContext
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
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.groupCount}</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>${stats.totalOwed.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Owed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>${stats.youOwe.toFixed(2)}</Text>
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
