import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { CustomInput, CustomButton } from '../../components';
import { COLORS, SIZES } from '../../constants/theme';

const AddExpenseScreen = ({ navigation }) => {
  // Form state using useState - Suraj's responsibility
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [splitMethod, setSplitMethod] = useState('equal'); // 'equal' or 'custom'
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Placeholder groups - will be fetched from Firebase
  const groups = [];

  // Basic validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!selectedGroup) {
      newErrors.group = 'Please select a group';
    }

    // Validate custom splits
    if (splitMethod === 'custom') {
      const total = getCustomSplitTotal();
      const expenseAmount = parseFloat(amount) || 0;
      if (Math.abs(total - expenseAmount) > 0.01) {
        newErrors.customSplit = `Split amounts must equal $${expenseAmount.toFixed(2)}. Current: $${total.toFixed(2)}`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle expense submission - will be connected to Firebase by Pawan
  const handleAddExpense = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    // TODO: Pawan will implement Firebase data saving here
    console.log('Adding expense:', { 
      description, 
      amount: parseFloat(amount), 
      groupId: selectedGroup,
      splitMethod 
    });
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Clear form after success
      setDescription('');
      setAmount('');
      setSelectedGroup(null);
    }, 1000);
  };

  // Split equally among selected members
  const splitEqually = () => {
    if (!amount || groupMembers.length === 0) return;
    const perPerson = (parseFloat(amount) / groupMembers.length).toFixed(2);
    const newSplits = {};
    groupMembers.forEach(member => {
      newSplits[member.id] = perPerson;
    });
    setCustomSplits(newSplits);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Expense</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <CustomInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="What was this expense for?"
          error={errors.description}
        />

        <CustomInput
          label="Total Amount ($)"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          keyboardType="decimal-pad"
          error={errors.amount}
        />

        {/* Group Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Group</Text>
          {groups.length === 0 ? (
            <Text style={styles.noGroupsText}>
              No groups available. Create a group first!
            </Text>
          ) : (
            groups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={[
                  styles.groupOption,
                  selectedGroup === group.id && styles.groupOptionSelected,
                ]}
                onPress={() => setSelectedGroup(group.id)}
              >
                <Text style={[
                  styles.groupOptionText,
                  selectedGroup === group.id && styles.groupOptionTextSelected,
                ]}>
                  {group.name}
                </Text>
                <Text style={styles.memberCountText}>
                  {group.members?.length || 0} members
                </Text>
              </TouchableOpacity>
            ))
          )}
          {errors.group && <Text style={styles.errorText}>{errors.group}</Text>}
        </View>

        {/* Split Method */}
        {selectedGroup && groupMembers.length > 0 && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Split Method</Text>
              <View style={styles.splitOptions}>
                <TouchableOpacity
                  style={[
                    styles.splitOption,
                    splitMethod === 'equal' && styles.splitOptionSelected,
                  ]}
                  onPress={() => setSplitMethod('equal')}
                >
                  <Text style={[
                    styles.splitOptionText,
                    splitMethod === 'equal' && styles.splitOptionTextSelected,
                  ]}>
                    Equal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.splitOption,
                    splitMethod === 'custom' && styles.splitOptionSelected,
                  ]}
                  onPress={() => {
                    setSplitMethod('custom');
                    splitEqually(); // Pre-fill with equal amounts
                  }}
                >
                  <Text style={[
                    styles.splitOptionText,
                    splitMethod === 'custom' && styles.splitOptionTextSelected,
                  ]}>
                    Custom
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Split Details */}
            <View style={styles.section}>
              <Text style={styles.label}>Split Details</Text>
              
              {splitMethod === 'equal' ? (
                // Equal Split View
                <View style={styles.equalSplitContainer}>
                  <View style={styles.splitSummary}>
                    <Text style={styles.splitSummaryText}>
                      Total: ${parseFloat(amount || 0).toFixed(2)} ÷ {groupMembers.length} members
                    </Text>
                    <Text style={styles.perPersonAmount}>
                      = ${getPerPersonAmount().toFixed(2)} each
                    </Text>
                  </View>
                  
                  {groupMembers.map(member => (
                    <View key={member.id} style={styles.memberSplitRow}>
                      <Text style={styles.memberName}>
                        {member.name} {member.id === user.uid ? '(You)' : ''}
                      </Text>
                      <Text style={styles.memberAmount}>
                        ${getPerPersonAmount().toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                // Custom Split View
                <View style={styles.customSplitContainer}>
                  <View style={styles.remainingContainer}>
                    <Text style={styles.remainingLabel}>Remaining to assign:</Text>
                    <Text style={[
                      styles.remainingAmount,
                      Math.abs(getRemainingAmount()) < 0.01 ? styles.remainingComplete : 
                      getRemainingAmount() < 0 ? styles.remainingOver : null
                    ]}>
                      ${getRemainingAmount().toFixed(2)}
                    </Text>
                  </View>
                  
                  {groupMembers.map(member => (
                    <View key={member.id} style={styles.customSplitRow}>
                      <Text style={styles.memberName}>
                        {member.name} {member.id === user.uid ? '(You)' : ''}
                      </Text>
                      <View style={styles.customInputContainer}>
                        <Text style={styles.dollarSign}>$</Text>
                        <CustomInput
                          value={customSplits[member.id] || ''}
                          onChangeText={(val) => updateCustomSplit(member.id, val)}
                          placeholder="0.00"
                          keyboardType="decimal-pad"
                        />
                      </View>
                    </View>
                  ))}
                  
                  <TouchableOpacity 
                    style={styles.splitEquallyButton}
                    onPress={splitEqually}
                  >
                    <Text style={styles.splitEquallyText}>Split Equally</Text>
                  </TouchableOpacity>
                  
                  {errors.customSplit && (
                    <Text style={styles.errorText}>{errors.customSplit}</Text>
                  )}
                </View>
              )}
            </View>
          </>
        )}

        {loadingMembers && (
          <Text style={styles.loadingText}>Loading members...</Text>
        )}

        <CustomButton
          title="Add Expense"
          onPress={handleAddExpense}
          loading={loading}
        />
      </ScrollView>
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
    padding: SIZES.large,
  },
  section: {
    marginBottom: SIZES.large,
  },
  label: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: SIZES.base,
    fontWeight: '500',
  },
  noGroupsText: {
    color: COLORS.gray,
    fontSize: 14,
    fontStyle: 'italic',
  },
  loadingText: {
    color: COLORS.gray,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  groupOption: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: SIZES.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  groupOptionText: {
    fontSize: 16,
    color: COLORS.black,
  },
  groupOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  memberCountText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  splitOptions: {
    flexDirection: 'row',
    gap: SIZES.base,
  },
  splitOption: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    alignItems: 'center',
  },
  splitOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  splitOptionText: {
    fontSize: 16,
    color: COLORS.black,
  },
  splitOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  // Equal Split Styles
  equalSplitContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
  },
  splitSummary: {
    backgroundColor: COLORS.primary + '10',
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    marginBottom: SIZES.medium,
    alignItems: 'center',
  },
  splitSummaryText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  perPersonAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  memberSplitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  memberName: {
    fontSize: 14,
    color: COLORS.black,
    flex: 1,
  },
  memberAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Custom Split Styles
  customSplitContainer: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
  },
  remainingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    marginBottom: SIZES.medium,
  },
  remainingLabel: {
    fontSize: 14,
    color: COLORS.gray,
  },
  remainingAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  remainingComplete: {
    color: COLORS.success,
  },
  remainingOver: {
    color: COLORS.error,
  },
  customSplitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  dollarSign: {
    fontSize: 16,
    color: COLORS.gray,
    marginRight: 4,
  },
  splitEquallyButton: {
    backgroundColor: COLORS.primary + '15',
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    alignItems: 'center',
    marginTop: SIZES.base,
  },
  splitEquallyText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default AddExpenseScreen;

