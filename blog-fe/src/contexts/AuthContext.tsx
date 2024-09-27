import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface User {
  id: string;
  email: string;
  fullname: string;
  username: string;
}

interface AuthContextType {
  auth: { token: string | null };
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<{ access_token: string; user: User } | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

const isTokenExpired = (token: string) => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const currentTime = Date.now() / 1000; 
  return payload.exp < currentTime;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<{ token: string | null }>({ token: null });
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        logout();
      } else {
        setAuth({ token: storedToken });
        setIsAuthenticated(true);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<{ access_token: string; user: User } | null> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}auth/login`, credentials);
      const { access_token, user } = response.data;
  
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
  
      setAuth({ token: access_token });
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
  
      return { access_token, user }; 
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed. Please check your credentials.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setIsAuthenticated(false);
      return null; // Return null in case of an error
    } finally {
      setIsLoading(false);
    }
  };
  

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setAuth({ token: null });
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ auth, user, isAuthenticated, isLoading, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
