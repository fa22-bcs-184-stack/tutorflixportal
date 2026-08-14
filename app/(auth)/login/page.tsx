'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, DEMO_CREDENTIALS } from '@/lib/auth/auth-context';
import { ApiClientError } from '@/lib/api/api-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, ArrowRight, Zap } from 'lucide-react';

// Role colours matching design-system tokens
const ROLE_COLOURS: Record<string, string> = {
  student:     'bg-primary/10 text-primary border-primary/25 hover:bg-primary/20',
  parent:      'bg-info/10 text-info border-info/25 hover:bg-info/20',
  tutor:       'bg-cta/10 text-cta border-cta/25 hover:bg-cta/20',
  admin:       'bg-warning/10 text-warning border-warning/25 hover:bg-warning/20',
  scheduler:   'bg-success/10 text-success border-success/25 hover:bg-success/20',
  manager:     'bg-danger/10 text-danger border-danger/25 hover:bg-danger/20',
  hod:         'bg-[hsl(270,60%,55%)]/10 text-[hsl(270,60%,55%)] border-[hsl(270,60%,55%)]/25 hover:bg-[hsl(270,60%,55%)]/20',
  stakeholder: 'bg-[hsl(38,80%,48%)]/10 text-[hsl(38,80%,48%)] border-[hsl(38,80%,48%)]/25 hover:bg-[hsl(38,80%,48%)]/20',
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorBanner('Please enter both email and password.');
      return;
    }
    setIsSubmitting(true);
    setErrorBanner(null);
    try {
      await login(email, password);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        if (err.status === 401) {
          setErrorBanner('Invalid email or password. Contact IT if you need password assistance.');
        } else if (err.status === 403) {
          setErrorBanner('Your account is inactive or restricted. Please contact support.');
        } else {
          setErrorBanner(err.message || 'Failed to authenticate. Please try again.');
        }
      } else {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setErrorBanner(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // One-click demo login for a role
  const handleQuickLogin = async (key: string) => {
    const cred = DEMO_CREDENTIALS[key];
    if (!cred) return;
    setEmail(cred.email);
    setPassword(cred.password);
    setIsSubmitting(true);
    setErrorBanner(null);
    try {
      await login(cred.email, cred.password);
    } catch {
      // swallow — auth-context fallback handles it
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-svh bg-background">
      {/* ── Brand panel (desktop) ─────────────────────────────────────────── */}
      <aside
        className="relative hidden w-[48%] flex-col justify-between overflow-hidden border-r border-border bg-muted/40 px-12 py-10 text-center lg:flex xl:w-[52%] xl:px-14"
        aria-hidden="true"
      >
        <div className="pointer-events-none absolute -left-24 -top-24 size-[420px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 size-[320px] rounded-full bg-info/10 blur-[80px]" />

        <div className="relative z-10 mx-auto flex w-full max-w-[400px] flex-col items-center gap-8 pt-10">
          <div className="flex h-40 w-40 items-center justify-center rounded-full bg-background/80 ring-1 ring-border shadow-lg shadow-black/5">
            <img src="/logo-light.png" alt="Tutorflix" className="h-28 w-auto" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Tutorflix Portal
            </p>
            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground">
              Built for every tutoring role.
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Secure access for staff, tutors, students, and families with one adaptive dashboard.
            </p>
          </div>
        </div>

        {/* Demo role credential table for the brand panel */}
        <div className="relative z-10 mx-auto w-full max-w-[400px] pb-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Demo Credentials
          </p>
          <div className="overflow-hidden rounded-xl border border-border bg-background/60 backdrop-blur-sm">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-3 py-2 font-semibold text-muted-foreground">Role</th>
                  <th className="px-3 py-2 font-semibold text-muted-foreground">Email</th>
                  <th className="px-3 py-2 font-semibold text-muted-foreground">Password</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {Object.entries(DEMO_CREDENTIALS).map(([key, cred]) => (
                  <tr key={key} className="hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2 font-semibold text-foreground">{cred.label}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{cred.email}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{cred.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Tutorflix. All rights reserved.
          </p>
        </div>
      </aside>

      {/* ── Sign-in column ────────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px]"
        >
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <img src="/logo-light.png" alt="Tutorflix" className="h-16 w-auto sm:h-20" />
          </div>

          <Card className="shadow-soft">
            <CardHeader className="gap-1.5 pb-2">
              <CardTitle className="text-xl font-bold tracking-tight">Sign in</CardTitle>
              <CardDescription>
                Enter your email and password to access the portal.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2 space-y-5">
              <AnimatePresence>
                {errorBanner && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle px-3.5 py-3 text-sm text-danger"
                    >
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      <span className="leading-normal">{errorBanner}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick-access role buttons */}
              <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2.5">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <Zap className="size-3.5 text-primary" /> Quick Demo Login
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.entries(DEMO_CREDENTIALS).map(([key, cred]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleQuickLogin(key)}
                      disabled={isSubmitting}
                      className={`rounded-lg border px-2.5 py-2 text-left text-[11px] font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 ${ROLE_COLOURS[key] ?? 'bg-muted/30 text-foreground'}`}
                    >
                      {cred.label}
                      <span className="block text-[9px] font-normal opacity-60">{cred.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex-1 border-t border-border" />
                <span>or sign in manually</span>
                <div className="flex-1 border-t border-border" />
              </div>

              <form onSubmit={handleSubmit}>
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@tutorflix.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      required
                      className="h-11"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      required
                      className="h-11"
                    />
                  </Field>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="mt-1 h-11 w-full bg-primary text-primary-foreground hover:bg-primary-hover"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" />
                        Signing in…
                      </>
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="size-4" data-icon="inline-end" />
                      </>
                    )}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>

            <CardFooter className="justify-center py-3.5">
              <p className="text-center text-xs leading-relaxed text-muted-foreground">
                Password resets are handled by IT/Technical support off-platform.
                Contact your administrator if you need access.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
