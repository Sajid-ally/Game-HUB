import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gamehub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('gamehub_token'));
  const [loading, setLoading] = useState(true);

  // Sync authentication state on initial mount
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('gamehub_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('gamehub_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Session verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('gamehub_token', receivedToken);
    localStorage.setItem('gamehub_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const register = async (name, email, password, confirmPassword) => {
    const res = await authAPI.register({ name, email, password, confirmPassword });
    const { token: receivedToken, user: receivedUser } = res.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('gamehub_token', receivedToken);
    localStorage.setItem('gamehub_user', JSON.stringify(receivedUser));
    return receivedUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('gamehub_token');
    localStorage.removeItem('gamehub_user');
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('gamehub_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err.message);
    }
  };

  const updateUserPlan = (newPlan) => {
    if (user) {
      const updated = { ...user, plan: newPlan };
      setUser(updated);
      localStorage.setItem('gamehub_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshUser,
        updateUserPlan
      }}
    >
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
