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
  changeUserRole: (userId: string, newRole: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPERADMIN_EMAILS = ['sthanna@salesforce.com'];
const ADMIN_EMAILS = [
  'thannasudhir9@gmail.com'
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('nandri_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      const defaultAdmin: User = {
        id: 'admin1',
        email: 'sthanna@salesforce.com',
        name: 'Sudhir Thanna',
        role: 'superadmin',
        photoUrl: 'https://i.pravatar.cc/150?u=sthanna'
      };
      setUser(defaultAdmin);
      localStorage.setItem('nandri_user', JSON.stringify(defaultAdmin));
    }
  }, []);

  const login = (email: string) => {
    const isSuperAdmin = SUPERADMIN_EMAILS.includes(email.toLowerCase());
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: isSuperAdmin ? 'superadmin' : isAdmin ? 'employee' : 'sponsor',
      photoUrl: `https://i.pravatar.cc/150?u=${email}`
    };
    setUser(newUser);
    localStorage.setItem('nandri_user', JSON.stringify(newUser));
  };

  const register = (email: string, name: string) => {
    const isSuperAdmin = SUPERADMIN_EMAILS.includes(email.toLowerCase());
    const isAdmin = ADMIN_EMAILS.includes(email.toLowerCase());
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: isSuperAdmin ? 'superadmin' : isAdmin ? 'employee' : 'sponsor',
      photoUrl: `https://i.pravatar.cc/150?u=${email}`
    };
    setUser(newUser);
    localStorage.setItem('nandri_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nandri_user');
  };

  // Allow dynamic role change
  const changeUserRole = (userId: string, newRole: Role) => {
    if (user && user.id === userId) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('nandri_user', JSON.stringify(updatedUser));
    }
    // Also we need to persist to a list of users, but we are currently mock local storage for users.
    // For now we just update the current user if it matches.
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, changeUserRole }}>
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
