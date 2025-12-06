import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { CustomInput, CustomButton } from '../../components';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context';
import { createGroup } from '../../services';

const CreateGroupScreen = ({ navigation }) => {
  const { user } = useAuth();
  
  // Form state using useState - Suraj's responsibility
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Basic validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!groupName.trim()) {
      newErrors.groupName = 'Group name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle group creation with Firebase - Pawan's implementation
  const handleCreateGroup = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    const groupData = {
      name: groupName.trim(),
      description: description.trim()
    };
    
    const result = await createGroup(groupData, user.uid);
    setLoading(false);
    
    if (result.success) {
      Alert.alert('Success', 'Group created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

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
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="What is this group for?"
        />

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
});

export default CreateGroupScreen;
