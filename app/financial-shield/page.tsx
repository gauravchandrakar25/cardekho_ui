'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import FinancialShield from '../../components/FinancialShield';
import SmartChatDrawer from '../../components/SmartChatDrawer';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function FinancialShieldPage() {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  return (
    <div className="flex-1 flex flex-col">
      <Navbar onOpenChat={() => setIsChatOpen(true)} showAboutUsButton={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 md:py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 bg-zinc-900 text-brand-blue text-xs font-mono px-3.5 py-1.5 rounded-md uppercase tracking-widest border border-zinc-800">
            <ShieldCheck className="w-3.5 h-3.5" /> Financial Health Guardrail Engine
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-zinc-100">
            Candor 20/4/10 Financial Shield
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-sans max-w-xl mx-auto">
            Evaluate your maximum safe car budget using the gold-standard 20/4/10 rule. Adjust down payments, bank interest rates, and loan tenures in real-time.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <FinancialShield onClose={() => {}} />
        </div>
      </main>

      {/* Standard Feature Page Minimal Footer */}
      <footer className="border-t border-card-border py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs font-mono text-zinc-500">
          <p>© 2026 Candor Config Engine.</p>
          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
            Beta Version v1.0
          </span>
        </div>
      </footer>

      <SmartChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recommendedCars={[]}
        allCars={[]}
      />
    </div>
  );
}
