'use client';

import React from 'react';
import { RecommendedCar } from '../types';
import { ShieldAlert, User, Heart } from 'lucide-react';
import { getCarActualImage, getCarRawUrl } from '../services/carImages';

interface RecommendationCardProps {
  car: RecommendedCar;
  rank: number;
  affordabilityStatus?: 'Safe' | 'Stretching' | 'Unsafe';
  onGenerateKit: (carName: string) => void;
  onShowFinancialShield?: (carName: string) => void;
  bodyType?: string;
  dbImage?: string | null;
}

export default function RecommendationCard({ 
  car, 
  rank, 
  affordabilityStatus, 
  onGenerateKit, 
  onShowFinancialShield,
  bodyType,
  dbImage
}: RecommendationCardProps) {
  const score = car.score;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColors = (val: number) => {
    if (val >= 90) return { text: 'text-emerald-500', stroke: 'stroke-emerald-500', bg: 'bg-emerald-500/10' };
    if (val >= 80) return { text: 'text-amber-500', stroke: 'stroke-amber-500', bg: 'bg-amber-500/10' };
    return { text: 'text-rose-500', stroke: 'stroke-rose-500', bg: 'bg-rose-500/10' };
  };

  const colors = getScoreColors(score);

  return (
    <div className="bento-card p-6 md:p-8 relative overflow-hidden animate-scale-in">
      {/* Rank Badge */}
      <div className="absolute top-0 left-0 bg-brand-blue text-zinc-950 text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-br-md">
        Match #{rank}
      </div>

      {/* Card Header: Name and Score */}
      <div className="flex items-start justify-between mt-4 mb-5">
        <div>
          <h3 className="text-xl md:text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">{car.name}</h3>
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            <span className="inline-block text-[10px] font-sans font-bold text-zinc-400 bg-zinc-900 px-2.5 py-0.5 rounded-md border border-zinc-800">
              Recommendation
            </span>
            {affordabilityStatus && (
              <button
                onClick={() => onShowFinancialShield?.(car.name)}
                className={`inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border cursor-pointer hover:opacity-90 transition-all ${
                  affordabilityStatus === 'Safe' 
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                    : affordabilityStatus === 'Stretching'
                      ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                }`}
              >
                💰 {affordabilityStatus}
              </button>
            )}
          </div>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center shrink-0 w-16 h-16 ml-3">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r={radius}
              className="stroke-zinc-100 dark:stroke-zinc-800 fill-transparent"
              strokeWidth="5"
            />
            <circle
              cx="32"
              cy="32"
              r={radius}
              className={`${colors.stroke} fill-transparent transition-all duration-1000 ease-out`}
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-sm font-mono font-bold ${colors.text}`}>{score}%</span>
            <span className="text-[7px] font-sans font-bold text-zinc-500 uppercase tracking-wider">Match</span>
          </div>
        </div>
      </div>

      {/* Car Image Trim Visualizer */}
      <div className="my-4 relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950/60 aspect-[16/9] flex items-center justify-center group shadow-inner">
        <img 
          src={getCarActualImage(car.name, dbImage)} 
          alt={car.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.dataset.triedRaw) {
              target.dataset.triedRaw = 'true';
              target.src = getCarRawUrl(car.name, dbImage);
            } else if (!target.dataset.triedFallback) {
              target.dataset.triedFallback = 'true';
              switch (bodyType?.toLowerCase()) {
                case 'sedan': target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'; break;
                case 'hatchback': target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'; break;
                case 'mpv': target.src = 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80'; break;
                default: target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80';
              }
            } else {
              target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2318181b"/><text x="50" y="55" fill="%23a1a1aa" font-family="monospace" font-size="8" text-anchor="middle" letter-spacing="1">PREVIEW BLOCKED</text></svg>';
            }
          }}
        />
        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[9px] font-mono text-zinc-400 rounded-md border border-zinc-800 uppercase tracking-widest">
          {bodyType || 'SUV'} Showroom
        </div>
      </div>

      {/* Recommendation Details */}
      <div className="space-y-4 pt-2">
        {/* Why it fits */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5 border border-emerald-500/10">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[10px] font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-0.5">Why It Fits</h4>
            <p className="text-xs text-zinc-400 font-sans font-normal leading-relaxed">{car.whyFit}</p>
          </div>
        </div>

        {/* Tradeoffs */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-amber-500/10 text-amber-500 shrink-0 mt-0.5 border border-amber-500/10">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[10px] font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-0.5">Key Trade-offs</h4>
            <p className="text-xs text-amber-500 leading-relaxed font-sans font-normal bg-zinc-950/40 p-2.5 rounded-md border border-zinc-800">
              {car.tradeOffs}
            </p>
          </div>
        </div>

        {/* Ideal Buyer */}
        <div className="flex items-start gap-3 border-t border-card-border/60 pt-4 mt-2">
          <div className="p-2 rounded-md bg-zinc-900 text-brand-blue shrink-0 mt-0.5 border border-zinc-800">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-[10px] font-mono font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-0.5">Ideal Owner Profile</h4>
            <p className="text-xs text-zinc-400 font-sans font-normal leading-relaxed italic">
              {`"${car.idealBuyer}"`}
            </p>
          </div>
        </div>

        {/* Negotiation Kit Action */}
        <div className="border-t border-card-border/60 pt-4 mt-4">
          <button
            onClick={() => onGenerateKit(car.name)}
            className="btn-primary w-full text-xs py-2.5 rounded-md hover:scale-[1.01] active:scale-[0.99] font-bold"
          >
            Generate Negotiation Kit
          </button>
        </div>
      </div>
    </div>
  );
}
