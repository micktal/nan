import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useSound } from './use-sound';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'progress';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 = persistent
  action?: {
    label: string;
    onClick: () => void;
  };
  progress?: number; // 0-100 for progress notifications
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
  getUnreadCount: () => number;
  // Predefined notification helpers
  notifySuccess: (title: string, message: string, duration?: number) => string;
  notifyError: (title: string, message: string, duration?: number) => string;
  notifyWarning: (title: string, message: string, duration?: number) => string;
  notifyInfo: (title: string, message: string, duration?: number) => string;
  notifyProgress: (title: string, message: string, progress: number) => string;
  updateProgress: (id: string, progress: number, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { playSuccessSound, playErrorSound, playNotificationSound } = useSound();

  // Auto-remove notifications after their duration
  useEffect(() => {
    const timers: { [key: string]: NodeJS.Timeout } = {};

    notifications.forEach(notification => {
      if (notification.duration && notification.duration > 0 && !timers[notification.id]) {
        timers[notification.id] = setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
      }
    });

    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, [notifications]);

  const generateId = () => {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const id = generateId();
    const notification: Notification = {
      ...notificationData,
      id,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [notification, ...prev]);

    // Play appropriate sound
    switch (notification.type) {
      case 'success':
        playSuccessSound();
        break;
      case 'error':
        playErrorSound();
        break;
      default:
        playNotificationSound();
        break;
    }

    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const updateProgress = (id: string, progress: number, message?: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id
          ? {
              ...n,
              progress: Math.max(0, Math.min(100, progress)),
              message: message || n.message,
              timestamp: new Date().toISOString()
            }
          : n
      )
    );
  };

  // Helper functions
  const notifySuccess = (title: string, message: string, duration = 5000) => {
    return addNotification({ type: 'success', title, message, duration });
  };

  const notifyError = (title: string, message: string, duration = 8000) => {
    return addNotification({ type: 'error', title, message, duration });
  };

  const notifyWarning = (title: string, message: string, duration = 6000) => {
    return addNotification({ type: 'warning', title, message, duration });
  };

  const notifyInfo = (title: string, message: string, duration = 4000) => {
    return addNotification({ type: 'info', title, message, duration });
  };

  const notifyProgress = (title: string, message: string, progress: number) => {
    return addNotification({ type: 'progress', title, message, progress, duration: 0 });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        clearAll,
        getUnreadCount,
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,
        notifyProgress,
        updateProgress
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
