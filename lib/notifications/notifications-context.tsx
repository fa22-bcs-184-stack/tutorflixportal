'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/api-client';

export interface NotificationItem {
  id: string;
  type: 'LEAD_FOLLOWUP_REMINDER' | 'MODERATION_DEADLINE_REMINDER' | 'LOW_HOURS_WARNING' | 'PAYMENT_REJECTED' | 'INFO' | 'WARNING' | 'DANGER' | 'SUCCESS';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationsContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Initial mock fallback for development UI demo before API sync
const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'LOW_HOURS_WARNING',
    title: 'Low Hours Alert',
    body: 'Student Alex Johnson has only 2 remaining hours left in Package Bronze.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'notif-2',
    type: 'LEAD_FOLLOWUP_REMINDER',
    title: 'Lead Follow-up Due',
    body: 'Scheduled call for lead Sarah Connor is due in 15 minutes.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'notif-3',
    type: 'SUCCESS',
    title: 'Payment Approved',
    body: 'Top-up payment for 10 hours has been verified successfully.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient('/notifications');
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch {
      // Keep initial/fallback notifications on backend fetch failure
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Optionally trigger initial load if auth token exists
    if (typeof window !== 'undefined' && localStorage.getItem('tutorflix_auth_token')) {
      refreshNotifications();
    }
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
    try {
      await apiClient(`/notifications/${id}/read`, { method: 'PATCH' });
    } catch {
      // Optimistic update maintained
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    try {
      await apiClient('/notifications/read-all', { method: 'PATCH' });
    } catch {
      // Optimistic update maintained
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}
