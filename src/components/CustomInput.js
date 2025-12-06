import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const CustomInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry = false,
  keyboardType = 'default',
  error = null 
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.medium,
  },
  label: {
    fontSize: 14,
    color: COLORS.black,
    marginBottom: SIZES.base,
    fontWeight: '500',
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: SIZES.base,
    padding: SIZES.medium,
    fontSize: 16,
    color: COLORS.black,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomInput;

