import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';

interface UserContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  developerMode: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, organisation: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  toggleDeveloperMode: () => void;
  upgradeToPremium: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Simple encryption for API keys (in production, use a proper backend)
const encryptKey = async (key: string): Promise<string> => {
  // For demo purposes, we'll use base64 encoding
  // In production, this should be done server-side with proper encryption
  return btoa(key);
};

const decryptKey = async (encrypted: string): Promise<string> => {
  try {
    return atob(encrypted);
  } catch {
    return '';
  }
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [developerMode, setDeveloperMode] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cmp_user');
    const savedDevMode = localStorage.getItem('cmp_dev_mode');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedDevMode) {
      setDeveloperMode(JSON.parse(savedDevMode));
    }
  }, []);

  // Save user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('cmp_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cmp_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('cmp_dev_mode', JSON.stringify(developerMode));
  }, [developerMode]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate authentication
    // In production, this would call your auth API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo, accept any email/password
    const savedUser = localStorage.getItem('cmp_user_' + email);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      return true;
    }
    
    // Create a default user if none exists
    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
      organisation: 'Organisation',
      tier: 'free',
      aiCreditsRemaining: 5,
      contractsCount: 0
    };
    
    setUser(newUser);
    localStorage.setItem('cmp_user_' + email, JSON.stringify(newUser));
    return true;
  };

  const register = async (
    name: string,
    email: string,
    organisation: string,
    password: string
  ): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      name,
      email,
      organisation,
      tier: 'free',
      aiCreditsRemaining: 5,
      contractsCount: 0
    };
    
    setUser(newUser);
    localStorage.setItem('cmp_user_' + email, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('cmp_user_' + user.email, JSON.stringify(updatedUser));
    }
  };

  const toggleDeveloperMode = () => {
    setDeveloperMode(!developerMode);
    // If enabling dev mode, also upgrade to premium for testing
    if (!developerMode && user) {
      updateUser({ tier: 'premium', aiCreditsRemaining: 999 });
    }
  };

  const upgradeToPremium = () => {
    if (user) {
      updateUser({ tier: 'premium', aiCreditsRemaining: 999 });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        developerMode,
        login,
        register,
        logout,
        updateUser,
        toggleDeveloperMode,
        upgradeToPremium
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

// API Key management
export async function saveApiKey(provider: string, key: string): Promise<void> {
  const encrypted = await encryptKey(key);
  localStorage.setItem(`cmp_apikey_${provider}`, encrypted);
}

export async function getApiKey(provider: string): Promise<string> {
  const encrypted = localStorage.getItem(`cmp_apikey_${provider}`);
  if (!encrypted) return '';
  return await decryptKey(encrypted);
}

export function removeApiKey(provider: string): void {
  localStorage.removeItem(`cmp_apikey_${provider}`);
}
