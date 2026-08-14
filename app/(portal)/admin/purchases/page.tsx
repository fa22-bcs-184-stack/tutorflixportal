'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shell/page-header';
import { Panel } from '@/components/dashboard/panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ManualAdjustmentModal } from '@/components/admin/manual-adjustment-modal';
import { CreditCard, History, SlidersHorizontal, RefreshCw, ShieldCheck } from 'lucide-react';
import { getStudentPurchases, PurchaseItem } from '@/lib/api/admin-api';

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Manual Adjustment Modal State
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null);

  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const data = await getStudentPurchases();
      setPurchases(data);
    } catch {
      setPurchases([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleOpenAdjustment = (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase);
    setAdjustmentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchases & Audit Ledger"
        subtitle="View student package purchases and complete PurchaseTransaction audit ledgers for your assigned caseload."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Purchases' },
        ]}
        action={
          <Button variant="outline" size="sm" onClick={fetchPurchases} disabled={isLoading} className="gap-2 text-xs">
            <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} /> Refresh Purchases
          </Button>
        }
      />

      <Panel title="Caseload Student Purchases & Audit Ledgers" description="Stored remaining hours counter and transaction audit ledgers">
        {isLoading ? (
          <div className="flex min-h-[250px] items-center justify-center text-xs text-muted-foreground">
            <Spinner className="mr-2" /> Loading purchases...
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl my-2">
            <CreditCard className="size-8 text-muted-foreground/60 mb-2" />
            <p className="font-semibold text-foreground text-sm">No Student Purchases Found</p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {purchases.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-card border border-border space-y-3">
                {/* Purchase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm">{p.studentName}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          p.status === 'ACTIVE'
                            ? 'bg-success-subtle text-success border-success/30'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{p.packageName} — Purchased {p.purchaseDate}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground uppercase font-medium">Remaining Hours</span>
                      <p className="font-bold text-foreground text-sm">${p.packagePrice} ({p.remainingHours} / {p.purchasedHours} hrs left)</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenAdjustment(p)}
                      className="text-xs h-8 gap-1.5 border-primary/40 text-primary hover:bg-primary/5"
                    >
                      <SlidersHorizontal className="size-3.5" /> Adjust Hours
                    </Button>
                  </div>
                </div>

                {/* PurchaseTransaction Audit Ledger */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <History className="size-3" /> Purchase Transaction Audit Ledger
                  </span>

                  <div className="space-y-1">
                    {p.transactions && p.transactions.length > 0 ? (
                      p.transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-xs">
                          <div>
                            <span className="font-bold text-foreground">{tx.type}: </span>
                            <span className="text-muted-foreground">{tx.reason || 'Transaction'}</span>
                            <span className="text-[10px] text-muted-foreground block">{tx.createdAt}</span>
                          </div>
                          <span className={`font-mono font-bold ${tx.hoursDelta > 0 ? 'text-success' : 'text-danger'}`}>
                            {tx.hoursDelta > 0 ? `+${tx.hoursDelta}` : tx.hoursDelta} hrs
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[11px] text-muted-foreground italic">No transaction records logged.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* Manual Hour Adjustment Modal */}
      {selectedPurchase && (
        <ManualAdjustmentModal
          open={adjustmentModalOpen}
          onOpenChange={setAdjustmentModalOpen}
          studentPurchaseId={selectedPurchase.id}
          studentName={selectedPurchase.studentName}
          packageName={selectedPurchase.packageName}
          onSuccess={fetchPurchases}
        />
      )}
    </div>
  );
}
