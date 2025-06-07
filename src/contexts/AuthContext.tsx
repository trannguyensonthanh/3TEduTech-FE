/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, ReactNode } from 'react';

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const userData = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;
  const userRole = userData ? userData.role : null;
  const isAuthenticated = !!userData;
  return (
    <AuthContext.Provider value={{ userData, userRole, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export demo accounts for use in login page
