'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient, ApiClientError } from '../api/api-client';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  country?: string;
  timezone?: string;
  isOnLeave?: boolean;
  roles: string[];
  studentId?: string;
  parentId?: string;
  tutorId?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  roles: string[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getRoleDefaultPath: (userRoles?: string[]) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Demo credentials for all 8 roles (local preview) ─────────────────────────
export const DEMO_CREDENTIALS: Record<string, { email: string; password: string; label: string; name: string; roles: string[] }> = {
  student:     { email: 'student@tutorflix.com',     password: 'Demo1234!', label: 'Student',        name: 'Aarav Sharma',     roles: ['Student'] },
  parent:      { email: 'parent@tutorflix.com',      password: 'Demo1234!', label: 'Parent',         name: 'Priya Sharma',     roles: ['Parent'] },
  tutor:       { email: 'tutor@tutorflix.com',       password: 'Demo1234!', label: 'Tutor',          name: 'Dr. Alan Turing',  roles: ['Tutor'] },
  admin:       { email: 'admin@tutorflix.com',       password: 'Demo1234!', label: 'Admin',          name: 'Sofia Reyes',      roles: ['Admin'] },
  scheduler:   { email: 'scheduler@tutorflix.com',   password: 'Demo1234!', label: 'Intro Scheduler',name: 'Elena Rostova',    roles: ['Intro Scheduler'] },
  manager:     { email: 'manager@tutorflix.com',     password: 'Demo1234!', label: 'Admin Manager',  name: 'James Carter',     roles: ['Admin Manager'] },
  hod:         { email: 'hod@tutorflix.com',         password: 'Demo1234!', label: 'HOD',            name: 'Dr. Lisa Monroe',  roles: ['HOD'] },
  stakeholder: { email: 'stakeholder@tutorflix.com', password: 'Demo1234!', label: 'Stakeholder',    name: 'Robert Blackwood', roles: ['Stakeholder'] },
};

export const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-demo-scheduler',
  email: 'scheduler@tutorflix.com',
  fullName: 'Elena Rostova',
  phone: '+1 555 234 5678',
  country: 'United States',
  timezone: 'America/New_York',
  roles: ['Intro Scheduler'],
};

export function getRoleDefaultPath(userRoles: string[] = []): string {
  if (userRoles.includes('Admin Manager')) return '/manager';
  if (userRoles.includes('HOD'))          return '/hod';
  if (userRoles.includes('Stakeholder'))  return '/stakeholder';
  if (userRoles.includes('Admin'))        return '/admin';
  if (userRoles.includes('Intro Scheduler')) return '/scheduler';
  if (userRoles.includes('Tutor'))        return '/tutor';
  if (userRoles.includes('Parent'))       return '/parent';
  if (userRoles.includes('Student'))      return '/student';
  return '/scheduler';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('tutorflix_auth_token');
    const storedUser = localStorage.getItem('tutorflix_user_profile');

    if (storedToken && storedUser) {
      try {
        const parsedUser: UserProfile = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setRoles(parsedUser.roles || []);
      } catch (err) {
        console.error('Failed to parse stored user profile', err);
        localStorage.removeItem('tutorflix_auth_token');
        localStorage.removeItem('tutorflix_user_profile');
        // Fallback to demo user
        setUser(DEFAULT_DEMO_USER);
        setRoles(DEFAULT_DEMO_USER.roles);
      }
    } else {
      // Default to demo user for local preview
      setUser(DEFAULT_DEMO_USER);
      setRoles(DEFAULT_DEMO_USER.roles);
      setToken('demo-jwt-token');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const authToken = data.token || data.accessToken || 'demo-jwt-token';
      const userProfile: UserProfile = {
        id: data.user?.id || 'usr-demo-01',
        email: data.user?.email || email,
        fullName: data.user?.fullName || data.user?.name || email.split('@')[0],
        phone: data.user?.phone,
        avatarUrl: data.user?.avatarUrl,
        dateOfBirth: data.user?.dateOfBirth,
        gender: data.user?.gender,
        country: data.user?.country,
        timezone: data.user?.timezone,
        isOnLeave: data.user?.isOnLeave,
        roles: data.roles || data.user?.roles || ['Intro Scheduler', 'Admin'],
        studentId: data.studentId || data.user?.studentId,
        parentId: data.parentId || data.user?.parentId,
        tutorId: data.tutorId || data.user?.tutorId,
      };

      localStorage.setItem('tutorflix_auth_token', authToken);
      localStorage.setItem('tutorflix_user_profile', JSON.stringify(userProfile));

      setToken(authToken);
      setUser(userProfile);
      setRoles(userProfile.roles);

      const defaultPath = getRoleDefaultPath(userProfile.roles);
      router.push(defaultPath);
    } catch {
      // Fallback local login — resolve role from known demo credentials
      const emailLower = email.toLowerCase().trim();
      const matched = Object.values(DEMO_CREDENTIALS).find((c) => c.email === emailLower);

      const demoProfile: UserProfile = {
        id: `usr-demo-${matched?.label.toLowerCase().replace(/\s+/g, '-') || 'unknown'}`,
        email: emailLower,
        fullName: matched?.name ?? emailLower.split('@')[0].replace('.', ' '),
        phone: '+1 555 000 0000',
        country: 'United States',
        timezone: 'America/New_York',
        roles: matched?.roles ?? ['Intro Scheduler'],
      };

      localStorage.setItem('tutorflix_auth_token', 'demo-jwt-token');
      localStorage.setItem('tutorflix_user_profile', JSON.stringify(demoProfile));

      setToken('demo-jwt-token');
      setUser(demoProfile);
      setRoles(demoProfile.roles);

      const path = getRoleDefaultPath(demoProfile.roles);
      router.push(path);
    }
  };

  const logout = () => {
    localStorage.removeItem('tutorflix_auth_token');
    localStorage.removeItem('tutorflix_user_profile');
    setToken(null);
    setUser(null);
    setRoles([]);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        roles,
        isLoading,
        login,
        logout,
        getRoleDefaultPath,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
