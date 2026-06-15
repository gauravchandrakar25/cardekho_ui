'use client';

import React from 'react';
import { HelpCircle, Check } from 'lucide-react';

interface ReasoningSectionProps {
  reasoning: string[];
}

export default function ReasoningSection({ reasoning }: ReasoningSectionProps) {
  if (!reasoning || reasoning.length === 0) return null;

  return (
    <div className="bg-card-bg rounded-xl border border-card-border p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-md bg-zinc-900 border border-zinc-800 text-brand-blue">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">System Reasoning</h3>
          <p className="text-xs text-zinc-400 font-sans font-normal mt-0.5">Overall matching logic synthesized by our Candor AI advisor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reasoning.map((item, idx) => {
          // Normalize text by removing any leading tick marks if sent by LLM
          const cleanItem = item.replace(/^[✓\s*-]+/g, '').trim();

          return (
            <div 
              key={idx} 
              className="flex items-start gap-3 p-4 rounded-md border border-card-border bg-zinc-950/20 hover:border-brand-blue/50 hover:bg-zinc-900/50 hover:scale-[1.01] transition-all duration-200 ease-out"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 animate-scale-in border border-emerald-500/20">
                <Check className="w-3 h-3" strokeWidth={3} />
              </div>
              <span className="text-sm font-sans font-normal text-zinc-400 leading-relaxed">
                {cleanItem}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
