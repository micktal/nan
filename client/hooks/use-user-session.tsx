import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  profileType: "driver" | "technician" | "cleaning" | "administrative";
  company?: string;
  visitDate: string;
  language: string;
}

export interface TrainingProgress {
  userId: string;
  currentStep: number; // 0=home, 1=profile, 2=intro, 3=safety, 4=qcm, 5=certificate, 6=completed
  completedSteps: number[];
  profileSelected: boolean;
  safetyZonesCompleted: string[];
  qcmStarted: boolean;
  qcmCompleted: boolean;
  qcmAnswers: number[];
  qcmScore?: number;
  startTime: string;
  lastActivity: string;
  sessionDuration: number; // in seconds
  certificateGenerated: boolean;
}

export interface TrainingSession {
  user: UserProfile | null;
  progress: TrainingProgress | null;
  isActive: boolean;
  sessionId: string;
}

interface UserSessionContextType {
  session: TrainingSession;
  startSession: (profile: Partial<UserProfile>) => void;
  updateProgress: (updates: Partial<TrainingProgress>) => void;
  saveAnswer: (questionIndex: number, answer: number) => void;
  completeStep: (step: number) => void;
  getCurrentStep: () => number;
  getCompletionPercentage: () => number;
  endSession: () => void;
  resumeSession: () => boolean;
  exportSessionData: () => any;
  clearSession: () => void;
}

const UserSessionContext = createContext<UserSessionContextType | undefined>(
  undefined,
);

export function useUserSession() {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error("useUserSession must be used within a UserSessionProvider");
  }
  return context;
}

interface UserSessionProviderProps {
  children: ReactNode;
}

export function UserSessionProvider({ children }: UserSessionProviderProps) {
  const [session, setSession] = useState<TrainingSession>({
    user: null,
    progress: null,
    isActive: false,
    sessionId: "",
  });

  // Load session from localStorage on mount
  useEffect(() => {
    loadSessionFromStorage();
  }, []);

  // Auto-save session changes
  useEffect(() => {
    if (session.isActive && session.progress) {
      saveSessionToStorage();
    }
  }, [session]);

  // Update session duration every minute
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (session.isActive && session.progress) {
      interval = setInterval(() => {
        const now = new Date().toISOString();
        const startTime = new Date(session.progress!.startTime);
        const duration = Math.floor((Date.now() - startTime.getTime()) / 1000);

        setSession((prev) => ({
          ...prev,
          progress: prev.progress
            ? {
                ...prev.progress,
                lastActivity: now,
                sessionDuration: duration,
              }
            : null,
        }));
      }, 60000); // Update every minute
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [session.isActive]);

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const loadSessionFromStorage = () => {
    try {
      const savedSession = localStorage.getItem("safety-training-session");
      if (savedSession) {
        const parsedSession = JSON.parse(savedSession);

        // Check if session is still valid (not older than 24 hours)
        const lastActivity = new Date(
          parsedSession.progress?.lastActivity || 0,
        );
        const now = new Date();
        const hoursDiff =
          (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);

        if (
          hoursDiff < 24 &&
          parsedSession.progress &&
          !parsedSession.progress.certificateGenerated
        ) {
          setSession(parsedSession);
          return true;
        } else {
          // Clear expired session
          localStorage.removeItem("safety-training-session");
        }
      }
    } catch (error) {
      console.error("Error loading session from storage:", error);
      localStorage.removeItem("safety-training-session");
    }
    return false;
  };

  const saveSessionToStorage = () => {
    try {
      localStorage.setItem("safety-training-session", JSON.stringify(session));
    } catch (error) {
      console.error("Error saving session to storage:", error);
    }
  };

  const startSession = (profileData: Partial<UserProfile>) => {
    const sessionId = generateSessionId();
    const now = new Date().toISOString();

    const newUser: UserProfile = {
      id: sessionId,
      firstName: profileData.firstName || "",
      lastName: profileData.lastName || "",
      email: profileData.email,
      profileType: profileData.profileType || "driver",
      company: profileData.company,
      visitDate: now,
      language: profileData.language || "fr",
    };

    const newProgress: TrainingProgress = {
      userId: sessionId,
      currentStep: 1,
      completedSteps: [0], // Home completed
      profileSelected: false,
      safetyZonesCompleted: [],
      qcmStarted: false,
      qcmCompleted: false,
      qcmAnswers: [],
      startTime: now,
      lastActivity: now,
      sessionDuration: 0,
      certificateGenerated: false,
    };

    const newSession: TrainingSession = {
      user: newUser,
      progress: newProgress,
      isActive: true,
      sessionId,
    };

    setSession(newSession);
  };

  const updateProgress = (updates: Partial<TrainingProgress>) => {
    setSession((prev) => ({
      ...prev,
      progress: prev.progress
        ? {
            ...prev.progress,
            ...updates,
            lastActivity: new Date().toISOString(),
          }
        : null,
    }));
  };

  const saveAnswer = (questionIndex: number, answer: number) => {
    setSession((prev) => {
      if (!prev.progress) return prev;

      const newAnswers = [...prev.progress.qcmAnswers];
      newAnswers[questionIndex] = answer;

      return {
        ...prev,
        progress: {
          ...prev.progress,
          qcmAnswers: newAnswers,
          lastActivity: new Date().toISOString(),
        },
      };
    });
  };

  const completeStep = (step: number) => {
    setSession((prev) => {
      if (!prev.progress) return prev;

      const completedSteps = [...prev.progress.completedSteps];
      if (!completedSteps.includes(step)) {
        completedSteps.push(step);
      }

      return {
        ...prev,
        progress: {
          ...prev.progress,
          currentStep: Math.max(prev.progress.currentStep, step + 1),
          completedSteps,
          lastActivity: new Date().toISOString(),
        },
      };
    });
  };

  const getCurrentStep = () => {
    return session.progress?.currentStep || 0;
  };

  const getCompletionPercentage = () => {
    if (!session.progress) return 0;
    const totalSteps = 6; // 0=home, 1=profile, 2=intro, 3=safety, 4=qcm, 5=certificate
    return Math.round(
      (session.progress.completedSteps.length / totalSteps) * 100,
    );
  };

  const endSession = () => {
    if (session.progress) {
      updateProgress({ certificateGenerated: true });
    }

    // Keep session data for analytics but mark as inactive
    setSession((prev) => ({
      ...prev,
      isActive: false,
    }));
  };

  const resumeSession = () => {
    return loadSessionFromStorage();
  };

  const exportSessionData = () => {
    return {
      session,
      exportDate: new Date().toISOString(),
      version: "1.0",
    };
  };

  const clearSession = () => {
    localStorage.removeItem("safety-training-session");
    setSession({
      user: null,
      progress: null,
      isActive: false,
      sessionId: "",
    });
  };

  return (
    <UserSessionContext.Provider
      value={{
        session,
        startSession,
        updateProgress,
        saveAnswer,
        completeStep,
        getCurrentStep,
        getCompletionPercentage,
        endSession,
        resumeSession,
        exportSessionData,
        clearSession,
      }}
    >
      {children}
    </UserSessionContext.Provider>
  );
}
