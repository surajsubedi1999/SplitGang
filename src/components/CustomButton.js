import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const CustomButton = ({ 
  title, 
  onPress, 
  variant = 'primary', // 'primary' | 'secondary' | 'outline'
  loading = false,
  disabled = false 
}) => {
  const getButtonStyle = () => {
    if (variant === 'secondary') return styles.secondaryButton;
    if (variant === 'outline') return styles.outlineButton;
    return styles.primaryButton;
  };

  const getTextStyle = () => {
    if (variant === 'outline') return styles.outlineText;
    return styles.buttonText;
  };

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.white} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: SIZES.medium,
    borderRadius: SIZES.base,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.base,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  outlineText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default CustomButton;


