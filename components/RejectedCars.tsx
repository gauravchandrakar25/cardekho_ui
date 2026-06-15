'use client';

import React from 'react';
import { RejectedCar } from '../types';
import { Ban, X } from 'lucide-react';

interface RejectedCarsProps {
  rejected: RejectedCar[];
}

export default function RejectedCars({ rejected }: RejectedCarsProps) {
  if (!rejected || rejected.length === 0) return null;

  return (
    <div className="bg-card-bg rounded-xl border border-card-border p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-md bg-rose-500/10 text-rose-500 border border-rose-500/15">
          <Ban className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">Excluded Matches</h3>
          <p className="text-xs text-zinc-400 font-sans font-normal mt-0.5">Alternatives reviewed but excluded based on criteria mismatches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rejected.map((car, idx) => (
          <div 
            key={idx} 
            className="p-4 rounded-md border border-rose-500/15 bg-rose-500/5 dark:bg-rose-950/10 hover:bg-rose-500/10 dark:hover:bg-rose-950/20 hover:scale-[1.01] transition-all duration-200 ease-out flex items-start gap-3.5 relative overflow-hidden"
          >
            {/* Absolute indicator */}
            <div className="w-1.5 h-full bg-rose-500 absolute left-0 top-0" />
            
            <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 mt-0.5 border border-rose-500/20">
              <X className="w-3 h-3" strokeWidth={3} />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-100">{car.name}</h4>
              <p className="text-xs text-zinc-450 font-sans font-normal leading-relaxed mt-1 bg-zinc-950/40 p-2.5 rounded-md border border-card-border/60">
                <span className="font-mono text-rose-500 block text-[9px] uppercase tracking-wider mb-0.5">Reason for exclusion:</span>
                {car.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
