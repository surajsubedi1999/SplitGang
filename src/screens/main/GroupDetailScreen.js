// GroupDetailScreen - Krishna Subedi
// Displays group expenses, member balances, and settlement suggestions
import React, { useEffect, useCallback, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal
} from 'react-native';
import { CustomButton } from '../../components';
import { COLORS, SIZES } from '../../constants/theme';
import { useData } from '../../context';
import { useAuth } from '../../context';
import { settleExpense } from '../../services';

const GroupDetailScreen = ({ route, navigation }) => {
  const { groupId } = route.params;
  const { user } = useAuth();
  const { 
    currentGroup, 
    expenses, 
    members,
    balances,
    settlements,
    loading,
    fetchGroupDetails,
    getCurrentUserSummary,
    getTotalSpending,
    refreshCurrentGroup
  } = useData();

  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [showExpenseDetail, setShowExpenseDetail] = useState(null);

  // Fetch group details on mount
  useEffect(() => {
    fetchGroupDetails(groupId);
  }, [groupId, fetchGroupDetails]);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    await refreshCurrentGroup();
  }, [refreshCurrentGroup]);

  // Get member name by ID
  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId);
    return member?.name || 'Unknown';
  };

  // Handle settle expense
  const handleSettleExpense = async (expenseId) => {
    Alert.alert(
      'Settle Expense',
      'Mark this expense as settled?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Settle',
          onPress: async () => {
            const result = await settleExpense(expenseId);
            if (result.success) {
              refreshCurrentGroup();
            } else {
              Alert.alert('Error', result.error);
            }
          }
        }
      ]
    );
  };

  // Handle settlement confirmation
  const handleSettleUp = (settlement) => {
    setSelectedSettlement(settlement);
    setShowSettleModal(true);
  };

  const confirmSettleUp = () => {
    Alert.alert(
      'Settlement Recorded',
      `${selectedSettlement.fromName} paid $${selectedSettlement.amount.toFixed(2)} to ${selectedSettlement.toName}`,
      [{ text: 'OK' }]
    );
    setShowSettleModal(false);
    setSelectedSettlement(null);
  };

  // Render expense item with split details
  const renderExpenseItem = ({ item }) => {
    const memberCount = Object.keys(item.splits || {}).length || currentGroup?.members?.length || 1;
    const perPerson = item.amount / memberCount;
    
    return (
      <TouchableOpacity 
        style={styles.expenseCard}
        onPress={() => setShowExpenseDetail(item)}
      >
        <View style={styles.expenseHeader}>
          <Text style={styles.expenseDescription}>{item.description}</Text>
          <Text style={styles.expenseAmount}>${item.amount?.toFixed(2)}</Text>
        </View>
        <Text style={styles.expensePaidBy}>
          Paid by {item.paidByName || getMemberName(item.paidBy)}
        </Text>
        <View style={styles.expenseFooter}>
          <View style={styles.splitInfo}>
            <Text style={styles.expenseSplit}>
              {item.splitMethod === 'custom' ? 'Custom split' : `$${perPerson.toFixed(2)}/person`}
            </Text>
            <Text style={styles.memberCountBadge}>{memberCount} people</Text>
          </View>
          {item.settled ? (
            <View style={styles.settledBadge}>
              <Text style={styles.settledText}>Settled</Text>
            </View>
          ) : (
            <Text style={styles.tapForDetails}>Tap for details</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render balance item
  const renderBalanceItem = (memberId) => {
    const balance = balances[memberId] || 0;
    const memberName = getMemberName(memberId);
    const isCurrentUser = memberId === user?.uid;
    
    return (
      <View key={memberId} style={styles.balanceItem}>
        <Text style={[styles.balanceName, isCurrentUser && styles.currentUser]}>
          {memberName} {isCurrentUser ? '(You)' : ''}
        </Text>
        <Text style={[
          styles.balanceAmount,
          balance > 0.01 ? styles.positiveBalance : balance < -0.01 ? styles.negativeBalance : null
        ]}>
          {balance > 0 ? '+' : ''}{balance.toFixed(2)}
        </Text>
      </View>
    );
  };

  // Render settlement suggestion
  const renderSettlement = (settlement, index) => (
    <TouchableOpacity 
      key={index} 
      style={styles.settlementItem}
      onPress={() => handleSettleUp(settlement)}
    >
      <View style={styles.settlementInfo}>
        <Text style={styles.settlementText}>
          <Text style={styles.settlementName}>{settlement.fromName}</Text>
          {' → '}
          <Text style={styles.settlementName}>{settlement.toName}</Text>
        </Text>
        <Text style={styles.settlementAmount}>${settlement.amount.toFixed(2)}</Text>
      </View>
      <Text style={styles.tapToSettle}>Tap to settle</Text>
    </TouchableOpacity>
  );

  const userSummary = getCurrentUserSummary();
  const totalSpending = getTotalSpending();

  // Header component for FlatList
  const ListHeader = () => (
    <>
      {/* Group Info */}
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{currentGroup?.name || 'Group'}</Text>
        <Text style={styles.groupDescription}>
          {currentGroup?.description || 'No description'}
        </Text>
        <View style={styles.memberInfo}>
          <Text style={styles.memberCount}>
            {members.length} / {currentGroup?.expectedMembers || '?'} members
          </Text>
          {currentGroup?.groupCode && (
            <TouchableOpacity 
              style={styles.shareCodeButton}
              onPress={() => setShowCodeModal(true)}
            >
              <Text style={styles.shareCodeText}>Share Code</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Your Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.sectionTitle}>Your Balance</Text>
        <Text style={[
          styles.yourBalance,
          userSummary.isOwed ? styles.positiveBalance : 
          userSummary.owes ? styles.negativeBalance : null
        ]}>
          {userSummary.isOwed ? '+' : userSummary.owes ? '-' : ''}
          ${userSummary.displayAmount.toFixed(2)}
        </Text>
        <Text style={styles.balanceStatus}>
          {userSummary.isOwed 
            ? 'You are owed money' 
            : userSummary.owes 
              ? 'You owe money' 
              : 'All settled up!'}
        </Text>
      </View>

      {/* Member Balances */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Member Balances</Text>
        <View style={styles.balancesContainer}>
          {currentGroup?.members?.map(renderBalanceItem)}
        </View>
      </View>

      {/* Settlements */}
      {settlements.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Settlements</Text>
          <View style={styles.settlementsContainer}>
            {settlements.map(renderSettlement)}
          </View>
        </View>
      )}

      {/* Total Spending */}
      <View style={styles.totalSpending}>
        <Text style={styles.totalLabel}>Total Group Spending</Text>
        <Text style={styles.totalAmount}>${totalSpending.toFixed(2)}</Text>
      </View>

      {/* Expenses Header */}
      <Text style={[styles.sectionTitle, { paddingHorizontal: SIZES.medium }]}>
        Expenses ({expenses.filter(e => !e.settled).length} active)
      </Text>
    </>
  );

  // Empty expenses state
  const renderEmptyExpenses = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No expenses yet</Text>
      <Text style={styles.emptySubtext}>Add your first expense to start splitting!</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Details</Text>
        <View style={{ width: 50 }} />
      </View>

      <FlatList
        data={expenses}
        keyExtractor={(item) => item.id}
        renderItem={renderExpenseItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={renderEmptyExpenses}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      />

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Add Expense"
          onPress={() => navigation.navigate('AddExpense')}
        />
      </View>

      {/* Group Code Modal */}
      <Modal
        visible={showCodeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCodeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Group Code</Text>
            <Text style={styles.modalSubtitle}>Share this code to invite members:</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{currentGroup?.groupCode}</Text>
            </View>
            <Text style={styles.modalInfo}>
              Members can join using this 6-digit code
            </Text>
            <CustomButton
              title="Close"
              onPress={() => setShowCodeModal(false)}
              variant="outline"
            />
          </View>
        </View>
      </Modal>

      {/* Settle Up Modal */}
      <Modal
        visible={showSettleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSettleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Settle Up</Text>
            {selectedSettlement && (
              <>
                <Text style={styles.settleModalText}>
                  <Text style={styles.settleName}>{selectedSettlement.fromName}</Text>
                  {' pays '}
                  <Text style={styles.settleName}>{selectedSettlement.toName}</Text>
                </Text>
                <Text style={styles.settleAmount}>
                  ${selectedSettlement.amount.toFixed(2)}
                </Text>
                <Text style={styles.settleInstruction}>
                  Confirm when the payment has been made
                </Text>
              </>
            )}
            <CustomButton
              title="Confirm Payment"
              onPress={confirmSettleUp}
            />
            <CustomButton
              title="Cancel"
              onPress={() => setShowSettleModal(false)}
              variant="outline"
            />
          </View>
        </View>
      </Modal>

      {/* Expense Detail Modal */}
      <Modal
        visible={showExpenseDetail !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExpenseDetail(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {showExpenseDetail && (
              <>
                <Text style={styles.modalTitle}>{showExpenseDetail.description}</Text>
                <Text style={styles.expenseDetailAmount}>
                  ${showExpenseDetail.amount?.toFixed(2)}
                </Text>
                <Text style={styles.expenseDetailPaidBy}>
                  Paid by {showExpenseDetail.paidByName || getMemberName(showExpenseDetail.paidBy)}
                </Text>
                
                <View style={styles.splitBreakdown}>
                  <Text style={styles.splitBreakdownTitle}>
                    Split Breakdown ({showExpenseDetail.splitMethod})
                  </Text>
                  {showExpenseDetail.splits ? (
                    Object.entries(showExpenseDetail.splits).map(([memberId, amount]) => (
                      <View key={memberId} style={styles.splitRow}>
                        <Text style={styles.splitMemberName}>
                          {getMemberName(memberId)} 
                          {memberId === user?.uid ? ' (You)' : ''}
                        </Text>
                        <Text style={styles.splitMemberAmount}>
                          ${amount.toFixed(2)}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noSplitData}>
                      Equal split: ${(showExpenseDetail.amount / (currentGroup?.members?.length || 1)).toFixed(2)} each
                    </Text>
                  )}
                </View>

                {!showExpenseDetail.settled && (
                  <CustomButton
                    title="Mark as Settled"
                    onPress={() => {
                      handleSettleExpense(showExpenseDetail.id);
                      setShowExpenseDetail(null);
                    }}
                  />
                )}
                <CustomButton
                  title="Close"
                  onPress={() => setShowExpenseDetail(null)}
                  variant="outline"
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  listContent: {
    paddingBottom: SIZES.large,
  },
  groupInfo: {
    backgroundColor: COLORS.primary,
    padding: SIZES.large,
    alignItems: 'center',
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.medium,
  },
  memberCount: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
  },
  shareCodeButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.medium,
    paddingVertical: 4,
    borderRadius: 4,
  },
  shareCodeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  balanceCard: {
    backgroundColor: COLORS.white,
    margin: SIZES.medium,
    padding: SIZES.large,
    borderRadius: SIZES.base,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  yourBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: SIZES.base,
  },
  balanceStatus: {
    fontSize: 14,
    color: COLORS.gray,
  },
  section: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.medium,
    marginBottom: SIZES.medium,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  balancesContainer: {
    gap: SIZES.base,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  balanceName: {
    fontSize: 14,
    color: COLORS.black,
  },
  currentUser: {
    fontWeight: '600',
  },
  balanceAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  positiveBalance: {
    color: COLORS.success,
  },
  negativeBalance: {
    color: COLORS.error,
  },
  settlementsContainer: {
    gap: SIZES.base,
  },
  settlementItem: {
    backgroundColor: COLORS.background,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
  },
  settlementInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settlementText: {
    fontSize: 14,
    color: COLORS.black,
    flex: 1,
  },
  settlementName: {
    fontWeight: '600',
  },
  settlementAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  tapToSettle: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
  },
  totalSpending: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.medium,
    marginBottom: SIZES.medium,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  expenseCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.medium,
    marginTop: SIZES.base,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.black,
    flex: 1,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  expensePaidBy: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 4,
  },
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  splitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
  },
  expenseSplit: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  memberCountBadge: {
    fontSize: 11,
    color: COLORS.gray,
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tapForDetails: {
    fontSize: 11,
    color: COLORS.gray,
  },
  settledBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SIZES.base,
    paddingVertical: 2,
    borderRadius: 4,
  },
  settledText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '500',
  },
  emptyState: {
    padding: SIZES.xlarge,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.gray,
  },
  buttonContainer: {
    padding: SIZES.medium,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.xlarge,
    width: '85%',
    alignItems: 'center',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SIZES.base,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SIZES.large,
  },
  codeBox: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.large,
    paddingHorizontal: SIZES.xlarge * 2,
    borderRadius: SIZES.base,
    marginBottom: SIZES.medium,
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 6,
  },
  modalInfo: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: SIZES.large,
  },
  settleModalText: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: SIZES.base,
  },
  settleName: {
    fontWeight: 'bold',
  },
  settleAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: SIZES.medium,
  },
  settleInstruction: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SIZES.large,
    textAlign: 'center',
  },
  // Expense Detail Modal
  expenseDetailAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: SIZES.base,
  },
  expenseDetailPaidBy: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SIZES.large,
  },
  splitBreakdown: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    marginBottom: SIZES.large,
  },
  splitBreakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: SIZES.base,
    textTransform: 'capitalize',
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  splitMemberName: {
    fontSize: 14,
    color: COLORS.black,
  },
  splitMemberAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  noSplitData: {
    fontSize: 14,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
});

export default GroupDetailScreen;
