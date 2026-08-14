'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/lib/notifications/notifications-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Bell, CheckCheck, Filter } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    return true;
  });

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Notification History
          </h1>
          <p className="text-sm text-muted-foreground">
            Review your activity alerts, class reminders, and administrative updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="size-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filter === 'unread'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filter === 'unread' ? 'No unread notifications' : 'No notifications'}
          description={
            filter === 'unread'
              ? 'You have caught up with all your notification updates.'
              : 'Notifications will appear here as activity occurs on your account.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <Card
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-4 transition-colors cursor-pointer border ${
                !n.read ? 'border-primary/30 bg-card' : 'border-border/60 bg-card/60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={`text-[10px] uppercase font-semibold tracking-wider ${getBadgeStyle(n.type)}`}>
                    {n.type.replace(/_/g, ' ')}
                  </Badge>
                  <h3 className="font-heading text-sm font-semibold text-foreground">
                    {n.title}
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{n.body}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
