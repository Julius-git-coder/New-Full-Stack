// src/context/AuthContext.jsx (corrected)
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api"; // Corrected to authAPI

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally verify token here by calling a protected endpoint
      setUser({ token }); // Simple: just set if token exists
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password }); // Corrected to authAPI
      localStorage.setItem("token", data.token);
      setUser({ token: data.token, user: data.user });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const signup = async (formData) => {
    try {
      const data = await authAPI.signup(formData); // Corrected to authAPI
      localStorage.setItem("token", data.token);
      setUser({ token: data.token, user: data.user });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Signup failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
