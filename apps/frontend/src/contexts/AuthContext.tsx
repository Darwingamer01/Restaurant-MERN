// apps/frontend/src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';

// Global refresh promise to prevent concurrent refresh requests
let refreshPromise: Promise<string> | null = null;

interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderImpl({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

  // ✅ Cross-tab communication channel
  const [broadcastChannel] = useState(() => new BroadcastChannel('auth-channel'));

  // ✅ DEBUG LOGS - Add these useEffect hooks for debugging
  useEffect(() => {
    console.log('🔑 AuthContext user state:', user);
  }, [user]);

  useEffect(() => {
    console.log('⏳ AuthContext isLoading:', isLoading);
  }, [isLoading]);

  useEffect(() => {
    console.log('🚀 AuthContext hasInitialized:', hasInitialized);
  }, [hasInitialized]);

  // ✅ Listen for cross-tab auth events
  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      console.log('📡 Received broadcast message:', event.data);
      switch (event.data.type) {
        case 'AUTH_LOGIN':
          localStorage.setItem('accessToken', event.data.accessToken);
          setUser(event.data.user);
          break;
        case 'AUTH_LOGOUT':
          localStorage.removeItem('accessToken');
          setUser(null);
          queryClient.clear();
          navigate('/', { replace: true });
          break;
      }
    };

    broadcastChannel.addEventListener('message', handleAuthMessage);
    return () => {
      broadcastChannel.removeEventListener('message', handleAuthMessage);
    };
  }, [broadcastChannel, queryClient, navigate]);

  // ✅ Listen for localStorage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      console.log('💾 Storage change detected:', e.key, e.newValue);
      if (e.key === 'accessToken') {
        if (e.newValue) {
          queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        } else {
          setUser(null);
          queryClient.clear();
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [queryClient]);

  // ✅ Deduplicated refresh with proper error handling
  const refreshAccessToken = async (): Promise<string> => {
    console.log('🔄 Attempting token refresh...');
    if (refreshPromise) {
      console.log('⏳ Using existing refresh promise...');
      return refreshPromise;
    }

    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          console.error('❌ Refresh failed with status:', response.status);
          throw new Error(`Refresh failed: ${response.status}`);
        }

        const data = await response.json();
        const newAccessToken = data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        console.log('✅ Token refreshed successfully');
        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });

    return refreshPromise;
  };

  // ✅ Unified fetch with single retry attempt
  const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
    let token = localStorage.getItem("accessToken") ?? undefined;
    console.log('📤 Making authenticated request to:', endpoint, 'with token:', !!token);

    const makeRequest = async (accessToken?: string | null) => {
      const headers = {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      };

      return await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
      });
    };

    let response = await makeRequest(token);
    console.log('📥 Response status:', response.status);

    // If token expired (401), try refresh ONCE
    if (response.status === 401 && token && hasInitialized) {
      console.log('🔑 Token expired, attempting refresh...');
      try {
        const newToken = await refreshAccessToken();
        response = await makeRequest(newToken);
        console.log('🔄 Retry response status:', response.status);
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        if (hasInitialized) {
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      }
    }

    return response;
  };

  // Current User Query
  const { data: currentUser } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      console.log('👤 Fetching current user...');
      const token = localStorage.getItem("accessToken") ?? undefined;
      if (!token) throw new Error("No token");

      const response = await fetchWithAuth("/auth/me");
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await response.json();
      console.log('✅ User fetched:', data.data.user);
      return data.data.user;
    },
    enabled: !!localStorage.getItem("accessToken") && hasInitialized,
    retry: false,
  });

  // Login Mutation with debugging
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      console.log('📤 Login request starting...');
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Login failed" }));
        console.error('❌ Login failed:', error);
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      console.log('✅ Login response:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 Login mutation onSuccess triggered');
      const accessToken = data.data.accessToken;
      const userData = data.data.user;

      console.log('💾 Setting localStorage and user state');
      localStorage.setItem("accessToken", accessToken);
      setUser(userData);
      setHasInitialized(true);

      // Broadcast to other tabs
      broadcastChannel.postMessage({
        type: 'AUTH_LOGIN',
        accessToken,
        user: userData
      });

      queryClient.invalidateQueries({ queryKey: ["auth"] });

      console.log('🔄 Navigating to dashboard...');
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      console.error('❌ Login mutation error:', error);
    }
  });

  // Register Mutation with debugging
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      console.log('📤 Register request starting...');
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Register failed" }));
        console.error('❌ Register failed:', error);
        throw new Error(error.message || "Register failed");
      }

      const data = await response.json();
      console.log('✅ Register response:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 Register mutation onSuccess triggered');
      const accessToken = data.data.accessToken;
      const userData = data.data.user;

      localStorage.setItem("accessToken", accessToken);
      setUser(userData);
      setHasInitialized(true);

      // Broadcast registration to other tabs
      broadcastChannel.postMessage({
        type: 'AUTH_LOGIN',
        accessToken,
        user: userData
      });

      queryClient.invalidateQueries({ queryKey: ["auth"] });

      console.log('🔄 Navigating to dashboard after register...');
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      console.error('❌ Register mutation error:', error);
    }
  });

  // ✅ Safe initialization - only try refresh if no active session
  useEffect(() => {
    const initAuth = async () => {
      console.log('🚀 Initializing auth...');
      try {
        const token = localStorage.getItem("accessToken") ?? undefined;
        if (!token) {
          console.log('🔍 No access token found, trying refresh...');
          try {
            const newToken = await refreshAccessToken();
            if (newToken) {
              setHasInitialized(true);
              queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
            }
          } catch (refreshError) {
            console.log("ℹ️ No existing session to refresh");
          }
        } else {
          console.log('✅ Access token found, marking as initialized');
          setHasInitialized(true);
          queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        }
      } catch (error) {
        console.log("⚠️ Init auth error:", error);
      } finally {
        setIsLoading(false);
        console.log('✅ Auth initialization complete');
      }
    };

    initAuth();
  }, [queryClient]);

  // Sync user state
  useEffect(() => {
    if (currentUser) {
      console.log('👤 Setting user from query:', currentUser);
      setUser(currentUser);
    }
    setIsLoading(false);
  }, [currentUser]);

  // ✅ Logout function with debugging
  const logout = async () => {
    console.log('🚪 Logout initiated...');
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken") ?? undefined}`,
        },
      });
      console.log('✅ Logout request successful');
    } catch (error) {
      console.log("⚠️ Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      setHasInitialized(false);
      queryClient.clear();

      broadcastChannel.postMessage({
        type: 'AUTH_LOGOUT'
      });

      console.log('🔄 Navigating to home after logout...');
      navigate('/', { replace: true });
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login: (email, password) => loginMutation.mutateAsync({ email, password }),
    register: (data) => registerMutation.mutateAsync(data),
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const AuthProvider = AuthProviderImpl;

export default AuthProvider;

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

