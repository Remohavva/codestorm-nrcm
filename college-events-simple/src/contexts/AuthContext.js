import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'RESTORE_TOKEN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: !!action.payload.token,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore token on app start
  useEffect(() => {
    const restoreToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const user = await AsyncStorage.getItem('user');
        
        if (token && user) {
          dispatch({
            type: 'RESTORE_TOKEN',
            payload: {
              token,
              user: JSON.parse(user),
            },
          });
        } else {
          dispatch({ type: 'RESTORE_TOKEN', payload: {} });
        }
      } catch (error) {
        console.error('Error restoring token:', error);
        dispatch({ type: 'RESTORE_TOKEN', payload: {} });
      }
    };

    restoreToken();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'LOADING' });
      
      // Simulate API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser = {
        id: '1',
        name: email.split('@')[0], // Use email prefix as name
        email: email,
        role: 'student',
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('authToken', mockToken);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: mockUser, token: mockToken },
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'RESTORE_TOKEN', payload: {} });
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'LOADING' });
      
      // Simulate API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: 'student',
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Store in AsyncStorage
      await AsyncStorage.setItem('authToken', mockToken);
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: mockUser, token: mockToken },
      });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'RESTORE_TOKEN', payload: {} });
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};