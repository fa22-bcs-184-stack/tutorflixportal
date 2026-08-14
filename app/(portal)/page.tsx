'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { ThemeLogo } from '@/components/ui/logo';

export default function PortalHomePage() {
  const { user, roles, getRoleDefaultPath, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        const targetPath = getRoleDefaultPath(roles);
        router.replace(targetPath);
      } else {
        router.replace('/login');
      }
    }
  }, [user, roles, isLoading, router, getRoleDefaultPath]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-2">
        <div className="mx-auto h-8 w-auto animate-pulse">
          <img
            src="/logo-light.png"
            alt="Tutorflix"
            className="h-8 w-auto mx-auto"
          />
        </div>
        <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
