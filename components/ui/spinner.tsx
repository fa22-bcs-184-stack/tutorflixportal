import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function Spinner({ className, size = 'default' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'size-3.5',
    default: 'size-4',
    lg: 'size-6',
  };

  return (
    <Loader2
      className={clsx('animate-spin text-current', sizeClasses[size], className)}
    />
  );
}
