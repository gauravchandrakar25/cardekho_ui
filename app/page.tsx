'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CandorLogo from '../components/CandorLogo';
import SearchableSelect from '../components/SearchableSelect';
import AboutUsModal from '../components/AboutUsModal';
import SmartChatDrawer from '../components/SmartChatDrawer';
import { Car } from '../types';
import { getCarActualImage } from '../services/carImages';
import {
  Sparkles,
  ShieldCheck,
  FileText,
  ArrowRight,
  Lock,
  Gauge,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

export default function LandingPage() {
  const [selectedCarForKit, setSelectedCarForKit] = useState<string>('Tata Nexon');
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'}/api/cars`)
      .then(res => {
        if (res.data && res.data.data) {
          setAllCars(res.data.data);
        }
      })
      .catch(() => { });
  }, []);

  const matchedCar = allCars.find(c => `${c.brand} ${c.name}` === selectedCarForKit || c.name === selectedCarForKit);

  return (
    <div className="flex-1 flex flex-col">
      {/* Navbar with About Us button */}
      <Navbar onOpenChat={() => setIsChatOpen(true)} showAboutUsButton={true} />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 md:py-14 space-y-12">

        {/* Hero Narrative Section */}
        <div className="text-center max-w-3xl mx-auto py-4 space-y-4 narrative-glow">
          <div className="inline-flex items-center gap-1.5 bg-zinc-900 text-brand-blue text-xs font-mono px-4 py-2 rounded-md mb-2 uppercase tracking-widest border border-zinc-800">
            <Sparkles className="w-3.5 h-3.5" /> Candor Automotive Concierge
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-semibold tracking-tight text-zinc-100 leading-tight">
            Automotive Concierge <span className="text-brand-blue">Candor</span>
          </h1>

          <p className="text-sm md:text-base text-zinc-400 font-sans font-normal max-w-xl mx-auto leading-relaxed">
            Eliminate automotive confusion. Match your family's needs with top Indian cars, enforce 20/4/10 financial guardrails, and strip away dealership hidden fees.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/ai-car-matcher"
              className="btn-primary px-6 py-3 rounded-xl text-xs font-mono font-bold hover:scale-[1.01] active:scale-[0.99] shadow-md flex items-center gap-2"
            >
              <span>Launch AI Matchmaker</span>
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </Link>

            <button
              onClick={() => setIsAboutUsOpen(true)}
              className="btn-secondary px-5 py-3 rounded-xl text-xs font-mono font-medium hover:scale-[1.01] active:scale-[0.99]"
            >
              Learn What We Do
            </button>
          </div>
        </div>

        {/* Core Feature Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">

          {/* Card 1: AI Car Matchmaker */}
          <div className="bento-card p-6 md:p-8 flex flex-col justify-between group hover:border-brand-blue/40 transition-colors">
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold font-display tracking-tight text-zinc-100">
                  AI Car Matchmaker
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Curate your top 3 personalized Indian cars evaluated against your family size, mileage, safety, and budget priorities.
                </p>
              </div>

              <ul className="space-y-2 text-xs font-mono text-zinc-400 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Clinical Pros & Tradeoffs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>5-Star GNCAP Safety Scoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Rejected Alternatives Insights</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/ai-car-matcher"
                className="btn-primary w-full py-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 group-hover:scale-[1.01] transition-transform"
              >
                <span>Start Shortlisting</span>
                <ChevronRight className="w-4 h-4 text-zinc-950" />
              </Link>
            </div>
          </div>

          {/* Card 2: Candor Financial Shield */}
          <div className="bento-card p-6 md:p-8 flex flex-col justify-between group hover:border-brand-blue/40 transition-colors">
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold font-display tracking-tight text-zinc-100">
                  Financial Shield (20/4/10)
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Calculate your safe car budget using the gold-standard 20% down payment, 4-year loan tenure, and max 10% income EMI rule.
                </p>
              </div>

              <ul className="space-y-2 text-xs font-mono text-zinc-400 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Custom Down Payment Sliders</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Bank Loan Interest Comparison</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Real-time Cashflow Diagnosis</span>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <Link
                href="/financial-shield"
                className="btn-secondary w-full py-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 group-hover:scale-[1.01] transition-transform"
              >
                <span>Open Financial Shield</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Dealer Negotiation Kit */}
          <div className="bento-card p-6 md:p-8 flex flex-col justify-between group hover:border-brand-blue/40 transition-colors">
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold font-display tracking-tight text-zinc-100">
                  Dealer Negotiation Kit
                </h3>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Inspect itemized on-road price breakdowns, detect illegal dealer handling charges, and generate closing scripts.
                </p>
              </div>

              {/* Quick Car Selector Preview */}
              <div className="pt-1">
                <SearchableSelect
                  options={
                    allCars.length === 0
                      ? [{ value: 'Tata Nexon', label: 'Tata Nexon', sublabel: 'SUV • ₹7.99L - ₹15.60L' }]
                      : allCars.map((car) => {
                        const fullName = `${car.brand} ${car.name}`;
                        return {
                          value: fullName,
                          label: fullName,
                          sublabel: `${car.body_type} • ₹${car.price_min}L - ₹${car.price_max}L`,
                        };
                      })
                  }
                  value={selectedCarForKit}
                  onChange={(val) => setSelectedCarForKit(val)}
                  searchPlaceholder="Search car model..."
                />
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/negotiation-kit"
                className="btn-secondary w-full py-2.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-1.5 group-hover:scale-[1.01] transition-transform"
              >
                <span>Generate Negotiation Kit</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </main>

      {/* About Us Section ONLY on Main Landing Page Footer */}
      <footer className="bg-card-bg border-t border-card-border pt-12 pb-8 mt-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 space-y-10">

          {/* Main Footer Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

            {/* Column 1: About Us Summary */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <CandorLogo />
                <span className="bg-brand-blue/10 text-brand-blue text-[9px] font-mono px-2 py-0.5 rounded border border-brand-blue/20 uppercase font-bold">
                  Concierge Engine
                </span>
              </div>

              {/* Short About Us Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">About Candor</h4>
                  <span className="bg-amber-500/10 text-amber-500 text-[9px] font-mono px-2 py-0.5 rounded border border-amber-500/20 uppercase font-bold">
                    Beta Version v1.0
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                  Candor is an AI-powered automotive research & fintech intelligence platform built for Indian car buyers. We evaluate your budget using the industry-proven 20/4/10 rule, eliminate dealer hidden fees, and match you with your ideal car.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setIsAboutUsOpen(true)}
                  className="text-xs font-mono text-brand-blue hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                >
                  Learn more about what we do →
                </button>
              </div>
            </div>

            {/* Column 2: Platform Features */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">Feature Routes</h4>
              <ul className="space-y-2 text-xs text-zinc-400 font-sans">
                <li>
                  <Link href="/ai-car-matcher" className="hover:text-zinc-200 transition-colors">
                    • AI Car Matchmaker
                  </Link>
                </li>
                <li>
                  <Link href="/financial-shield" className="hover:text-zinc-200 transition-colors">
                    • Candor Financial Shield
                  </Link>
                </li>
                <li>
                  <Link href="/negotiation-kit" className="hover:text-zinc-200 transition-colors">
                    • Dealer Negotiation Kit
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Trust & Local Privacy */}
            <div className="md:col-span-4 space-y-3 bg-zinc-900/40 p-4.5 rounded-xl border border-zinc-800/80">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-blue" />
                <h4 className="text-xs font-mono font-bold text-zinc-100 uppercase tracking-wider">100% Local-First Privacy</h4>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                Your financial figures, monthly salary, and expense calculations are evaluated strictly inside your browser. No personal financial data is stored on remote servers or shared with car dealerships.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>System Status: Online & Encrypted</span>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="border-t border-card-border/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
            <p>© 2026 Candor Config Engine. Designed for Indian Car Buyers.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => setIsAboutUsOpen(true)} className="hover:text-zinc-300 transition-colors cursor-pointer">About Us</button>
              <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                Beta Version v1.0
              </span>
            </div>
          </div>

        </div>
      </footer>

      {/* About Us Modal */}
      {isAboutUsOpen && (
        <AboutUsModal onClose={() => setIsAboutUsOpen(false)} />
      )}

      {/* Smart Chat Drawer */}
      <SmartChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recommendedCars={[]}
        allCars={allCars}
      />
    </div>
  );
}
