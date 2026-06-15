'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NegotiationKit } from '../types/financial';
import { 
  Sparkles, 
  AlertCircle, 
  CheckSquare, 
  Square, 
  HelpCircle, 
  MessageSquare, 
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle2,
  RefreshCw,
  IndianRupee,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface NegotiationKitModalProps {
  carName: string;
  onClose: () => void;
  initialVariant?: string;
}

export default function NegotiationKitModal({ carName, onClose, initialVariant = 'Base' }: NegotiationKitModalProps) {
  const [variant, setVariant] = useState<string>(initialVariant);
  const [kit, setKit] = useState<NegotiationKit | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [checkedFees, setCheckedFees] = useState<Record<number, boolean>>({});
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'invoice' | 'traps' | 'scripts'>('invoice');

  // UX Upgrade states
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const [usedPhases, setUsedPhases] = useState<number[]>([]);
  const [showWarRoom, setShowWarRoom] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  useEffect(() => {
    async function fetchKit() {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<{ success: boolean; data: NegotiationKit }>(
          `${API_BASE_URL}/negotiation-kit`,
          {
            params: {
              carName,
              variant
            }
          }
        );
        if (response.data && response.data.success) {
          setKit(response.data.data);
          setCheckedFees({});
          setUsedPhases([]);
          setShowWarRoom(false);
        } else {
          setError('Failed to fetch negotiation kit for this car.');
        }
      } catch (err: any) {
        console.error('Error fetching negotiation kit:', err);
        setError(err.response?.data?.error || 'Unable to connect to the backend server. Please verify the backend is running.');
      } finally {
        setLoading(false);
      }
    }
    fetchKit();
  }, [carName, variant]);

  const toggleFee = (idx: number) => {
    setCheckedFees(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleUsedPhase = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setUsedPhases(prev => {
      if (prev.includes(idx)) {
        return prev.filter(i => i !== idx);
      } else {
        return [...prev, idx];
      }
    });
  };

  // Severity helper
  const getSeverity = (amount: number) => {
    if (amount >= 5000) {
      return {
        label: 'High',
        range: '₹5,000–25,000',
        color: 'text-rose-500 border-rose-500/20 bg-rose-500/10',
        dot: '🔴',
        midpoint: 15000
      };
    } else if (amount >= 1000) {
      return {
        label: 'Medium',
        range: '₹1,000–5,000',
        color: 'text-amber-500 border-amber-500/20 bg-amber-500/10',
        dot: '🟡',
        midpoint: 3000
      };
    } else {
      return {
        label: 'Low',
        range: 'under ₹1,000',
        color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
        dot: '🟢',
        midpoint: 500
      };
    }
  };

  const calculateTotalSavings = (): number => {
    if (!kit || !kit.hiddenFeesChecklist) return 0;
    return kit.hiddenFeesChecklist.reduce((acc, fee, idx) => {
      if (checkedFees[idx]) {
        const severity = getSeverity(fee.amount);
        return acc + severity.midpoint;
      }
      return acc;
    }, 0);
  };

  const totalSavings = calculateTotalSavings();
  const pricing = kit?.pricing || { exShowroom: 0, rtoRegistration: 0, insurance: 0, tcs: 0, fastag: 0, essentialKit: 0, handlingCharges: 0, extendedWarranty: 0, onRoadPrice: 0 };
  
  const currentActiveLiveIndex = kit ? kit.negotiationScript.phases.findIndex((_, idx) => !usedPhases.includes(idx)) : -1;

  const handleShareWarRoom = () => {
    const targetPrice = (pricing.onRoadPrice - totalSavings / 100000).toFixed(2);
    const shareText = `Candor War Room Mission Briefing:\n` +
      `• Vehicle: ${carName} (${variant} Variant)\n` +
      `• Target On-Road Price: ₹${targetPrice} Lakhs\n` +
      `• Waived Markups Midpoint Savings: ₹${totalSavings.toLocaleString('en-IN')}\n` +
      `• BATNA Alternative: ${variant === 'Top' ? 'Mid Variant' : variant === 'Mid' ? 'Base Variant' : 'Segment Alternative'}\n` +
      `Prepare your dealer negotiation today!`;
    
    navigator.clipboard.writeText(shareText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-100 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card-bg text-fg-main rounded-xl w-full max-w-5xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-card-border animate-scale-in">
        
        {/* Modal Header Banner */}
        <div className="bg-zinc-950 border-b border-card-border px-6 py-5 flex items-center justify-between shrink-0 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-zinc-900 border border-zinc-800 text-brand-blue">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-zinc-100 tracking-tight">{carName}</h2>
              <p className="text-xs text-zinc-400 font-sans font-normal">
                Out-the-Door Price Strategy & Tactics
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* I'm at the dealership LIVE Toggle */}
            {!loading && kit && !showWarRoom && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[11px] font-mono font-bold tracking-tight text-zinc-450 flex items-center gap-1.5">
                  I'M AT THE DEALERSHIP <span className="text-rose-500 animate-pulse">🔴 LIVE</span>
                </span>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={isLiveMode} 
                    onChange={() => setIsLiveMode(!isLiveMode)}
                    className="sr-only" 
                  />
                  <div className={`w-8 h-4.5 bg-zinc-800 rounded-full transition-colors ${isLiveMode ? 'bg-emerald-500' : ''}`} />
                  <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-zinc-100 rounded-full transition-transform ${isLiveMode ? 'transform translate-x-3.5' : ''}`} />
                </div>
              </label>
            )}

            <button 
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-100 font-bold text-xs px-3.5 py-2 rounded-md border border-zinc-800 bg-zinc-900 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        {loading ? (
          <div className="flex-1 py-16 flex flex-col items-center justify-center gap-4 bg-zinc-950">
            <RefreshCw className="w-10 h-10 text-brand-blue animate-spin" />
            <span className="text-sm font-bold text-zinc-100">Generating Negotiation Kit...</span>
            <p className="text-xs text-zinc-400 font-sans font-normal">Running local variant models & compiling script...</p>
          </div>
        ) : error ? (
          <div className="flex-1 py-16 px-6 flex flex-col items-center justify-center gap-4 bg-zinc-950 text-center">
            <div className="p-3 bg-rose-500/10 rounded-md text-rose-500 border border-rose-500/20">
              <AlertCircle className="w-8 h-8" />
            </div>
            <span className="text-base font-bold text-rose-500">Failed to load Negotiation Kit</span>
            <p className="text-xs text-zinc-400 max-w-md font-sans font-normal">{error}</p>
            <button 
              onClick={onClose} 
              className="mt-2 btn-primary text-xs px-5 py-2.5 rounded-md shadow cursor-pointer"
            >
              Go Back
            </button>
          </div>
        ) : kit ? (
          showWarRoom ? (
            /* WAR ROOM SUMMARY Briefing Page */
            <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950">
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                
                {/* Mission Briefing Header */}
                <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-widest block">MISSION BRIEFING: CONFIDENTIAL</span>
                  <h3 className="text-2xl font-display font-semibold text-zinc-100 tracking-tight">Dealership War Room Summary</h3>
                  <p className="text-xs text-zinc-400 font-sans">Tactical purchase parameters finalized for {carName} ({variant} Variant).</p>
                </div>

                {/* Large On-Road Price Block */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block">Confirmed Target On-Road Price</span>
                    <div className="text-4xl md:text-5xl font-mono font-bold text-emerald-500 tracking-tight">
                      ₹{(pricing.onRoadPrice - totalSavings / 100000).toFixed(2)} Lakhs
                    </div>
                    <span className="text-xs text-zinc-400 font-sans block mt-1">
                      Original Invoice: ₹{pricing.onRoadPrice.toFixed(2)}L • Midpoint savings unlocked: ₹{totalSavings.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={handleShareWarRoom}
                    className="w-full md:w-auto shrink-0 bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-sans font-bold text-xs px-5 py-3 rounded-md hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    {copiedSummary ? 'Copied ✓' : 'Share War Room'}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Levers List */}
                  <div className="bg-zinc-900/40 border border-zinc-800/85 rounded-xl p-5 md:p-6 space-y-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-505 block">Top 3 Negotiation Levers</span>
                    <div className="space-y-4 text-xs">
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">1</div>
                        <p className="text-zinc-350 leading-relaxed">
                          <strong className="text-zinc-100 font-bold block text-sm mb-0.5">Challenge Dealer Insurance Markup</strong>
                          Present independent online quotes of equivalent coverage to force premium matching or outside purchase waiver.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">2</div>
                        <p className="text-zinc-350 leading-relaxed">
                          <strong className="text-zinc-100 font-bold block text-sm mb-0.5">Demand Waiver of Logistics Fees</strong>
                          Identify illegal handling/logistics charges and demand dealer waiver citing state RTO directives.
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">3</div>
                        <p className="text-zinc-350 leading-relaxed">
                          <strong className="text-zinc-100 font-bold block text-sm mb-0.5">Audit Accessory Kit Bundle</strong>
                          Opt out of inflated mandatory accessory packages and buy selective items à la carte or aftermarket.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* BATNA Box */}
                  <div className="bg-zinc-900/40 border border-zinc-800/85 rounded-xl p-5 md:p-6 space-y-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-505 block">BATNA (Next-Best Alternative)</span>
                    <div className="bg-zinc-950/80 border border-zinc-850 p-4.5 rounded-md space-y-3">
                      <span className="font-sans font-bold text-zinc-100 block text-sm">
                        {variant === 'Top' ? 'Downgrade to Mid Variant' : variant === 'Mid' ? 'Downgrade to Base Variant' : 'Segment Alternatives'}
                      </span>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {variant === 'Top' && `If negotiations fail, consider down-spec'ing to the Mid Variant. You will save ~₹${(pricing.exShowroom * 0.18).toFixed(2)} Lakhs instantly on base pricing while retaining 85% of tech features.`}
                        {variant === 'Mid' && `If negotiations fail, consider down-spec'ing to the Base Variant. You will save ~₹${(pricing.exShowroom * 0.25).toFixed(2)} Lakhs instantly on base pricing for core mechanics.`}
                        {variant === 'Base' && 'If the base variant exceeds budget constraints, explore certified pre-owned options or segment competitor variants to preserve monthly cashflow integrity.'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* War Room Footer */}
              <div className="bg-card-bg border-t border-card-border px-6 py-5 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setShowWarRoom(false)}
                  className="btn-secondary text-xs px-4 py-2.5 rounded-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  ◀ Back to Checklist
                </button>
                <button
                  onClick={onClose}
                  className="btn-primary text-xs px-5 py-2.5 rounded-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  Close Kit ✓
                </button>
              </div>

            </div>
          ) : isLiveMode ? (
            /* LIVE DEALERSHIP MODE VIEW */
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Title Banner */}
              <div className="bg-rose-500/10 border-b border-rose-500/15 px-6 py-3 shrink-0 flex items-center justify-between text-xs">
                <span className="text-rose-500 font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                  🔴 Live Dealership Mode Active
                </span>
                <span className="text-zinc-500 font-sans">Tab system and invoice table collapsed</span>
              </div>

              {/* Scrollable Script list */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-950/30">
                <div className="bg-zinc-900 border border-zinc-800 rounded-md p-4 text-xs font-sans text-zinc-350 leading-relaxed max-w-3xl mx-auto shadow-sm">
                  <span className="font-mono text-emerald-500 font-bold uppercase tracking-widest block mb-1 text-[10px]">Active Strategy:</span>
                  {kit.negotiationScript.strategy}
                </div>

                <div className="max-w-3xl mx-auto space-y-5">
                  {kit.negotiationScript.phases.map((phase, idx) => {
                    const isUsed = usedPhases.includes(idx);
                    const isActive = idx === currentActiveLiveIndex;
                    
                    return (
                      <div
                        key={idx}
                        className={`p-5 md:p-6 rounded-xl border transition-all duration-300 relative ${
                          isUsed 
                            ? 'border-zinc-800 bg-zinc-900/20 grayscale opacity-45' 
                            : isActive
                              ? 'border-emerald-500 bg-emerald-950/15 shadow-[0_0_15px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/30'
                              : 'border-zinc-800 bg-zinc-900/60'
                        }`}
                      >
                        {/* Active green pulse light indicator */}
                        {isActive && (
                          <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
                        )}

                        <div className="flex justify-between items-start gap-4 mb-4 border-b border-zinc-800 pb-3">
                          <div>
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isActive ? 'text-emerald-500' : 'text-zinc-500'}`}>
                              Phase {idx + 1}
                            </span>
                            <h4 className="font-display font-semibold text-zinc-100 text-sm md:text-base">{phase.phaseName}</h4>
                          </div>

                          {/* Mark as Used Button */}
                          <button
                            type="button"
                            onClick={(e) => toggleUsedPhase(idx, e)}
                            className={`text-xs font-sans font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1 border hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                              isUsed
                                ? 'bg-zinc-800/80 border-zinc-750 text-zinc-400 hover:text-zinc-200'
                                : 'bg-emerald-500 border-emerald-500 text-zinc-950 hover:bg-emerald-400'
                            }`}
                          >
                            {isUsed ? 'Used ✓' : 'Mark as Used ✓'}
                          </button>
                        </div>

                        {/* Rep line */}
                        <div className="mb-4 bg-zinc-950/40 p-3 rounded-md border border-zinc-850 max-w-2xl text-xs text-zinc-400 leading-relaxed font-sans">
                          <span className="font-mono text-zinc-500 block text-[9px] uppercase tracking-wider mb-1 font-bold">Dealer says:</span>
                          "{phase.dealerOpening}"
                        </div>

                        {/* Your line */}
                        <div className="bg-zinc-950/80 p-4.5 rounded-md border border-zinc-850 border-l-2 border-emerald-500 pl-4 italic text-zinc-100 max-w-2xl ml-auto">
                          <span className="font-mono text-emerald-450 block text-[9px] uppercase tracking-wider mb-1.5 not-italic font-bold">Your counter:</span>
                          <p className="text-lg font-semibold leading-relaxed not-italic text-zinc-100">
                            "{phase.yourResponse}"
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LIVE Mode Footer */}
              <div className="bg-card-bg border-t border-card-border px-6 py-5 flex items-center justify-between shrink-0">
                <span className="text-zinc-500 text-[11px] font-sans">Dealership LIVE Mode • Prepared by Candor</span>
                <button
                  onClick={() => setShowWarRoom(true)}
                  className="btn-primary text-xs px-5 py-2.5 rounded-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  Finished Checklist
                </button>
              </div>

            </div>
          ) : (
            /* REGULAR TABBED VIEW */
            <div className="flex flex-col flex-1 overflow-hidden">
              
              {/* Tabs Selector Navigation */}
              <div className="flex border-b border-card-border bg-zinc-950 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('invoice')}
                  className={`flex-1 py-3.5 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'invoice'
                      ? 'border-brand-blue text-zinc-100 bg-zinc-900/30'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Invoice Breakdown
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('traps')}
                  className={`flex-1 py-3.5 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'traps'
                      ? 'border-brand-blue text-zinc-100 bg-zinc-900/30'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Dealer Traps ({kit.hiddenFeesChecklist.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('scripts')}
                  className={`flex-1 py-3.5 text-xs font-mono font-bold border-b-2 transition-all cursor-pointer ${
                    activeTab === 'scripts'
                      ? 'border-brand-blue text-zinc-100 bg-zinc-900/30'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Response Scripts
                </button>
              </div>

              {/* Scrollable Tab Content Container */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-zinc-950/20">
                
                {/* TAB 1: INVOICE BREAKDOWN */}
                {activeTab === 'invoice' && (
                  <div className="space-y-6">
                    {/* Select Variant Control Row */}
                    <div className="bg-card-bg p-5 rounded-xl border border-card-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-400 block">Configure Car Variant</span>
                        <span className="text-xs text-zinc-500 font-sans block">Dynamic Ex-Showroom pricing based on engine trim packages.</span>
                      </div>
                      
                      <div className="w-full sm:w-72">
                        <div className="bg-zinc-900 border border-zinc-800 focus-within:border-brand-blue rounded-md p-1 transition-colors">
                          <select
                            value={variant}
                            onChange={(e) => setVariant(e.target.value)}
                            className="w-full p-2.5 text-xs font-mono bg-transparent text-zinc-100 focus:outline-none border-none outline-none cursor-pointer"
                          >
                            <option value="Base" className="bg-zinc-900 text-zinc-100">Base Variant (Standard MT)</option>
                            <option value="Mid" className="bg-zinc-900 text-zinc-100">Mid Variant (Feature Pack AMT)</option>
                            <option value="Top" className="bg-zinc-900 text-zinc-100">Top Variant (Luxury ADAS/DCT/EV)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Pricing Table */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-zinc-100 font-mono flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-brand-blue" /> Ex-Showroom vs On-Road Price Matrix
                      </h3>
                      
                      <div className="bg-card-bg rounded-xl border border-card-border overflow-hidden shadow-sm">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-zinc-900/50 border-b border-card-border text-[10px] font-bold text-zinc-400 font-mono">
                              <th className="text-left p-4 pl-5 uppercase">Fee Item</th>
                              <th className="text-right p-4 pr-5 uppercase">On-Road Cost</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-card-border/60">
                            <tr className="bg-zinc-900/30">
                              <td className="p-4 pl-5 text-zinc-100 font-sans font-semibold">Ex-Showroom Base Price</td>
                              <td className="p-4 pr-5 text-right text-zinc-100 font-mono font-bold">₹{pricing.exShowroom.toFixed(2)}L</td>
                            </tr>
                            <tr>
                              <td className="p-4 pl-5 text-zinc-400 font-sans">RTO Registration & Tax</td>
                              <td className="p-4 pr-5 text-right text-zinc-100 font-mono">₹{pricing.rtoRegistration.toFixed(2)}L</td>
                            </tr>
                            <tr className="bg-zinc-900/30">
                              <td className="p-4 pl-5 text-zinc-400 font-sans">Motor Insurance Premium</td>
                              <td className="p-4 pr-5 text-right text-zinc-100 font-mono">₹{pricing.insurance.toFixed(2)}L</td>
                            </tr>
                            {pricing.tcs > 0 && (
                              <tr>
                                <td className="p-4 pl-5 text-zinc-400 font-sans">TCS Tax (1% &gt; ₹10L)</td>
                                <td className="p-4 pr-5 text-right text-zinc-100 font-mono">₹{pricing.tcs.toFixed(2)}L</td>
                              </tr>
                            )}
                            <tr className="bg-zinc-900/30">
                              <td className="p-4 pl-5 text-zinc-400 font-sans">Fastag Fee</td>
                              <td className="p-4 pr-5 text-right text-zinc-100 font-mono">₹{pricing.fastag.toFixed(3)}L</td>
                            </tr>
                            <tr className="bg-amber-500/5 text-amber-500">
                              <td className="p-4 pl-5 font-sans flex items-center gap-1">
                                Essential Accessory Kit <span className="text-[9px] bg-amber-500/10 text-amber-500 font-bold px-1.5 py-0.5 rounded-md">Optional</span>
                              </td>
                              <td className="p-4 pr-5 text-right text-amber-500 font-mono">₹{pricing.essentialKit.toFixed(2)}L</td>
                            </tr>
                            <tr className="bg-rose-500/5 text-rose-500 bg-zinc-900/30">
                              <td className="p-4 pl-5 font-sans flex items-center gap-1">
                                Logistics & Handling Charges <span className="text-[9px] bg-rose-500/10 text-rose-500 font-bold px-1.5 py-0.5 rounded-md">Illegal</span>
                              </td>
                              <td className="p-4 pr-5 text-right text-rose-500 font-mono">₹{pricing.handlingCharges.toFixed(2)}L</td>
                            </tr>
                            <tr>
                              <td className="p-4 pl-5 text-zinc-400 font-sans">Extended Warranty Premium</td>
                              <td className="p-4 pr-5 text-right text-zinc-100 font-mono">₹{pricing.extendedWarranty.toFixed(2)}L</td>
                            </tr>
                            <tr className="bg-brand-blue/10 font-bold border-t border-brand-blue/30 text-sm">
                              <td className="p-4.5 pl-5 text-zinc-100">Total Out-the-Door Price</td>
                              <td className="p-4.5 pr-5 text-right text-brand-blue font-mono text-base">₹{pricing.onRoadPrice.toFixed(2)} Lakhs</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-4 flex items-start gap-2.5 text-xs">
                        <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-amber-500 font-sans font-normal leading-relaxed">
                          <strong>Markup Warning:</strong> Dealerships bundle high commission policies in the invoice. Request to buy insurance outside (saves ₹15K-30K) and demand the waiver of logistics/handling charges.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: DEALER TRAPS (HIDDEN FEES CHECKLIST) */}
                {activeTab === 'traps' && (
                  <div className="space-y-6">
                    {/* Savings Counter Banner */}
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-emerald-500 text-zinc-950 shrink-0 shadow-sm">
                          <TrendingDown className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider block font-mono">Real-time Negotiation Savings Calculator</span>
                          <span className="text-xs text-zinc-400 font-sans font-normal block">Select markups to object to. Increments by category midpoint savings:</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-2xl font-mono font-bold text-emerald-500 block flex items-center justify-end">
                          <IndianRupee className="w-5 h-5 mr-0.5" /> {totalSavings.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider font-mono">Savings Unlocked</span>
                      </div>
                    </div>

                    {/* Checklist items */}
                    <div className="space-y-4">
                      {kit.hiddenFeesChecklist.map((fee, idx) => {
                        const isChecked = checkedFees[idx] || false;
                        const severity = getSeverity(fee.amount);
                        
                        return (
                          <div 
                            key={idx}
                            onClick={() => toggleFee(idx)}
                            className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-[1.01] ${
                              isChecked 
                                ? 'border-emerald-500 bg-emerald-500/10 shadow-sm' 
                                : 'border-zinc-800 hover:border-brand-blue/50 bg-zinc-900 text-zinc-100'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5 shrink-0">
                                  {isChecked ? (
                                    <CheckSquare className="w-5 h-5 text-emerald-500" />
                                  ) : (
                                    <Square className="w-5 h-5 text-zinc-500" />
                                  )}
                                </div>
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="font-sans font-bold text-zinc-150 text-sm">{fee.name}</h4>
                                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                      fee.status === 'Waivable' || fee.status === 'Negotiable'
                                        ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                    }`}>
                                      {fee.status}
                                    </span>
                                  </div>
                                  <p className="text-xs text-zinc-400 font-sans mt-1 leading-relaxed">{fee.description}</p>
                                </div>
                              </div>
                              
                              <div className="text-right shrink-0 ml-3 flex flex-col items-end gap-1.5">
                                <div>
                                  <span className={`text-base font-mono font-bold ${isChecked ? 'text-emerald-500' : 'text-zinc-100'}`}>
                                    ₹{fee.amount.toLocaleString('en-IN')}
                                  </span>
                                  <span className="block text-[8px] text-zinc-500 font-sans font-bold uppercase tracking-wider">Markup</span>
                                </div>
                                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${severity.color}`}>
                                  {severity.dot} {severity.label} ({severity.range})
                                </span>
                              </div>
                            </div>

                            {/* Tactic text */}
                            <div className="mt-3 pt-3 border-t border-zinc-800 text-xs bg-zinc-950/40 p-3.5 rounded-md border border-zinc-800">
                              <span className="font-mono text-brand-blue block text-[9px] uppercase tracking-wider mb-0.5">Concierge Negotiation Tactic (Midpoint Savings: ₹{severity.midpoint.toLocaleString('en-IN')}):</span>
                              <span className="text-zinc-400 font-sans font-normal leading-relaxed block">{fee.tactic}</span>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 3: RESPONSE SCRIPTS */}
                {activeTab === 'scripts' && (
                  <div className="space-y-6">
                    {/* Strategy Card */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-md p-4 text-xs font-sans font-normal text-zinc-300 leading-relaxed">
                      <span className="font-mono text-brand-blue uppercase tracking-widest block mb-1 text-[10px]">Global Strategy:</span>
                      {kit.negotiationScript.strategy}
                    </div>

                    {/* Script Phases Selector tabs */}
                    <div className="flex flex-wrap gap-1.5 border-b border-zinc-800 pb-2 overflow-x-auto">
                      {kit.negotiationScript.phases.map((phase, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActivePhaseIndex(idx)}
                          className={`px-3.5 py-2 rounded-md text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                            activePhaseIndex === idx
                              ? 'bg-brand-blue text-zinc-950 shadow-sm'
                              : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                          }`}
                        >
                          Phase {idx + 1}: {phase.phaseName}
                        </button>
                      ))}
                    </div>

                    {/* Chat bubbles preview */}
                    <div className="space-y-4 py-2 bg-zinc-950/40 rounded-xl p-4 border border-zinc-800">
                      
                      {/* Dealer salesman bubble */}
                      <div className="flex items-start gap-3 max-w-2xl animate-fade-in-up">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-300 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 border border-zinc-800">
                          REP
                        </div>
                        <div className="bg-zinc-900 rounded-md p-3.5 border border-zinc-800 text-xs leading-relaxed font-sans font-normal text-zinc-400 shadow-sm">
                          <span className="font-mono text-zinc-500 block text-[9px] uppercase tracking-wider mb-1">Dealer Sales Consultant:</span>
                          "{kit.negotiationScript.phases[activePhaseIndex]?.dealerOpening}"
                        </div>
                      </div>

                      {/* Buyer counter bubble */}
                      <div className="flex items-start gap-3 max-w-2xl ml-auto flex-row-reverse animate-fade-in-up">
                        <div className="w-7 h-7 rounded-full bg-brand-blue text-zinc-950 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                          YOU
                        </div>
                        <div className="bg-zinc-900 rounded-md p-3.5 border border-zinc-800 text-xs leading-relaxed font-sans font-normal text-zinc-350 shadow-sm border-l-2 border-emerald-500 pl-4 italic">
                          <span className="font-mono text-brand-blue block text-[9px] uppercase tracking-wider mb-1 not-italic font-bold">Your response (Use this exact quote):</span>
                          "{kit.negotiationScript.phases[activePhaseIndex]?.yourResponse}"
                        </div>
                      </div>

                    </div>

                    {/* Prev / Next buttons for phases */}
                    <div className="flex justify-between items-center pt-2">
                      <button
                        type="button"
                        disabled={activePhaseIndex === 0}
                        onClick={() => setActivePhaseIndex(prev => prev - 1)}
                        className="btn-secondary text-xs px-3.5 py-2 rounded-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none"
                      >
                        ◀ Previous Phase
                      </button>
                      
                      <span className="text-xs text-zinc-500 font-mono font-bold">
                        Phase {activePhaseIndex + 1} of {kit.negotiationScript.phases.length}
                      </span>

                      <button
                        type="button"
                        disabled={activePhaseIndex === kit.negotiationScript.phases.length - 1}
                        onClick={() => setActivePhaseIndex(prev => prev + 1)}
                        className="btn-secondary text-xs px-3.5 py-2 rounded-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none"
                      >
                        Next Phase ▶
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer Banner */}
              <div className="bg-card-bg border-t border-card-border px-6 py-5 flex items-center justify-between shrink-0 text-xs font-sans font-normal text-zinc-400">
                <span>Prepared by Candor Config Engine. Use these tactics to secure the best deal.</span>
                <button
                  onClick={() => setShowWarRoom(true)}
                  className="btn-primary text-xs px-5 py-2.5 rounded-md hover:scale-[1.01] active:scale-[0.99]"
                >
                  Finished Checklist
                </button>
              </div>

            </div>
          )
        ) : null}

      </div>
    </div>
  );
}
