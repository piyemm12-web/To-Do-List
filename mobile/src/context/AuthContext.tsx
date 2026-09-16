import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthState } from '../types/auth';
import { loginApi, registerApi, getMeApi } from '../api/authApi';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Restore stored session on app startup
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          // Verify token validity with backend profile endpoint
          try {
            const profileRes = await getMeApi();
            if (profileRes.success) {
              setState({
                user: profileRes.data,
                token: storedToken,
                isLoading: false,
                isAuthenticated: true,
                error: null,
              });
              return;
            }
          } catch (profileErr) {
            console.warn('Stored token expired or invalid, clearing local session');
            await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
          }
        }
      } catch (e) {
        console.error('Failed to restore auth state from storage', e);
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    bootstrapAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await loginApi(email, password);
      if (res.success && res.data) {
        const { token, _id, name, email: userEmail } = res.data;
        const userObj: User = { _id, name, email: userEmail };

        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userObj));

        setState({
          user: userObj,
          token,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await registerApi(name, email, password);
      if (res.success && res.data) {
        const { token, _id, name: userName, email: userEmail } = res.data;
        const userObj: User = { _id, name: userName, email: userEmail };

        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userObj));

        setState({
          user: userObj,
          token,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed.';
      setState((prev) => ({ ...prev, isLoading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } catch (e) {
      console.error('Error removing auth token from storage', e);
    } finally {
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
