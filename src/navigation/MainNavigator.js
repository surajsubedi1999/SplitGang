import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import { GroupsScreen, AddExpenseScreen, ProfileScreen, CreateGroupScreen } from '../screens';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Groups Stack Navigator
const GroupsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GroupsList" component={GroupsScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.lightGray,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color }) => {
          // Simple text-based icons for minimal UI
          let icon = '';
          if (route.name === 'Groups') icon = '👥';
          else if (route.name === 'AddExpense') icon = '➕';
          else if (route.name === 'Profile') icon = '👤';
          
          return <Text style={{ fontSize: 20 }}>{icon}</Text>;
        },
      })}
    >
      <Tab.Screen 
        name="Groups" 
        component={GroupsStack}
        options={{ tabBarLabel: 'Groups' }}
      />
      <Tab.Screen 
        name="AddExpense" 
        component={AddExpenseScreen}
        options={{ tabBarLabel: 'Add Expense' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;

