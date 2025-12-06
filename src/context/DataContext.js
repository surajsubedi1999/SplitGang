// DataContext - Krishna Subedi
// Global state management for groups and expenses using Context API
import React, { createContext, useState, useContext, useCallback } from 'react';
import { getUserGroups, getGroupExpenses, getUsers } from '../services';
import { calculateBalances, calculateSettlements, getUserSummary, calculateTotalSpending } from '../utils';
import { useAuth } from './AuthContext';

const DataContext = createContext({});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Global state
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [balances, setBalances] = useState({});
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all groups for current user
  const fetchGroups = useCallback(async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    const result = await getUserGroups(user.uid);
    if (result.success) {
      setGroups(result.groups);
    }
    setLoading(false);
    return result;
  }, [user]);

  // Fetch group details including expenses and calculate balances
  const fetchGroupDetails = useCallback(async (groupId) => {
    if (!groupId) return;
    
    setLoading(true);
    
    // Find group from state or fetch it
    let group = groups.find(g => g.id === groupId);
    if (group) {
      setCurrentGroup(group);
    }

    // Fetch expenses for this group
    const expensesResult = await getGroupExpenses(groupId);
    if (expensesResult.success) {
      setExpenses(expensesResult.expenses);
      
      // Fetch member details
      if (group?.members?.length > 0) {
        const membersResult = await getUsers(group.members);
        if (membersResult.success) {
          setMembers(membersResult.users);
          
          // Create member names mapping
          const memberNames = {};
          membersResult.users.forEach(m => {
            memberNames[m.id] = m.name;
          });

          // Calculate balances using Krishna's algorithm
          const calculatedBalances = calculateBalances(
            expensesResult.expenses, 
            group.members
          );
          setBalances(calculatedBalances);

          // Calculate settlements
          const calculatedSettlements = calculateSettlements(
            calculatedBalances, 
            memberNames
          );
          setSettlements(calculatedSettlements);
        }
      }
    }
    
    setLoading(false);
  }, [groups]);

  // Get user's balance summary across all groups
  const getUserTotalSummary = useCallback(() => {
    let totalOwed = 0;
    let totalOwing = 0;

    // This would need to aggregate across all groups
    // For now, return current group balance
    if (user?.uid && balances[user.uid]) {
      const balance = balances[user.uid];
      if (balance > 0) {
        totalOwed = balance;
      } else {
        totalOwing = Math.abs(balance);
      }
    }

    return {
      totalOwed: Math.round(totalOwed * 100) / 100,
      totalOwing: Math.round(totalOwing * 100) / 100
    };
  }, [user, balances]);

  // Get current user's summary for a group
  const getCurrentUserSummary = useCallback(() => {
    if (!user?.uid) return { balance: 0, isOwed: false, owes: false, displayAmount: 0 };
    return getUserSummary(balances, user.uid);
  }, [user, balances]);

  // Get total spending for current group
  const getTotalSpending = useCallback(() => {
    return calculateTotalSpending(expenses);
  }, [expenses]);

  // Clear current group data
  const clearCurrentGroup = useCallback(() => {
    setCurrentGroup(null);
    setExpenses([]);
    setMembers([]);
    setBalances({});
    setSettlements([]);
  }, []);

  // Refresh current group data
  const refreshCurrentGroup = useCallback(async () => {
    if (currentGroup?.id) {
      await fetchGroupDetails(currentGroup.id);
    }
  }, [currentGroup, fetchGroupDetails]);

  const value = {
    // State
    groups,
    currentGroup,
    expenses,
    members,
    balances,
    settlements,
    loading,
    
    // Actions
    fetchGroups,
    fetchGroupDetails,
    clearCurrentGroup,
    refreshCurrentGroup,
    
    // Computed values
    getUserTotalSummary,
    getCurrentUserSummary,
    getTotalSpending
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;

