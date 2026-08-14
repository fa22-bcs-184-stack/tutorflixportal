'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, GraduationCap, AlertTriangle } from 'lucide-react';

interface ParentChatMessage {
  id: string;
  sender: 'PARENT' | 'TUTOR' | 'ADMIN';
  text: string;
  timestamp: string;
  flagged?: boolean;
}

export default function ParentMessagesPage() {
  const [messages, setMessages] = useState<ParentChatMessage[]>([
    {
      id: 'msg-p1',
      sender: 'ADMIN',
      text: 'Welcome Priya! I am your assigned Case Admin. Feel free to message here for schedule updates or tutor requests.',
      timestamp: 'Yesterday 09:30 AM',
    },
    {
      id: 'msg-p2',
      sender: 'TUTOR',
      text: 'Hello Mrs. Sharma! Aarav completed his Calculus prep session today with great focus.',
      timestamp: 'Today 11:30 AM',
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const text = inputMsg.trim();
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

    if (phoneRegex.test(text) || emailRegex.test(text)) {
      setErrorMsg('Sharing direct phone numbers or email addresses is hard-blocked for safety.');
      return;
    }

    setErrorMsg(null);
    const isUrl = /https?:\/\/[^\s]+/.test(text);

    const newMsg: ParentChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'PARENT',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      flagged: isUrl,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages & Communication"
        subtitle="Direct messaging thread with your children's tutors and assigned Case Admin."
        breadcrumbs={[
          { label: 'Parent', href: '/parent' },
          { label: 'Messages' },
        ]}
      />

      <Panel title="Household Communication Thread" description="Tutors: Dr. Alan Turing, Prof. Ada Lovelace · Case Admin: Sofia Reyes">
        <div className="space-y-4 pt-2">
          {errorMsg && (
            <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Chat Box */}
          <div className="min-h-[320px] max-h-[420px] overflow-y-auto p-4 rounded-xl bg-muted/20 border border-border space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'PARENT' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-md ${
                    m.sender === 'PARENT'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : m.sender === 'ADMIN'
                      ? 'bg-cta/15 border border-cta/30 text-foreground rounded-bl-none'
                      : 'bg-card text-foreground border border-border rounded-bl-none shadow-2xs'
                  }`}
                >
                  {m.sender !== 'PARENT' && (
                    <span className="text-[10px] font-bold block mb-1 uppercase tracking-wider text-muted-foreground">
                      {m.sender === 'ADMIN' ? 'Case Admin (Sofia Reyes)' : 'Tutor'}
                    </span>
                  )}
                  <p>{m.text}</p>
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground px-1">
                  <span>{m.timestamp}</span>
                  {m.flagged && (
                    <Badge variant="outline" className="text-[9px] bg-warning-subtle text-warning border-warning/30">
                      Soft Flagged (Review Pending)
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Type your message to tutor or caseworker..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="text-xs h-10 bg-muted/30 flex-1"
            />
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary-hover text-xs gap-1.5 h-10 px-4">
              <Send className="size-3.5" /> Send
            </Button>
          </form>
        </div>
      </Panel>
    </div>
  );
}
