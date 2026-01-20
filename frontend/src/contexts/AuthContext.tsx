import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  role: 'ADMIN' | 'SUPPORT' | 'USER';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  isSupport: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token } = response.data;
      
      setUser(userData);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error de autenticación');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  // Detectar rol: admin si email es admin@niufoods.cl O rol === ADMIN
  const isAdmin = user ? (user.email === 'admin@niufoods.cl' || user.role === 'ADMIN') : false;
  const isSupport = user ? user.role === 'SUPPORT' : false;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAdmin, isSupport }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
}