<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import axios from "axios";

export type UserRole = "customer" | "restaurant" | "delivery" | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
<<<<<<< Updated upstream
=======
  token: string | null;
>>>>>>> Stashed changes
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    location: { location: string; city: string }
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data for demonstration
const MOCK_USERS = [
  { id: "1", name: "John Customer", email: "customer@example.com", password: "password", role: "customer" as UserRole },
  { id: "2", name: "Restaurant Owner", email: "restaurant@example.com", password: "password", role: "restaurant" as UserRole },
  { id: "3", name: "Delivery Person", email: "delivery@example.com", password: "password", role: "delivery" as UserRole },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

<<<<<<< Updated upstream
  useEffect(() => {
    // Check if user is stored in local storage on component mount
    const storedUser = localStorage.getItem("foodFusionUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
=======
  // Helper to update state and localStorage together
  const updateAuthState = (token: string | null, user: User | null) => {
    if (token && user) {
      localStorage.setItem("foodFusionToken", token);
      localStorage.setItem("foodFusionUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("foodFusionToken");
      localStorage.removeItem("foodFusionUser");
>>>>>>> Stashed changes
    }
    setToken(token);
    setUser(user);
    setIsAuthenticated(!!token);
    // Notify other tabs and contexts
    window.dispatchEvent(new Event("storage"));
  };

  // On mount, load from localStorage and verify token
  useEffect(() => {
    const storedToken = localStorage.getItem("foodFusionToken");
    const storedUser = localStorage.getItem("foodFusionUser");
    if (storedToken && storedUser) {
      updateAuthState(storedToken, JSON.parse(storedUser));
    }
    // Listen for storage changes (cross-tab sync)
    const handleStorage = () => {
      const t = localStorage.getItem("foodFusionToken");
      const u = localStorage.getItem("foodFusionUser");
      setToken(t);
      setUser(u ? JSON.parse(u) : null);
      setIsAuthenticated(!!t);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

<<<<<<< Updated upstream
  const login = async (email: string, password: string, role: UserRole): Promise<void> => {
    try {
      // In a real app, this would be an API call
      const foundUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password && u.role === role
      );

      if (!foundUser) {
        throw new Error("Invalid credentials or role");
      }

      // Create a user object without the password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in local storage
      localStorage.setItem("foodFusionUser", JSON.stringify(userWithoutPassword));
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      toast.success(`Welcome back, ${foundUser.name}!`);
    } catch (error) {
      toast.error("Login failed: " + (error as Error).message);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
    try {
      // In a real app, this would be an API call
      const existingUser = MOCK_USERS.find((u) => u.email === email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create new user
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        name,
        email,
        password,
        role,
      };

      // In a real app, we would save this to the database
      MOCK_USERS.push(newUser);

      // Create a user object without the password
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Store user in local storage
      localStorage.setItem("foodFusionUser", JSON.stringify(userWithoutPassword));
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      toast.success(`Welcome to Food Fusion, ${name}!`);
    } catch (error) {
      toast.error("Registration failed: " + (error as Error).message);
      throw error;
=======
  // Login
  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const response = await axios.post("http://localhost:5600/api/auth/login", {
        email,
        password,
        role,
      });
      const { token: responseToken, user: responseUser } = response.data;
      updateAuthState(responseToken, responseUser);
      toast.success("Login successful!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
      updateAuthState(null, null);
>>>>>>> Stashed changes
    }
  };

  // Logout
  const logout = () => {
    updateAuthState(null, null);
    toast.success("Logged out successfully");
  };

  // Register
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    location: { location: string; city: string }
  ) => {
    try {
      await axios.post("http://localhost:5600/api/auth/register", {
        name,
        email,
        password,
        role,
        location,
      });
      toast.success("Registration successful! Please login.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
<<<<<<< Updated upstream
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
=======
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        token,
        login,
        logout,
        register,
      }}
    >
>>>>>>> Stashed changes
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
<<<<<<< Updated upstream
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
=======
  if (!context) throw new Error("useAuth must be used within AuthProvider");
>>>>>>> Stashed changes
  return context;
};
