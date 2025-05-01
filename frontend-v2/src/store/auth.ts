import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (username: string, password: string) => {
        try {
          const response = await axios.post(`${API_URL}/api/auth/login`, {
            username,
            password,
          });

          const { token, user } = response.data;
          
          // Set auth state
          set({ 
            user, 
            token,
            isAuthenticated: true 
          });

          // Set default auth header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return true;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      logout: () => {
        // Clear auth state
        set({ 
          user: null, 
          token: null,
          isAuthenticated: false 
        });

        // Remove auth header
        delete axios.defaults.headers.common['Authorization'];
      },
    }),
    {
      name: 'auth-storage',
      // Only persist these fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize axios auth header if token exists
const state = useAuthStore.getState();
if (state.token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
}
