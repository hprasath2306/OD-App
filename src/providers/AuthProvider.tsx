import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  PropsWithChildren,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Redirect, router } from "expo-router";

type AuthData = {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  loading: boolean;
};

// Create a context
const AuthContext = createContext<AuthData>({
  user: null,
  login: async (username: string, password: string) => {},
  logout: async () => {},
  isLoggedIn: false,
  loading: true,
});

// AuthProvider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load the token and role from AsyncStorage when the app starts
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      // console.log("came here2")
      setLoading(true);
      const response = await axios.post(
        "https://od-automation.onrender.com/api/auth/login",
        {
          username,
          password,
        }
      );
      const userData = response.data;
      console.log(userData);
      console.log(userData.user.role);
      setLoading(false);
      // Save user data and role to AsyncStorage
      setUser(userData);
      if (userData) {
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        await AsyncStorage.setItem("role", userData?.user.role); // Store the role separately
      }
      router.replace(`/(${userData.user.role.toLowerCase()})`);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Optionally handle the error in UI
    }
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("role");
    router.replace("/auth/login");
  };

  // Check if user is logged in
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
