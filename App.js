import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, DataProvider } from './src/context';
import { AppNavigator } from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </DataProvider>
    </AuthProvider>
  );
}
