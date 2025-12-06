// Firestore Service - Pawan Phuyal
// CRUD operations for groups and expenses
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============ GROUP OPERATIONS ============

// Create a new group with group code
export const createGroup = async (groupData, userId) => {
  try {
    const groupRef = await addDoc(collection(db, 'groups'), {
      ...groupData,
      createdBy: userId,
      members: [userId],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // Add group to user's groups array
    await updateDoc(doc(db, 'users', userId), {
      groups: arrayUnion(groupRef.id)
    });

    return { success: true, groupId: groupRef.id };
  } catch (error) {
    console.error('Error creating group:', error);
    return { success: false, error: error.message };
  }
};

// Join a group by group code
export const joinGroupByCode = async (groupCode, userId) => {
  try {
    // Find group with this code
    const q = query(
      collection(db, 'groups'),
      where('groupCode', '==', groupCode)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { success: false, error: 'Invalid group code. Please check and try again.' };
    }

    const groupDoc = querySnapshot.docs[0];
    const groupData = groupDoc.data();
    const groupId = groupDoc.id;

    // Check if user is already a member
    if (groupData.members?.includes(userId)) {
      return { success: false, error: 'You are already a member of this group.' };
    }

    // Check if group has reached max members
    if (groupData.expectedMembers && groupData.members?.length >= groupData.expectedMembers) {
      return { success: false, error: 'This group has reached its maximum number of members.' };
    }

    // Add user to group
    await updateDoc(doc(db, 'groups', groupId), {
      members: arrayUnion(userId),
      updatedAt: serverTimestamp()
    });

    // Add group to user's groups
    await updateDoc(doc(db, 'users', userId), {
      groups: arrayUnion(groupId)
    });

    return { success: true, groupId };
  } catch (error) {
    console.error('Error joining group:', error);
    return { success: false, error: error.message };
  }
};

// Get all groups for a user
export const getUserGroups = async (userId) => {
  try {
    const q = query(
      collection(db, 'groups'),
      where('members', 'array-contains', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const groups = [];
    querySnapshot.forEach((doc) => {
      groups.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, groups };
  } catch (error) {
    console.error('Error fetching groups:', error);
    return { success: false, error: error.message };
  }
};

// Get a single group by ID
export const getGroup = async (groupId) => {
  try {
    const groupDoc = await getDoc(doc(db, 'groups', groupId));
    if (groupDoc.exists()) {
      return { success: true, group: { id: groupDoc.id, ...groupDoc.data() } };
    }
    return { success: false, error: 'Group not found' };
  } catch (error) {
    console.error('Error fetching group:', error);
    return { success: false, error: error.message };
  }
};

// Join a group (by group ID)
export const joinGroup = async (groupId, userId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupDoc = await getDoc(groupRef);
    
    if (!groupDoc.exists()) {
      return { success: false, error: 'Group not found' };
    }

    await updateDoc(groupRef, {
      members: arrayUnion(userId),
      updatedAt: serverTimestamp()
    });

    await updateDoc(doc(db, 'users', userId), {
      groups: arrayUnion(groupId)
    });

    return { success: true };
  } catch (error) {
    console.error('Error joining group:', error);
    return { success: false, error: error.message };
  }
};

// Leave a group
export const leaveGroup = async (groupId, userId) => {
  try {
    await updateDoc(doc(db, 'groups', groupId), {
      members: arrayRemove(userId),
      updatedAt: serverTimestamp()
    });

    await updateDoc(doc(db, 'users', userId), {
      groups: arrayRemove(groupId)
    });

    return { success: true };
  } catch (error) {
    console.error('Error leaving group:', error);
    return { success: false, error: error.message };
  }
};

// ============ EXPENSE OPERATIONS ============

// Create a new expense
export const createExpense = async (expenseData) => {
  try {
    const expenseRef = await addDoc(collection(db, 'expenses'), {
      ...expenseData,
      settled: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, expenseId: expenseRef.id };
  } catch (error) {
    console.error('Error creating expense:', error);
    return { success: false, error: error.message };
  }
};

// Get all expenses for a group
export const getGroupExpenses = async (groupId) => {
  try {
    const q = query(
      collection(db, 'expenses'),
      where('groupId', '==', groupId)
    );
    const querySnapshot = await getDocs(q);
    
    const expenses = [];
    querySnapshot.forEach((doc) => {
      expenses.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, expenses };
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return { success: false, error: error.message };
  }
};

// Mark expense as settled
export const settleExpense = async (expenseId) => {
  try {
    await updateDoc(doc(db, 'expenses', expenseId), {
      settled: true,
      settledAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error settling expense:', error);
    return { success: false, error: error.message };
  }
};

// Delete an expense
export const deleteExpense = async (expenseId) => {
  try {
    await deleteDoc(doc(db, 'expenses', expenseId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting expense:', error);
    return { success: false, error: error.message };
  }
};

// ============ USER OPERATIONS ============

// Get user data
export const getUser = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { success: true, user: { id: userDoc.id, ...userDoc.data() } };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error fetching user:', error);
    return { success: false, error: error.message };
  }
};

// Get multiple users by IDs
export const getUsers = async (userIds) => {
  try {
    const users = [];
    for (const userId of userIds) {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        users.push({ id: userDoc.id, ...userDoc.data() });
      }
    }
    return { success: true, users };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, error: error.message };
  }
};

