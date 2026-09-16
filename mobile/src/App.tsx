import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { HomeScreen } from './screens/HomeScreen';
import { COLORS } from './theme/colors';

const NavigationContainer: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>('login');

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    return (
      <TaskProvider>
        <HomeScreen />
      </TaskProvider>
    );
  }

  return authScreen === 'login' ? (
    <LoginScreen onNavigateRegister={() => setAuthScreen('register')} />
  ) : (
    <RegisterScreen onNavigateLogin={() => setAuthScreen('login')} />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
