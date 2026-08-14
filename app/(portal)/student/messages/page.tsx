'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, GraduationCap, ShieldAlert, AlertTriangle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'STUDENT' | 'TUTOR';
  text: string;
  timestamp: string;
  flagged?: boolean;
}

export default function StudentMessagesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'TUTOR',
      text: 'Hi Aarav! Looking forward to our IB Math HL calculus session tomorrow.',
      timestamp: '10:15 AM',
    },
    {
      id: 'msg-2',
      sender: 'STUDENT',
      text: 'Hi Dr. Turing! I have prepared the past paper questions we discussed.',
      timestamp: '10:18 AM',
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    // Client-side moderation check for hard-blocked contact details
    const text = inputMsg.trim();
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

    if (phoneRegex.test(text) || emailRegex.test(text)) {
      setErrorMsg('Sharing direct phone numbers or email addresses is hard-blocked for safety.');
      return;
    }

    setErrorMsg(null);

    // Check soft-flag for URL/profanity
    const isUrl = /https?:\/\/[^\s]+/.test(text);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'STUDENT',
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
        title="Chat with Tutor"
        subtitle="Direct academic messaging with your assigned tutor."
        breadcrumbs={[
          { label: 'Student', href: '/student' },
          { label: 'Messages' },
        ]}
      />

      <Panel title="Conversation with Dr. Alan Turing" description="Mathematics HL Tutor">
        <div className="space-y-4 pt-2">
          {errorMsg && (
            <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle p-3 text-xs text-danger">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Chat Messages Box */}
          <div className="min-h-[320px] max-h-[420px] overflow-y-auto p-4 rounded-xl bg-muted/20 border border-border space-y-3 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'STUDENT' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-md ${
                    m.sender === 'STUDENT'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card text-foreground border border-border rounded-bl-none shadow-2xs'
                  }`}
                >
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

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Type your message to tutor..."
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
