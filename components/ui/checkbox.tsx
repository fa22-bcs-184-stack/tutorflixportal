'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="peer sr-only"
          {...props}
        />
        <div
          onClick={() => !disabled && onCheckedChange?.(!checked)}
          className={cn(
            'size-4 shrink-0 rounded-sm border border-border bg-background transition-colors cursor-pointer peer-focus-visible:ring-2 peer-focus-visible:ring-ring flex items-center justify-center',
            checked && 'bg-primary text-primary-foreground border-primary',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
        >
          {checked && <Check className="size-3 text-white stroke-[3]" />}
        </div>
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
