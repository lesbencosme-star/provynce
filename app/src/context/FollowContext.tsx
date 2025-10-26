import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface FollowedProject {
  id: number;
  name: string;
  followedAt: string;
  notifyMilestones: boolean;
  notifyPayments: boolean;
  notifyUpdates: boolean;
}

interface Notification {
  id: string;
  projectId: number;
  projectName: string;
  type: 'milestone' | 'payment' | 'update';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface FollowContextType {
  followedProjects: FollowedProject[];
  notifications: Notification[];
  followProject: (projectId: number, projectName: string) => void;
  unfollowProject: (projectId: number) => void;
  isFollowing: (projectId: number) => boolean;
  updateNotificationPreferences: (projectId: number, preferences: Partial<Omit<FollowedProject, 'id' | 'name' | 'followedAt'>>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotification: (notificationId: string) => void;
  unreadCount: number;
}

const FollowContext = createContext<FollowContextType | undefined>(undefined);

const STORAGE_KEY = 'provynce_followed_projects';
const NOTIFICATIONS_KEY = 'provynce_notifications';

export function FollowProvider({ children }: { children: ReactNode }) {
  const [followedProjects, setFollowedProjects] = useState<FollowedProject[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setFollowedProjects(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse followed projects:', e);
        }
      }

      const storedNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
      if (storedNotifications) {
        try {
          setNotifications(JSON.parse(storedNotifications));
        } catch (e) {
          console.error('Failed to parse notifications:', e);
        }
      }
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(followedProjects));
    }
  }, [followedProjects]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  const followProject = useCallback((projectId: number, projectName: string) => {
    setFollowedProjects((prev) => {
      if (prev.some((p) => p.id === projectId)) {
        return prev;
      }
      return [
        ...prev,
        {
          id: projectId,
          name: projectName,
          followedAt: new Date().toISOString(),
          notifyMilestones: true,
          notifyPayments: true,
          notifyUpdates: true,
        },
      ];
    });
  }, []);

  const unfollowProject = useCallback((projectId: number) => {
    setFollowedProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  const isFollowing = useCallback(
    (projectId: number) => {
      return followedProjects.some((p) => p.id === projectId);
    },
    [followedProjects]
  );

  const updateNotificationPreferences = useCallback(
    (projectId: number, preferences: Partial<Omit<FollowedProject, 'id' | 'name' | 'followedAt'>>) => {
      setFollowedProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, ...preferences } : p))
      );
    },
    []
  );

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const clearNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: FollowContextType = {
    followedProjects,
    notifications,
    followProject,
    unfollowProject,
    isFollowing,
    updateNotificationPreferences,
    markNotificationAsRead,
    clearNotification,
    unreadCount,
  };

  return <FollowContext.Provider value={value}>{children}</FollowContext.Provider>;
}

export function useFollow() {
  const context = useContext(FollowContext);
  if (context === undefined) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  return context;
}
