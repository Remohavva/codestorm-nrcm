'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '@/lib/auth';

// Auth store using Zustand
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { user, session } = await authService.login(email, password);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          return { user, session };
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false,
            isAuthenticated: false,
            user: null 
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { user, session } = await authService.register(userData);
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
          return { user, session };
        } catch (error) {
          set({ 
            error: error.message, 
            isLoading: false,
            isAuthenticated: false,
            user: null 
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await authService.logout();
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Force logout even if API call fails
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null 
          });
        }
      },

      // Initialize auth state from localStorage
      initialize: () => {
        const user = authService.getCurrentUser();
        const isAuthenticated = authService.isAuthenticated();
        set({ user, isAuthenticated });
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Update user data
      updateUser: (userData) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user_data', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      },

      // Check role
      hasRole: (role) => {
        const user = get().user;
        return user?.role === role;
      },

      // Get user role
      getRole: () => {
        const user = get().user;
        return user?.role || null;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Custom hook for auth
export const useAuth = () => {
  const store = useAuthStore();
  
  // Initialize on first use
  if (typeof window !== 'undefined' && !store.user && authService.isAuthenticated()) {
    store.initialize();
  }

  return store;
};

// Role-based hooks
export const useIsStudent = () => {
  const { hasRole } = useAuth();
  return hasRole('student');
};

export const useIsCoordinator = () => {
  const { hasRole } = useAuth();
  return hasRole('coordinator');
};

export const useIsAdmin = () => {
  const { hasRole } = useAuth();
  return hasRole('admin');
};

export default useAuth;