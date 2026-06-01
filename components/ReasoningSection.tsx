'use client';

import React from 'react';
import { HelpCircle, Check } from 'lucide-react';

interface ReasoningSectionProps {
  reasoning: string[];
}

export default function ReasoningSection({ reasoning }: ReasoningSectionProps) {
  if (!reasoning || reasoning.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-brand-red-light text-brand-red">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-brand-dark">Why We Chose These Cars</h3>
          <p className="text-xs text-brand-gray mt-0.5">Overall matching logic synthesized by our CarDekho AI advisor</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reasoning.map((item, idx) => {
          // Normalize text by removing any leading tick marks if sent by LLM
          const cleanItem = item.replace(/^[✓\s*-]+/g, '').trim();

          return (
            <div 
              key={idx} 
              className="flex items-start gap-3 p-4 rounded-xl border border-brand-border hover:border-emerald-200 hover:bg-emerald-50/20 transition-all duration-200"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 animate-scale-in">
                <Check className="w-3 h-3" strokeWidth={3} />
              </div>
              <span className="text-sm font-medium text-brand-gray leading-relaxed">
                {cleanItem}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
