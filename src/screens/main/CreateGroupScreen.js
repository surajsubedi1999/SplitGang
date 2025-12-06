import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { CustomInput, CustomButton } from '../../components';
import { COLORS, SIZES } from '../../constants/theme';

// Generate a random 6-digit group code
const generateGroupCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate a random 6-digit group code
const generateGroupCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const CreateGroupScreen = ({ navigation }) => {
  // Form state using useState - Suraj's responsibility
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [memberCount, setMemberCount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [createdGroupCode, setCreatedGroupCode] = useState(null);

  // Basic validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!groupName.trim()) {
      newErrors.groupName = 'Group name is required';
    }
    
    if (!memberCount.trim()) {
      newErrors.memberCount = 'Number of members is required';
    } else if (isNaN(parseInt(memberCount)) || parseInt(memberCount) < 2) {
      newErrors.memberCount = 'Enter at least 2 members';
    } else if (parseInt(memberCount) > 20) {
      newErrors.memberCount = 'Maximum 20 members allowed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle group creation - will be connected to Firebase by Pawan
  const handleCreateGroup = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    // TODO: Pawan will implement Firebase data saving here
    console.log('Creating group:', { groupName, description });
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 1000);
  };

  // Show success screen with group code
  if (createdGroupCode) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successTitle}>🎉 Group Created!</Text>
          <Text style={styles.successSubtitle}>Share this code with your group members:</Text>
          
          <View style={styles.codeContainer}>
            <Text style={styles.groupCode}>{createdGroupCode}</Text>
          </View>
          
          <Text style={styles.instructionText}>
            Members can join by entering this code in the "Join Group" section.
          </Text>
          
          <View style={styles.successButtons}>
            <CustomButton
              title="Done"
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Group</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <CustomInput
          label="Group Name"
          value={groupName}
          onChangeText={setGroupName}
          placeholder="e.g., Roommates, Trip to NYC"
          error={errors.groupName}
        />

        <CustomInput
          label="Number of Members"
          value={memberCount}
          onChangeText={setMemberCount}
          placeholder="How many people in this group?"
          keyboardType="number-pad"
          error={errors.memberCount}
        />

        <CustomInput
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="What is this group for?"
        />

        <Text style={styles.infoText}>
          After creating the group, you'll receive a unique code that others can use to join.
        </Text>

        <CustomButton
          title="Create Group"
          onPress={handleCreateGroup}
          loading={loading}
        />

        <CustomButton
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="outline"
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
  infoText: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: SIZES.large,
    fontStyle: 'italic',
  },
  // Success screen styles
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xlarge,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.base,
  },
  successSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: SIZES.xlarge,
    textAlign: 'center',
  },
  codeContainer: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.large,
    paddingHorizontal: SIZES.xlarge * 2,
    borderRadius: SIZES.base,
    marginBottom: SIZES.large,
  },
  groupCode: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 8,
  },
  instructionText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.xlarge,
  },
  successButtons: {
    width: '100%',
  },
});

export default CreateGroupScreen;

