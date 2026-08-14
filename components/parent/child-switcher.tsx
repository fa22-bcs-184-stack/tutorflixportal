'use client';

import React from 'react';
import { Users, User } from 'lucide-react';
import { LinkedChildItem } from '@/lib/api/parent-api';

interface ChildSwitcherProps {
  childrenList: LinkedChildItem[];
  selectedChildId: string; // 'ALL' or studentId
  onSelectChild: (id: string) => void;
}

export function ChildSwitcher({
  childrenList,
  selectedChildId,
  onSelectChild,
}: ChildSwitcherProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
      <span className="text-muted-foreground font-medium text-[11px] shrink-0 mr-1 flex items-center gap-1">
        <Users className="size-3.5 text-primary" /> Select Child:
      </span>

      {/* "All Children" Option */}
      <button
        type="button"
        onClick={() => onSelectChild('ALL')}
        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
          selectedChildId === 'ALL'
            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
            : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
        }`}
      >
        <Users className="size-3.5" /> All Children ({childrenList.length})
      </button>

      {/* Individual Children Buttons */}
      {childrenList.map((child) => {
        const isSelected = selectedChildId === child.id;

        return (
          <button
            type="button"
            key={child.id}
            onClick={() => onSelectChild(child.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
              isSelected
                ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                : 'border-border bg-card text-muted-foreground hover:bg-muted/40'
            }`}
          >
            <User className="size-3.5" />
            <span>{child.studentName}</span>
            <span className="text-[10px] opacity-80">({child.remainingHours}h left)</span>
          </button>
        );
      })}
    </div>
  );
}
