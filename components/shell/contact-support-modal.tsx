'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Paperclip,
  Send,
  CheckCircle2,
  AlertCircle,
  ImageIcon,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  'Bug / Technical Issue',
  'Feature Request',
  'Billing Question',
  'Account Access',
  'Other',
] as const;

type Category = (typeof CATEGORIES)[number];

interface AttachedFile {
  file: File;
  preview: string; // object URL
}

interface ContactSupportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ContactSupportModal
───────────────────────────────────────────────────────────────────────────── */
export function ContactSupportModal({ open, onOpenChange }: ContactSupportModalProps) {
  const [category, setCategory] = useState<Category | ''>('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<AttachedFile | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── helpers ── */
  const reset = () => {
    setCategory('');
    setSubject('');
    setDescription('');
    setAttachment(null);
    setSubmitted(false);
    setError(null);
    setCategoryOpen(false);
  };

  const handleClose = () => {
    onOpenChange(false);
    // delay reset so animation can play
    setTimeout(reset, 300);
  };

  const attachFile = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('Screenshot must be under 5 MB.');
      return;
    }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('Only PNG, JPG, or WEBP images are accepted.');
      return;
    }
    if (attachment) URL.revokeObjectURL(attachment.preview);
    setError(null);
    setAttachment({ file, preview: URL.createObjectURL(file) });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) attachFile(f);
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) attachFile(f);
  }, []);

  const removeAttachment = () => {
    if (attachment) URL.revokeObjectURL(attachment.preview);
    setAttachment(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) { setError('Please select a category.'); return; }
    if (!subject.trim()) { setError('Please enter a subject.'); return; }
    if (!description.trim()) { setError('Please describe your issue.'); return; }
    setError(null);
    // TODO: POST /support/tickets when backend is ready (see future.md)
    setSubmitted(true);
  };

  // Portal mount guard — avoids SSR mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  /* ── render ── */
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 overflow-hidden">

              {/* ── Header ── */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div>
                  <h2 className="text-base font-bold text-foreground">Contact Support</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Describe your issue — IT will follow up off-platform.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* ── Body ── */}
              <div className="px-6 py-5">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    /* Success state */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 py-8 text-center"
                    >
                      <div className="flex size-16 items-center justify-center rounded-full bg-success/15">
                        <CheckCircle2 className="size-8 text-success" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">Request Received</p>
                        <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                          Your support ticket has been logged. IT will reach out to you off-platform shortly.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleClose}
                        className="mt-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        Done
                      </button>
                    </motion.div>
                  ) : (
                    /* Form */
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      {/* Error banner */}
                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-start gap-2.5 rounded-lg border border-danger/20 bg-danger-subtle px-3.5 py-2.5 text-sm text-danger">
                              <AlertCircle className="mt-0.5 size-4 shrink-0" />
                              {error}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Category custom select */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80">Category</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setCategoryOpen((v) => !v)}
                            className={cn(
                              'flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm transition-all',
                              'bg-background hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20',
                              category ? 'text-foreground border-border' : 'text-muted-foreground border-border'
                            )}
                          >
                            {category || 'Select a category…'}
                            <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', categoryOpen && 'rotate-180')} />
                          </button>
                          <AnimatePresence>
                            {categoryOpen && (
                              <motion.ul
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.15 }}
                                className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg"
                              >
                                {CATEGORIES.map((cat) => (
                                  <li key={cat}>
                                    <button
                                      type="button"
                                      onClick={() => { setCategory(cat); setCategoryOpen(false); }}
                                      className={cn(
                                        'w-full px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-muted',
                                        category === cat && 'bg-primary/8 font-semibold text-primary'
                                      )}
                                    >
                                      {cat}
                                    </button>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Subject */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80">Subject</label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Brief summary of the issue"
                          maxLength={100}
                          className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80">Description</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Describe the issue in detail — steps to reproduce, what you expected, what happened…"
                          rows={4}
                          maxLength={1000}
                          className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                        />
                        <p className="text-right text-[11px] text-muted-foreground/60">{description.length}/1000</p>
                      </div>

                      {/* Screenshot attachment */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground/80">
                          Screenshot <span className="font-normal text-muted-foreground">(optional — PNG/JPG/WEBP, max 5 MB)</span>
                        </label>

                        {attachment ? (
                          /* Preview */
                          <div className="relative flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                            <img
                              src={attachment.preview}
                              alt="Preview"
                              className="size-12 rounded-lg object-cover border border-border shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-xs font-medium text-foreground">{attachment.file.name}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {(attachment.file.size / 1024).toFixed(0)} KB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={removeAttachment}
                              className="flex size-7 items-center justify-center rounded-lg text-danger hover:bg-danger-subtle transition-colors shrink-0"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        ) : (
                          /* Drop zone */
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            className={cn(
                              'flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-5 text-center transition-all',
                              dragOver
                                ? 'border-primary/60 bg-primary/5'
                                : 'border-border/60 hover:border-primary/40 hover:bg-muted/30'
                            )}
                          >
                            <div className={cn('flex size-10 items-center justify-center rounded-xl transition-colors', dragOver ? 'bg-primary/15' : 'bg-muted')}>
                              <ImageIcon className={cn('size-5 transition-colors', dragOver ? 'text-primary' : 'text-muted-foreground')} />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-foreground">
                                Drop screenshot here or <span className="text-primary">browse</span>
                              </p>
                              <p className="text-[11px] text-muted-foreground">PNG, JPG, WEBP — max 5 MB</p>
                            </div>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="hidden"
                          onChange={handleFileInput}
                        />
                      </div>

                      {/* Submit */}
                      <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          <Send className="size-3.5" />
                          Send to Support
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
