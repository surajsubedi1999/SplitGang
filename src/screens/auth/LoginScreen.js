import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { CustomInput, CustomButton } from '../../components';
import { COLORS, SIZES } from '../../constants/theme';

const LoginScreen = ({ navigation }) => {
  // Form state using useState - Suraj's responsibility
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Basic validation
  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login - will be connected to Firebase by Pawan
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    // TODO: Pawan will implement Firebase authentication here
    console.log('Login attempt:', { email, password });
    
    // Simulate API call for now
    setTimeout(() => {
      setLoading(false);
      // Navigation will be handled after Firebase integration
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>SplitGang</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>

        <View style={styles.form}>
          <CustomInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            error={errors.email}
          />

          <CustomInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            error={errors.password}
          />

          <CustomButton
            title="Log In"
            onPress={handleLogin}
            loading={loading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.linkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.xlarge,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SIZES.xxlarge,
  },
  form: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SIZES.large,
  },
  footerText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;

