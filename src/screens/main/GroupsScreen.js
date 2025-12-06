import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { CustomButton } from '../../components';
import { COLORS, SIZES } from '../../constants/theme';

const GroupsScreen = ({ navigation }) => {
  // Placeholder groups - will be fetched from Firebase by Pawan
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // Render individual group card
  const renderGroupItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.groupCard}
      onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}
    >
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupMembers}>{item.memberCount} members</Text>
      <Text style={styles.groupBalance}>
        Your balance: ${item.balance?.toFixed(2) || '0.00'}
      </Text>
    </TouchableOpacity>
  );

  // Empty state
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Groups Yet</Text>
      <Text style={styles.emptyText}>
        Create a group to start splitting expenses with friends!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Groups</Text>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroupItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Create New Group"
          onPress={() => navigation.navigate('CreateGroup')}
        />
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
  listContent: {
    flexGrow: 1,
    padding: SIZES.medium,
  },
  groupCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    marginBottom: SIZES.medium,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 8,
  },
  groupBalance: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xlarge,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
});

export default GroupsScreen;

