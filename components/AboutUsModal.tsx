'use client';

import React from 'react';
import { X, ShieldCheck, Sparkles, Heart, FileText, Lock, Car } from 'lucide-react';
import CandorLogo from './CandorLogo';

interface AboutUsModalProps {
  onClose: () => void;
}

export default function AboutUsModal({ onClose }: AboutUsModalProps) {
  return (
    <div className="fixed inset-0 z-100 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card-bg text-fg-main rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-scale-in border border-card-border p-6 md:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-card-border pb-4">
          <div className="flex items-center gap-3">
            <CandorLogo />
            <span className="bg-brand-blue/10 text-brand-blue text-[10px] font-mono px-2 py-0.5 rounded border border-brand-blue/20 uppercase font-bold">
              About Platform
            </span>
            <span className="bg-amber-500/10 text-amber-500 text-[10px] font-mono px-2.5 py-0.5 rounded border border-amber-500/20 uppercase font-bold tracking-wider">
              Beta Version 1.0
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn-secondary text-xs px-3.5 py-2 rounded-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Banner inside modal */}
        <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-brand-blue text-[10px] font-mono uppercase tracking-widest bg-brand-blue/10 px-2.5 py-1 rounded">
              <Sparkles className="w-3.5 h-3.5" /> What We Do
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-semibold">
              ⚡ Beta Release
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-semibold text-zinc-100 tracking-tight">
            Simplifying Car Buying for Indian Families with AI & Financial Guardrails
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 font-sans leading-relaxed">
            Candor is a next-generation automotive concierge engine built to take the guesswork, financial stress, and hidden dealer fees out of buying a car in India.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 w-fit">
              <Car className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-display font-semibold text-zinc-100">1. Precision AI Matchmaking</h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              We evaluate your family size, budget, mileage needs, and top priorities to recommend the top 3 best-fitting Indian cars with clinical pros and tradeoffs.
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-2">
            <div className="p-2 rounded-lg bg-brand-blue/10 text-brand-blue w-fit">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-display font-semibold text-zinc-100">2. Financial Shield (20/4/10 Rule)</h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Safeguard your cashflow using the 20/4/10 benchmark: 20% down payment, 4-year max loan tenure, and max 10% income towards monthly EMI.
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 w-fit">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-display font-semibold text-zinc-100">3. Negotiation & Fee Shield</h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Expose hidden dealership charges like mandatory handling fees or overpriced accessory kits, and generate phase-by-phase negotiation scripts.
            </p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 w-fit">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-display font-semibold text-zinc-100">4. 100% Local-First Privacy</h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Your financial figures, salary data, and budget calculations are processed strictly inside your browser. Your data is never sold or tracked.
            </p>
          </div>

        </div>

        {/* Footer close button */}
        <div className="pt-2 flex justify-end border-t border-card-border">
          <button
            onClick={onClose}
            className="btn-primary text-xs px-5 py-2.5 rounded-md font-bold hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}
