import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Role } from './types';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  photoUrl?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  register: (email: string, name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = [
  'sthanna@salesforce.com',
  'thannasudhir9@gmail.com'
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Auto-login logic could go here if we wanted persistent session via localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('nandri_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Set default login for preview purposes as requested
      const defaultAdmin: User = {
        id: 'admin1',
        email: 'sthanna@salesforce.com',
        name: 'Sudhir Thanna',
        role: 'employee',
        photoUrl: 'https://i.pravatar.cc/150?u=sthanna'
      };
      setUser(defaultAdmin);
      localStorage.setItem('nandri_user', JSON.stringify(defaultAdmin));
    }
  }, []);

  const login = (email: string) => {
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: isAdmin ? 'employee' : 'sponsor',
      photoUrl: `https://i.pravatar.cc/150?u=${email}`
    };
    setUser(newUser);
    localStorage.setItem('nandri_user', JSON.stringify(newUser));
  };

  const register = (email: string, name: string) => {
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: isAdmin ? 'employee' : 'sponsor',
      photoUrl: `https://i.pravatar.cc/150?u=${email}`
    };
    setUser(newUser);
    localStorage.setItem('nandri_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nandri_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
