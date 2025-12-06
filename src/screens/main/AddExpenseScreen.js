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
          label="Amount ($)"
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
              </TouchableOpacity>
            ))
          )}
          {errors.group && <Text style={styles.errorText}>{errors.group}</Text>}
        </View>

        {/* Split Method */}
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
              onPress={() => setSplitMethod('custom')}
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
  groupOption: {
    backgroundColor: COLORS.white,
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    marginBottom: SIZES.base,
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
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default AddExpenseScreen;

