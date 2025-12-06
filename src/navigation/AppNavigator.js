import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  // Auth state - will be managed by Pawan with Firebase
  // For now, set to false to show auth screens first
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;

