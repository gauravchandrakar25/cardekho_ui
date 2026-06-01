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
    <div className="bg-white rounded-2xl border border-brand-border p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-rose-50 text-rose-500">
          <Ban className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-brand-dark">Cars We Considered But Rejected</h3>
          <p className="text-xs text-brand-gray mt-0.5">Alternatives reviewed but excluded based on criteria mismatches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rejected.map((car, idx) => (
          <div 
            key={idx} 
            className="p-4 rounded-xl border border-rose-100 bg-rose-50/10 hover:bg-rose-50/30 transition-all duration-200 flex items-start gap-3.5 relative overflow-hidden"
          >
            {/* Absolute indicator */}
            <div className="w-1.5 h-full bg-rose-400 absolute left-0 top-0" />
            
            <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shrink-0 mt-0.5">
              <X className="w-3 h-3" strokeWidth={3} />
            </div>

            <div>
              <h4 className="font-bold text-sm text-brand-dark">{car.name}</h4>
              <p className="text-xs text-brand-gray leading-relaxed mt-1 font-medium bg-white/70 p-2 rounded border border-rose-100/50">
                <span className="font-bold text-rose-600 block text-[10px] uppercase tracking-wider mb-0.5">Reason for exclusion:</span>
                {car.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
