"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("auth-token");
    setAuthToken(token);
  }, []);
  const login = (token) => {
    sessionStorage.setItem("auth-token", token);
    setAuthToken(token);
  };

  const logout = () => {
    sessionStorage.removeItem("auth-token");
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
