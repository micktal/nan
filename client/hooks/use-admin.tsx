import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export interface AdminUser {
  id: string;
  username: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  loginTime: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isRole: (role: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

// Default admin accounts (in production, this would be from a secure backend)
const DEFAULT_ADMINS = {
  'admin': {
    password: 'SafetyAdmin2024!',
    role: 'super_admin' as const,
    permissions: ['view_all', 'export_data', 'manage_users', 'system_settings', 'analytics']
  },
  'supervisor': {
    password: 'Supervisor2024!',
    role: 'admin' as const,
    permissions: ['view_all', 'export_data', 'analytics']
  },
  'hse': {
    password: 'HSE2024!',
    role: 'moderator' as const,
    permissions: ['view_all', 'analytics']
  }
};

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);

  // Check for existing admin session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = () => {
    try {
      const savedSession = localStorage.getItem('admin-session');
      if (savedSession) {
        const session = JSON.parse(savedSession);
        
        // Check if session is still valid (8 hours)
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 8) {
          setUser(session);
          setIsAuthenticated(true);
          return;
        }
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
    }
    
    // Clear invalid session
    localStorage.removeItem('admin-session');
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const adminData = DEFAULT_ADMINS[username as keyof typeof DEFAULT_ADMINS];
    
    if (adminData && adminData.password === password) {
      const adminUser: AdminUser = {
        id: `admin_${username}_${Date.now()}`,
        username,
        role: adminData.role,
        permissions: adminData.permissions,
        loginTime: new Date().toISOString()
      };

      setUser(adminUser);
      setIsAuthenticated(true);
      
      // Save session to localStorage
      localStorage.setItem('admin-session', JSON.stringify(adminUser));
      
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin-session');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const isRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        hasPermission,
        isRole
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
