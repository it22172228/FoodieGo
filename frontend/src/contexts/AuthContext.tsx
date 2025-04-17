
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

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
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
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

  useEffect(() => {
    // Check if user is stored in local storage on component mount
    const storedUser = localStorage.getItem("foodFusionUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

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
    }
  };

  const logout = () => {
    localStorage.removeItem("foodFusionUser");
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
