'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Sidebar } from '@/components/shell/sidebar';
import { Topbar } from '@/components/shell/topbar';
import { ThemeLogo } from '@/components/ui/logo';
import { usePathname, useRouter } from 'next/navigation';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-pulse">
            <ThemeLogo className="h-8 w-auto" />
          </div>
          <p className="text-xs text-muted-foreground">Loading Tutorflix portal…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    /* Root flex row — matches reference DashboardShell pattern */
    <div className="flex min-h-svh bg-background">
      {/* Sidebar — desktop sticky + mobile drawer (both inside component) */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Content column — grows to fill remaining width */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuToggle={() => setMobileSidebarOpen((prev) => !prev)} />

        {/* Page content */}
        <main className="flex-1 px-4 py-6 lg:px-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
