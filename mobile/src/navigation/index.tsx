import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/Login/index';
import { DashboardScreen } from '../screens/Dashboard/index';
import { VisitorListScreen } from '../screens/VisitorList/index';
import { RegisterVisitorScreen } from '../screens/RegisterVisitor/index';
import { VisitorDetailsScreen } from '../screens/VisitorDetails/index';
import { SettingsScreen } from '../screens/Settings/index';
import { NotificationsScreen } from '../screens/Notifications/index';
import { ReportsScreen } from '../screens/Reports/index';
import { QrCheckinScreen } from '../screens/QrCheckin/index';
import { AdminUsersScreen } from '../screens/AdminUsers/index';
import { colors } from '../theme';
import type { RootStackParamList, TabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const tabIcon = (label: string, color: string) => (
  <Text style={{ fontSize: 18, color, fontWeight: '800' }}>{label}</Text>
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtle,
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.86)',
          borderTopColor: 'rgba(59,110,165,0.12)',
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => tabIcon('H', color) }}
      />
      <Tab.Screen
        name="VisitorsTab"
        component={VisitorListScreen}
        options={{ tabBarLabel: 'Visitors', tabBarIcon: ({ color }) => tabIcon('V', color) }}
      />
      <Tab.Screen
        name="RegisterTab"
        component={RegisterVisitorScreen}
        options={{ tabBarLabel: 'Register', tabBarIcon: ({ color }) => tabIcon('+', color) }}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{ tabBarLabel: 'Alerts', tabBarIcon: ({ color }) => tabIcon('✦', color) }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Profile', tabBarIcon: ({ color }) => tabIcon('⚙', color) }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <LoginScreen />
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: false,
        fonts: {} as never,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: 'rgba(59,110,165,0.12)',
          notification: colors.danger,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="VisitorDetails" component={VisitorDetailsScreen} />
            <Stack.Screen name="QrCheckin" component={QrCheckinScreen} />
            <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
            <Stack.Screen name="Reports" component={ReportsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}