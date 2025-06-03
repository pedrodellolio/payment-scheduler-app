import { createContext, useState, useEffect, type ReactNode } from "react";
import axiosInstance from "../api/axios";
import type { CreateUserForm } from "../routes/register";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: CreateUserForm) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/auth/me");
      setUser(res.data.user);
      setError(null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.post("/auth/login", { email, password });
      await refreshUser();
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.post("/auth/logout");
      setUser(null);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: CreateUserForm) => {
    try {
      setLoading(true);
      setError(null);
      await axiosInstance.post("/auth/register", data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
