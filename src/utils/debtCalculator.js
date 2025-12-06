// Debt Calculator Utility - Krishna Subedi
// Core algorithm to calculate net balances for group members

/**
 * Calculate balances for all members in a group based on expenses
 * @param {Array} expenses - Array of expense objects
 * @param {Array} members - Array of member user IDs
 * @returns {Object} - Object with balances for each member
 */
export const calculateBalances = (expenses, members) => {
  // Initialize balances for each member
  const balances = {};
  members.forEach(memberId => {
    balances[memberId] = 0;
  });

  // Process each expense
  expenses.forEach(expense => {
    if (expense.settled) return; // Skip settled expenses

    const { amount, paidBy, splitMethod, splits } = expense;
    const memberCount = members.length;

    if (memberCount === 0) return;

    // The person who paid gets credit for the full amount
    if (balances[paidBy] !== undefined) {
      balances[paidBy] += amount;
    }

    // Deduct each person's share
    if (splits && Object.keys(splits).length > 0) {
      // Use stored split amounts (works for both equal and custom)
      Object.entries(splits).forEach(([memberId, splitAmount]) => {
        if (balances[memberId] !== undefined) {
          balances[memberId] -= splitAmount;
        }
      });
    } else if (splitMethod === 'equal') {
      // Fallback: Equal split if no splits stored
      const sharePerPerson = amount / memberCount;
      members.forEach(memberId => {
        balances[memberId] -= sharePerPerson;
      });
    }
  });

  // Round all balances to 2 decimal places
  Object.keys(balances).forEach(key => {
    balances[key] = Math.round(balances[key] * 100) / 100;
  });

  return balances;
};

/**
 * Calculate who owes whom and how much
 * Uses a simplified debt settlement algorithm
 * @param {Object} balances - Object with balances for each member
 * @param {Object} memberNames - Object mapping member IDs to names
 * @returns {Array} - Array of settlement transactions
 */
export const calculateSettlements = (balances, memberNames = {}) => {
  const settlements = [];
  
  // Separate into creditors (positive balance) and debtors (negative balance)
  const creditors = [];
  const debtors = [];

  Object.entries(balances).forEach(([memberId, balance]) => {
    if (balance > 0.01) {
      creditors.push({ id: memberId, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ id: memberId, amount: Math.abs(balance) });
    }
  });

  // Sort by amount (descending)
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  // Match debtors with creditors
  let i = 0; // creditor index
  let j = 0; // debtor index

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const settleAmount = Math.min(creditor.amount, debtor.amount);

    if (settleAmount > 0.01) {
      settlements.push({
        from: debtor.id,
        fromName: memberNames[debtor.id] || 'Unknown',
        to: creditor.id,
        toName: memberNames[creditor.id] || 'Unknown',
        amount: Math.round(settleAmount * 100) / 100 // Round to 2 decimal places
      });
    }

    creditor.amount -= settleAmount;
    debtor.amount -= settleAmount;

    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }

  return settlements;
};

/**
 * Get summary for a specific user in a group
 * @param {Object} balances - Object with balances for each member
 * @param {string} userId - The user to get summary for
 * @returns {Object} - Summary object with total owed and owing
 */
export const getUserSummary = (balances, userId) => {
  const balance = balances[userId] || 0;
  
  return {
    balance: Math.round(balance * 100) / 100,
    isOwed: balance > 0.01,
    owes: balance < -0.01,
    displayAmount: Math.abs(Math.round(balance * 100) / 100)
  };
};

/**
 * Calculate total group spending
 * @param {Array} expenses - Array of expense objects
 * @returns {number} - Total amount spent
 */
export const calculateTotalSpending = (expenses) => {
  return expenses.reduce((total, expense) => {
    if (!expense.settled) {
      return total + (expense.amount || 0);
    }
    return total;
  }, 0);
};

/**
 * Get expense breakdown by member
 * @param {Array} expenses - Array of expense objects
 * @param {Array} members - Array of member IDs
 * @param {Object} memberNames - Object mapping member IDs to names
 * @returns {Array} - Array of member spending summaries
 */
export const getExpenseBreakdown = (expenses, members, memberNames = {}) => {
  const breakdown = {};
  
  members.forEach(memberId => {
    breakdown[memberId] = {
      id: memberId,
      name: memberNames[memberId] || 'Unknown',
      paid: 0,
      owes: 0,
      expenseCount: 0
    };
  });

  expenses.forEach(expense => {
    if (expense.settled) return;
    
    const { amount, paidBy, splits } = expense;
    
    // Track what each person paid
    if (breakdown[paidBy]) {
      breakdown[paidBy].paid += amount;
      breakdown[paidBy].expenseCount += 1;
    }
    
    // Track what each person owes
    if (splits) {
      Object.entries(splits).forEach(([memberId, splitAmount]) => {
        if (breakdown[memberId]) {
          breakdown[memberId].owes += splitAmount;
        }
      });
    }
  });

  // Round values
  Object.values(breakdown).forEach(member => {
    member.paid = Math.round(member.paid * 100) / 100;
    member.owes = Math.round(member.owes * 100) / 100;
    member.net = Math.round((member.paid - member.owes) * 100) / 100;
  });

  return Object.values(breakdown);
};
