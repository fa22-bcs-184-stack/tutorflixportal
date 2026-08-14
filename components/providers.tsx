'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth/auth-context';
import { NotificationsProvider } from '@/lib/notifications/notifications-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NotificationsProvider>
        {children}
      </NotificationsProvider>
    </AuthProvider>
  );
}
