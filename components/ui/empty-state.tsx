import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center ${className}`}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <Icon className="size-6" />
      </div>
      <h3 className="font-heading text-base font-medium text-foreground mb-1">
        {title}
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="bg-primary hover:bg-primary-hover">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
