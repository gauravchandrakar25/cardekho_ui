'use client';

import React from 'react';
import { RecommendedCar } from '../types';
import { ShieldAlert, User, Heart } from 'lucide-react';

interface RecommendationCardProps {
  car: RecommendedCar;
  rank: number;
}

export default function RecommendationCard({ car, rank }: RecommendationCardProps) {
  // Compute circular progress stroke parameters
  const score = car.score;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine score color based on percentage
  const getScoreColors = (val: number) => {
    if (val >= 90) return { text: 'text-emerald-600', stroke: 'stroke-emerald-500', bg: 'bg-emerald-50' };
    if (val >= 80) return { text: 'text-amber-600', stroke: 'stroke-amber-500', bg: 'bg-amber-50' };
    return { text: 'text-blue-600', stroke: 'stroke-blue-500', bg: 'bg-blue-50' };
  };

  const colors = getScoreColors(score);

  return (
    <div className="cd-hover-card bg-white rounded-2xl border border-brand-border p-6 shadow-sm relative overflow-hidden animate-scale-in">
      {/* Rank Badge */}
      <div className="absolute top-0 left-0 bg-brand-red text-white text-xs font-extrabold uppercase px-3 py-1.5 rounded-br-xl tracking-wider">
        Match #{rank}
      </div>

      {/* Card Header: Name and Score */}
      <div className="flex items-start justify-between mt-4 mb-5">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-brand-dark">{car.name}</h3>
          <span className="inline-block text-xs font-semibold text-brand-gray bg-brand-bg px-2.5 py-1 rounded-full mt-1">
            Top Recommendation
          </span>
        </div>

        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center shrink-0 w-16 h-16 ml-3">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="32"
              cy="32"
              r={radius}
              className="stroke-gray-100 fill-transparent"
              strokeWidth="5"
            />
            {/* Animated Match Line */}
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
          {/* Central Percent Text */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-sm font-extrabold ${colors.text}`}>{score}%</span>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Match</span>
          </div>
        </div>
      </div>

      {/* Recommendation Details */}
      <div className="space-y-4 pt-2">
        {/* Why it fits */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">Why It Fits</h4>
            <p className="text-sm text-brand-gray leading-relaxed">{car.whyFit}</p>
          </div>
        </div>

        {/* Tradeoffs (Critical for explainability & trust) */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0 mt-0.5">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">Key Trade-offs</h4>
            <p className="text-sm text-amber-800 leading-relaxed font-medium bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
              {car.tradeOffs}
            </p>
          </div>
        </div>

        {/* Ideal Buyer */}
        <div className="flex items-start gap-3 border-t border-brand-border pt-4 mt-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0 mt-0.5">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wider mb-1">Ideal Owner Profile</h4>
            <p className="text-sm text-brand-gray leading-relaxed italic">
              {`"${car.idealBuyer}"`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
