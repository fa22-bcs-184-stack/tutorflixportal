'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, CheckCheck } from 'lucide-react';
import { useNotifications } from '@/lib/notifications/notifications-context';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const recentNotifications = notifications.slice(0, 5);

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'LOW_HOURS_WARNING':
      case 'WARNING':
        return 'bg-warning-subtle text-warning border-0';
      case 'PAYMENT_REJECTED':
      case 'MODERATION_DEADLINE_REMINDER':
      case 'DANGER':
        return 'bg-danger-subtle text-danger border-0';
      case 'SUCCESS':
        return 'bg-success-subtle text-success border-0';
      default:
        return 'bg-info-subtle text-info border-0';
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="relative inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Notifications"
          >
            <Bell className="size-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-danger-foreground">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0">
        <div className="flex items-center justify-between p-3.5 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm font-semibold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-danger-subtle text-danger border-0 text-xs px-1.5 py-0.5">
                {unreadCount} unread
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
          {recentNotifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            recentNotifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer transition-colors ${
                  !n.read ? 'bg-muted/40 font-medium' : ''
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Badge className={`text-[10px] uppercase font-semibold tracking-wider ${getBadgeStyle(n.type)}`}>
                    {n.type.replace(/_/g, ' ')}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">{formatTime(n.createdAt)}</span>
                </div>
                <span className="text-sm text-foreground leading-snug">{n.title}</span>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-normal">
                  {n.body}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <div className="p-2 border-t border-border bg-muted/30 text-center">
          <Link
            href="/notifications"
            className="text-xs font-medium text-primary hover:underline block py-1"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
