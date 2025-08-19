import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

export interface AdminUser {
  id: string;
  username: string;
  role: "super_admin" | "admin" | "moderator";
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
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}

// Generate secure access codes
function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Avoid confusing characters
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Daily access codes (regenerated every day for security)
function getDailyAccessCodes() {
  const today = new Date().toISOString().split("T")[0];
  const seed = today.split("-").reduce((a, b) => parseInt(a) + parseInt(b), 0);

  // Seed-based generation for consistency within the day
  const codes = {
    admin: `ADM-${seed}${today.slice(-2)}A`,
    supervisor: `SUP-${seed}${today.slice(-2)}B`,
    hse: `HSE-${seed}${today.slice(-2)}C`,
  };

  return codes;
}

// Default admin accounts with dynamic codes
function getAdminAccounts() {
  const dailyCodes = getDailyAccessCodes();

  return {
    admin: {
      password: dailyCodes.admin,
      staticPassword: "SafetyAdmin2024!", // Fallback
      role: "super_admin" as const,
      permissions: [
        "view_all",
        "export_data",
        "manage_users",
        "system_settings",
        "analytics",
        "real_time_monitoring",
        "advanced_reports",
        "user_management",
        "security_logs",
      ],
    },
    supervisor: {
      password: dailyCodes.supervisor,
      staticPassword: "Supervisor2024!", // Fallback
      role: "admin" as const,
      permissions: ["view_all", "export_data", "analytics", "advanced_reports"],
    },
    hse: {
      password: dailyCodes.hse,
      staticPassword: "HSE2024!", // Fallback
      role: "moderator" as const,
      permissions: ["view_all", "analytics"],
    },
  };
}

// Get current access codes for display
export function getCurrentAccessCodes() {
  return getDailyAccessCodes();
}

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
      const savedSession = localStorage.getItem("admin-session");
      if (savedSession) {
        const session = JSON.parse(savedSession);

        // Check if session is still valid (8 hours)
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const hoursDiff =
          (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 8) {
          setUser(session);
          setIsAuthenticated(true);
          return;
        }
      }
    } catch (error) {
      console.error("Error checking admin session:", error);
    }

    // Clear invalid session
    localStorage.removeItem("admin-session");
  };

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const adminAccounts = getAdminAccounts();
    const adminData = adminAccounts[username as keyof typeof adminAccounts];

    // Check both daily code and static password
    const isValidPassword =
      adminData &&
      (adminData.password === password ||
        adminData.staticPassword === password);

    if (isValidPassword) {
      const adminUser: AdminUser = {
        id: `admin_${username}_${Date.now()}`,
        username,
        role: adminData.role,
        permissions: adminData.permissions,
        loginTime: new Date().toISOString(),
      };

      setUser(adminUser);
      setIsAuthenticated(true);

      // Save session to localStorage with enhanced security info
      const sessionData = {
        ...adminUser,
        loginMethod:
          adminData.password === password ? "daily_code" : "static_password",
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };
      localStorage.setItem("admin-session", JSON.stringify(sessionData));

      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("admin-session");
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
        isRole,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}
