import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { CustomInput, CustomButton } from '../../components';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context';
import { getUserGroups, createExpense } from '../../services';

const AddExpenseScreen = ({ navigation }) => {
  const { user } = useAuth();
  
  // Form state using useState - Suraj's responsibility
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [splitMethod, setSplitMethod] = useState('equal');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Groups fetched from Firestore - Pawan's implementation
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  // Fetch user's groups
  useEffect(() => {
    const fetchGroups = async () => {
      if (user?.uid) {
        const result = await getUserGroups(user.uid);
        if (result.success) {
          setGroups(result.groups);
        }
      }
      setLoadingGroups(false);
    };
    fetchGroups();
  }, [user]);

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

  // Handle expense submission with Firebase - Pawan's implementation
  const handleAddExpense = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    const expenseData = {
      description: description.trim(),
      amount: parseFloat(amount),
      groupId: selectedGroup,
      paidBy: user.uid,
      paidByName: user.name,
      splitMethod: splitMethod,
      createdBy: user.uid
    };
    
    const result = await createExpense(expenseData);
    setLoading(false);
    
    if (result.success) {
      Alert.alert('Success', 'Expense added successfully!', [
        { 
          text: 'OK', 
          onPress: () => {
            setDescription('');
            setAmount('');
            setSelectedGroup(null);
          }
        }
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
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
          {loadingGroups ? (
            <Text style={styles.loadingText}>Loading groups...</Text>
          ) : groups.length === 0 ? (
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
          disabled={groups.length === 0}
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
  loadingText: {
    color: COLORS.gray,
    fontSize: 14,
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
