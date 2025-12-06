import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { CustomInput, CustomButton } from '../../components';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth, useData } from '../../context';
import { joinGroupByCode } from '../../services';

const JoinGroupScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { fetchGroups } = useData();
  
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinGroup = async () => {
    if (!groupCode.trim()) {
      setError('Please enter a group code');
      return;
    }
    
    if (groupCode.length !== 6) {
      setError('Group code must be 6 digits');
      return;
    }

    setError('');
    setLoading(true);
    
    const result = await joinGroupByCode(groupCode.trim(), user.uid);
    setLoading(false);
    
    if (result.success) {
      await fetchGroups();
      Alert.alert('Success', 'You have joined the group!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Join Group</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.instruction}>
          Enter the 6-digit code shared by the group creator to join their expense group.
        </Text>

        <CustomInput
          label="Group Code"
          value={groupCode}
          onChangeText={(text) => {
            setGroupCode(text.replace(/[^0-9]/g, '').slice(0, 6));
            setError('');
          }}
          placeholder="Enter 6-digit code"
          keyboardType="number-pad"
          error={error}
        />

        <CustomButton
          title="Join Group"
          onPress={handleJoinGroup}
          loading={loading}
        />

        <CustomButton
          title="Cancel"
          onPress={() => navigation.goBack()}
          variant="outline"
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
  content: {
    padding: SIZES.large,
  },
  instruction: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SIZES.xlarge,
    lineHeight: 20,
  },
});

export default JoinGroupScreen;

