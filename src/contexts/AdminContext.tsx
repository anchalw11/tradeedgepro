import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminUser {
  username: string;
  isAuthenticated: boolean;
  loginTime: Date;
}

interface AdminContextType {
  admin: AdminUser | null;
  login: (credentials: { username: string; password: string }) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  const login = (credentials: { username: string; password: string }): boolean => {
    // Your unique admin credentials
    const ADMIN_CREDENTIALS = {
      username: 'signal_master_2025',
      password: 'TradePro_Admin_9X7K2M'
    };

    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      setAdmin({
        username: credentials.username,
        isAuthenticated: true,
        loginTime: new Date()
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};