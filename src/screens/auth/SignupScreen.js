import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { CustomInput, CustomButton } from '../../components';
import { COLORS, SIZES } from '../../constants/theme';

const SignupScreen = ({ navigation }) => {
  // Form state using useState - Suraj's responsibility
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Basic validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle signup - will be connected to Firebase by Pawan
  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    // TODO: Pawan will implement Firebase authentication here
    console.log('Signup attempt:', { name, email, password });
    
    // Simulate API call for now
    setTimeout(() => {
      setLoading(false);
      // Navigation will be handled after Firebase integration
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>SplitGang</Text>
          <Text style={styles.subtitle}>Create your account</Text>

          <View style={styles.form}>
            <CustomInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              error={errors.name}
            />

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
              placeholder="Create a password"
              secureTextEntry
              error={errors.password}
            />

            <CustomInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword}
            />

            <CustomButton
              title="Sign Up"
              onPress={handleSignup}
              loading={loading}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.linkText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
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

export default SignupScreen;

