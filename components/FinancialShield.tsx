'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BankRate, AffordabilityResult } from '../types/financial';
import SearchableSelect from './SearchableSelect';
import { 
  ShieldCheck, 
  HelpCircle, 
  Info, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  IndianRupee,
  Lock
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface FinancialShieldProps {
  initialCarPriceLakhs?: number;
  carName?: string;
  onClose?: () => void;
  initialDownPaymentLakhs?: number;
}

export default function FinancialShield({ initialCarPriceLakhs, carName, onClose, initialDownPaymentLakhs }: FinancialShieldProps) {
  const [monthlySalary, setMonthlySalary] = useState<number>(120000);
  const [monthlyFixedExpenses, setMonthlyFixedExpenses] = useState<number>(45000);
  const [carPriceLakhs, setCarPriceLakhs] = useState<number>(initialCarPriceLakhs || 12);
  const [downPaymentLakhs, setDownPaymentLakhs] = useState<number>(
    initialDownPaymentLakhs !== undefined 
      ? initialDownPaymentLakhs 
      : Number(((initialCarPriceLakhs || 12) * 0.20).toFixed(2))
  );
  
  const [bankRates, setBankRates] = useState<BankRate[]>([
    { id: 'sbi', name: 'SBI Car Loan', rate: 8.75 },
    { id: 'hdfc', name: 'HDFC Bank', rate: 9.10 },
    { id: 'icici', name: 'ICICI Bank', rate: 9.20 },
    { id: 'axis', name: 'Axis Bank', rate: 9.35 }
  ]);
  const [selectedBankId, setSelectedBankId] = useState<string>('sbi');
  const [loadingRates, setLoadingRates] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoadingRates(true);
        const response = await axios.get<{ success: boolean; rates: BankRate[] }>(`${API_BASE_URL}/bank-rates`);
        if (response.data && response.data.success && response.data.rates.length > 0) {
          setBankRates(response.data.rates);
        }
      } catch (err) {
        console.warn('⚠️ Failed to fetch bank rates, using offline defaults.', err);
      } finally {
        setLoadingRates(false);
      }
    }
    fetchRates();
  }, []);

  const selectedBank = bankRates.find(b => b.id === selectedBankId) || bankRates[0];
  const interestRate = selectedBank ? selectedBank.rate : 8.75;

  const handleCarPriceChange = (newPrice: number) => {
    setCarPriceLakhs(newPrice);
    if (downPaymentLakhs > newPrice) {
      setDownPaymentLakhs(Number((newPrice * 0.20).toFixed(2)));
    }
  };

  const evaluateLocalAffordability = (): AffordabilityResult => {
    const tenureMonths = 48;
    const maxAllowedEMI = Math.round(monthlySalary * 0.10);
    
    const downPaymentRequired = carPriceLakhs * 0.20; // 20% benchmark
    const safeDownPayment = Math.max(0, Math.min(carPriceLakhs, downPaymentLakhs));
    const downPaymentPercent = carPriceLakhs > 0 ? (safeDownPayment / carPriceLakhs) * 100 : 0;
    const loanAmount = Math.max(0, carPriceLakhs - safeDownPayment);

    const principal = loanAmount * 100000;
    const monthlyRate = (interestRate / 12) / 100;
    let actualCarEMI = 0;

    if (monthlyRate === 0) {
      actualCarEMI = principal / tenureMonths;
    } else {
      actualCarEMI = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                     (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    }
    actualCarEMI = Math.round(actualCarEMI);

    let maxLoanAmount = 0;
    if (monthlyRate === 0) {
      maxLoanAmount = (maxAllowedEMI * tenureMonths) / 100000;
    } else {
      const factor = (monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                     (Math.pow(1 + monthlyRate, tenureMonths) - 1);
      maxLoanAmount = (maxAllowedEMI / factor) / 100000;
    }
    const maxCarPrice = maxLoanAmount + safeDownPayment;

    const downPaymentMet = downPaymentPercent >= 19.99;
    const loanTenureMet = true;
    const emiLimitMet = actualCarEMI <= maxAllowedEMI;
    
    const totalCommitment = monthlyFixedExpenses + actualCarEMI;
    const totalFixedCommitmentPercent = parseFloat(((totalCommitment / monthlySalary) * 100).toFixed(1));
    const cashflowHealthy = totalFixedCommitmentPercent <= 70;

    let status: 'Safe' | 'Stretching' | 'Unsafe' = 'Safe';
    let score = 95;
    const emiRatio = actualCarEMI / maxAllowedEMI;

    if (emiRatio <= 1.0 && cashflowHealthy && downPaymentMet) {
      status = 'Safe';
      score = Math.round(100 - (15 * emiRatio));
    } else if (emiRatio <= 1.5 && totalFixedCommitmentPercent <= 85) {
      status = 'Stretching';
      const stretchingProgress = (emiRatio - 1.0) / 0.5;
      score = Math.round(84 - (34 * Math.max(0, stretchingProgress)));
      if (!downPaymentMet) {
        score = Math.max(50, score - 10);
      }
    } else {
      status = 'Unsafe';
      const unsafeProgress = Math.min((emiRatio - 1.5) / 1.0, 1);
      score = Math.round(49 - (39 * Math.max(0, unsafeProgress)));
    }

    score = Math.max(10, Math.min(100, score));

    return {
      status,
      score,
      maxCarPrice: parseFloat(maxCarPrice.toFixed(2)),
      maxAllowedEMI,
      actualCarEMI,
      downPaymentRequired: parseFloat(downPaymentRequired.toFixed(2)),
      downPaymentAmount: parseFloat(safeDownPayment.toFixed(2)),
      downPaymentPercent: parseFloat(downPaymentPercent.toFixed(1)),
      loanAmount: parseFloat(loanAmount.toFixed(2)),
      totalFixedCommitmentPercent,
      ruleChecks: {
        downPaymentMet,
        loanTenureMet,
        emiLimitMet,
        cashflowHealthy
      }
    };
  };

  const results = evaluateLocalAffordability();

  // Concentric Radial Gauge Settings
  const outerRadius = 60;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const outerDashoffset = outerCircumference - (results.score / 100) * outerCircumference;

  const innerRadius = 46;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const commitmentScore = Math.min(100, results.totalFixedCommitmentPercent);
  const innerDashoffset = innerCircumference - (commitmentScore / 100) * innerCircumference;

  const getStatusColors = (status: 'Safe' | 'Stretching' | 'Unsafe') => {
    switch (status) {
      case 'Safe':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20',
          text: 'text-emerald-500',
          badge: 'bg-emerald-500 text-zinc-950 font-mono text-[10px]',
          stroke: 'stroke-emerald-500',
          darkText: 'text-zinc-100',
        };
      case 'Stretching':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20',
          text: 'text-amber-500',
          badge: 'bg-amber-500 text-zinc-950 font-mono text-[10px]',
          stroke: 'stroke-amber-500',
          darkText: 'text-zinc-100',
        };
      case 'Unsafe':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20',
          text: 'text-rose-500',
          badge: 'bg-rose-500 text-zinc-950 font-mono text-[10px]',
          stroke: 'stroke-rose-500',
          darkText: 'text-zinc-100',
        };
    }
  };

  const statusColors = getStatusColors(results.status);

  return (
    <div className="bg-card-bg text-fg-main rounded-xl border border-card-border p-6 md:p-8 shadow-sm space-y-8 animate-scale-in">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-card-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-zinc-900 border border-zinc-800 text-brand-blue">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {carName ? `Candor Shield: ${carName}` : 'Candor Financial Shield'}
            </h2>
            <p className="text-xs text-zinc-400 font-sans font-normal">
              Evaluate car affordability using the industry-proven 20/4/10 rule with custom down payment.
            </p>
          </div>
        </div>
      </div>

      {/* Local Privacy Disclaimer Badge */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-md p-4 flex items-start gap-3">
        <Lock className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
        <div>
          <span className="font-display font-semibold text-xs text-zinc-100 block">🔒 Local-First Privacy Shield</span>
          <span className="text-[11px] text-zinc-400 font-sans leading-relaxed block mt-1">
            Encrypted Engine. Your financial attributes remain strictly local.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Inputs Panel */}
        <div className="lg:col-span-5 space-y-5">
          <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider font-mono">[20/4/10 Rule Active]</h3>
          
          {/* Monthly Salary Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-400">Monthly Take-Home Salary</label>
            <div className="bg-zinc-900 border border-zinc-800 focus-within:border-brand-blue rounded-md p-3 flex items-center justify-between transition-colors">
              <span className="text-zinc-400 font-mono text-sm mr-2">₹</span>
              <input 
                type="number" 
                value={monthlySalary} 
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
                className="bg-transparent border-none outline-none text-zinc-100 font-mono text-sm w-full focus:ring-0 p-0"
              />
              <span className="text-[10px] text-zinc-500 font-sans uppercase">INR</span>
            </div>
            <input 
              type="range" 
              min={30000} 
              max={500000} 
              step={5000}
              value={monthlySalary} 
              onChange={(e) => setMonthlySalary(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-brand-blue mt-2"
            />
            <div className="flex justify-between text-[9px] text-zinc-500 font-mono font-bold">
              <span>₹30K</span>
              <span>₹2.5L</span>
              <span>₹5L+</span>
            </div>
          </div>

          {/* Monthly Fixed Expenses Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-400">Monthly Fixed Expenses</label>
            <div className="bg-zinc-900 border border-zinc-800 focus-within:border-brand-blue rounded-md p-3 flex items-center justify-between transition-colors">
              <span className="text-zinc-400 font-mono text-sm mr-2">₹</span>
              <input 
                type="number" 
                value={monthlyFixedExpenses} 
                onChange={(e) => setMonthlyFixedExpenses(Number(e.target.value))}
                className="bg-transparent border-none outline-none text-zinc-100 font-mono text-sm w-full focus:ring-0 p-0"
              />
              <span className="text-[10px] text-zinc-500 font-sans uppercase">INR</span>
            </div>
            <input 
              type="range" 
              min={10000} 
              max={300000} 
              step={2000}
              value={monthlyFixedExpenses} 
              onChange={(e) => setMonthlyFixedExpenses(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-brand-blue mt-2"
            />
            <div className="flex justify-between text-[9px] text-zinc-500 font-mono font-bold">
              <span>₹10K</span>
              <span>₹1.5L</span>
              <span>₹3L+</span>
            </div>
          </div>

          {/* Bank Rates Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-400 block">Loan Interest Rate</label>
            <SearchableSelect
              options={bankRates.map((bank) => ({
                value: bank.id,
                label: `${bank.name} — ${bank.rate}% p.a.`,
                sublabel: `${bank.rate}% annual interest rate`,
              }))}
              value={selectedBankId}
              onChange={(val) => setSelectedBankId(val)}
              searchPlaceholder="Search bank or interest rate..."
            />
          </div>

          {/* Target Car Price Input */}
          <div className="space-y-1 pt-2 border-t border-card-border">
            <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-400">Target Car Price (Lakhs)</label>
            <div className="bg-zinc-900 border border-zinc-800 focus-within:border-brand-blue rounded-md p-3 flex items-center justify-between transition-colors">
              <span className="text-zinc-400 font-mono text-sm mr-2">L</span>
              <input 
                type="number" 
                value={carPriceLakhs} 
                onChange={(e) => handleCarPriceChange(Number(e.target.value))}
                className="bg-transparent border-none outline-none text-zinc-100 font-mono text-sm w-full focus:ring-0 p-0"
                step="0.1"
              />
              <span className="text-[10px] text-zinc-500 font-sans uppercase">Lakhs</span>
            </div>
            <input 
              type="range" 
              min={4} 
              max={70} 
              step={0.5}
              value={carPriceLakhs} 
              onChange={(e) => handleCarPriceChange(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-brand-blue mt-2"
            />
            <div className="flex justify-between text-[9px] text-zinc-500 font-mono font-bold">
              <span>₹4 Lakhs</span>
              <span>₹35 Lakhs</span>
              <span>₹70 Lakhs</span>
            </div>
          </div>

          {/* Down Payment Option Input */}
          <div className="space-y-1 pt-2 border-t border-card-border">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-sans font-bold uppercase tracking-wider text-zinc-400">Down Payment (Lakhs)</label>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                results.ruleChecks.downPaymentMet 
                  ? 'text-emerald-400 bg-emerald-500/10' 
                  : 'text-amber-400 bg-amber-500/10'
              }`}>
                {results.downPaymentPercent.toFixed(0)}% of Price
              </span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 focus-within:border-brand-blue rounded-md p-3 flex items-center justify-between transition-colors">
              <span className="text-zinc-400 font-mono text-sm mr-2">₹</span>
              <input 
                type="number" 
                value={downPaymentLakhs} 
                onChange={(e) => setDownPaymentLakhs(Math.max(0, Math.min(carPriceLakhs, Number(e.target.value))))}
                className="bg-transparent border-none outline-none text-zinc-100 font-mono text-sm w-full focus:ring-0 p-0"
                step="0.1"
                min={0}
                max={carPriceLakhs}
              />
              <span className="text-[10px] text-zinc-500 font-sans uppercase">Lakhs</span>
            </div>
            <input 
              type="range" 
              min={0} 
              max={carPriceLakhs} 
              step={0.1}
              value={Math.min(downPaymentLakhs, carPriceLakhs)} 
              onChange={(e) => setDownPaymentLakhs(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-brand-blue mt-2"
            />
            <div className="flex justify-between text-[9px] text-zinc-500 font-mono font-bold mt-1">
              <span>₹0 (0%)</span>
              <span>₹{(carPriceLakhs * 0.20).toFixed(1)}L (20%)</span>
              <span>₹{(carPriceLakhs * 0.50).toFixed(1)}L (50%)</span>
            </div>
            {/* Preset buttons */}
            <div className="flex items-center gap-1.5 pt-2">
              <span className="text-[10px] text-zinc-500 font-mono">Quick Preset:</span>
              {[10, 20, 30, 50].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setDownPaymentLakhs(Number(((pct / 100) * carPriceLakhs).toFixed(2)))}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                    Math.abs(results.downPaymentPercent - pct) < 1.5
                      ? 'bg-brand-blue/20 border-brand-blue text-brand-blue'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Results & Gauges Panel */}
        <div className="lg:col-span-7 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-xl p-6 md:p-8 border border-card-border flex flex-col justify-between space-y-6">
          
          {/* Main Affordability Verdict & Tank Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Commitment Cascade Tank */}
            <div className="md:col-span-4 flex flex-col items-center gap-5 bg-zinc-900/40 p-5 rounded-xl border border-zinc-800/60 shadow-inner w-full">
              {/* The Tank */}
              <div className="relative w-16 h-56 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-end shadow-inner shrink-0">
                {/* Stacked layers (bottom-to-top: Fixed Expenses, Insurance, Fuel, EMI) */}
                <div 
                  style={{ height: `${Math.min(100, (results.actualCarEMI / monthlySalary) * 100)}%` }} 
                  className={`w-full transition-all duration-500 ease-out border-t border-zinc-950/20 ${
                    results.actualCarEMI > results.maxAllowedEMI 
                      ? 'bg-rose-500 opacity-100' 
                      : 'bg-emerald-500 opacity-100'
                  }`}
                  title={`EMI: ₹${results.actualCarEMI}`}
                />
                <div 
                  style={{ height: `${Math.min(100, (4000 / monthlySalary) * 100)}%` }} 
                  className={`w-full transition-all duration-500 ease-out border-t border-zinc-950/20 ${
                    results.actualCarEMI > results.maxAllowedEMI ? 'bg-rose-500 opacity-80' : 'bg-emerald-500 opacity-80'
                  }`}
                  title="Fuel & Maintenance: ₹4,000"
                />
                <div 
                  style={{ height: `${Math.min(100, (2500 / monthlySalary) * 100)}%` }} 
                  className={`w-full transition-all duration-500 ease-out border-t border-zinc-950/20 ${
                    results.actualCarEMI > results.maxAllowedEMI ? 'bg-rose-500 opacity-60' : 'bg-emerald-500 opacity-60'
                  }`}
                  title="Estimated Insurance: ₹2,500"
                />
                <div 
                  style={{ height: `${Math.min(100, (monthlyFixedExpenses / monthlySalary) * 100)}%` }} 
                  className={`w-full transition-all duration-500 ease-out ${
                    results.actualCarEMI > results.maxAllowedEMI ? 'bg-rose-500 opacity-40' : 'bg-emerald-500 opacity-40'
                  }`}
                  title={`Fixed Expenses: ₹${monthlyFixedExpenses}`}
                />
              </div>

              {/* Tank Breakdown Legend */}
              <div className="flex flex-col gap-2.5 text-[11px] font-sans font-normal text-zinc-400 w-full">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-sm transition-colors duration-500 shrink-0 ${results.actualCarEMI > results.maxAllowedEMI ? 'bg-rose-500 opacity-100' : 'bg-emerald-500 opacity-100'}`} />
                  <span className="truncate">EMI: ₹{results.actualCarEMI.toLocaleString('en-IN')} ({( (results.actualCarEMI / monthlySalary) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-sm transition-colors duration-500 shrink-0 ${results.actualCarEMI > results.maxAllowedEMI ? 'bg-rose-500 opacity-80' : 'bg-emerald-500 opacity-80'}`} />
                  <span className="truncate">Fuel: ₹4,000 ({( (4000 / monthlySalary) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-sm transition-colors duration-500 shrink-0 ${results.actualCarEMI > results.maxAllowedEMI ? 'bg-rose-500 opacity-60' : 'bg-emerald-500 opacity-60'}`} />
                  <span className="truncate">Insurance: ₹2,500 ({( (2500 / monthlySalary) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-sm transition-colors duration-500 shrink-0 ${results.actualCarEMI > results.maxAllowedEMI ? 'bg-rose-500 opacity-40' : 'bg-emerald-500 opacity-40'}`} />
                  <span className="truncate">Fixed: ₹{monthlyFixedExpenses.toLocaleString('en-IN')} ({( (monthlyFixedExpenses / monthlySalary) * 100).toFixed(1)}%)</span>
                </div>
                <div className="border-t border-zinc-800/80 pt-2 flex items-center justify-between font-mono text-zinc-350 text-[10px]">
                  <span>Total:</span>
                  <span className={`font-bold ${
                    ((results.actualCarEMI + 4000 + 2500 + monthlyFixedExpenses) / monthlySalary * 100) > 100 ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {(((results.actualCarEMI + 4000 + 2500 + monthlyFixedExpenses) / monthlySalary) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Narrative Score Card */}
            <div className="md:col-span-8 space-y-4 w-full">
              {/* Affordability Verdict Block */}
              <div className={`border p-4.5 rounded-xl transition-colors duration-500 ${
                results.actualCarEMI > results.maxAllowedEMI 
                  ? 'bg-rose-500/5 border-rose-500/20 text-rose-500' 
                  : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'
              }`}>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block mb-1">
                  Budget Verdict
                </span>
                <h4 className="text-xl font-display font-semibold leading-tight tracking-tight">
                  {results.actualCarEMI > results.maxAllowedEMI ? 'Stretch Purchase Detected' : "You're in the Safety Zone"}
                </h4>
              </div>

              {/* Clinical Doctor's Report */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3 shadow-sm">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-500 block">
                  Clinical Budget Diagnosis — 20/4/10 Rule
                </span>
                <ul className="space-y-3 text-xs text-zinc-350 font-sans">
                  
                  {/* Axis 1: Down Payment */}
                  <li className="flex items-start gap-2.5">
                    <span className="shrink-0 mt-0.5 text-base select-none">
                      {results.ruleChecks.downPaymentMet ? '✅' : '⚠️'}
                    </span>
                    <div className="space-y-0.5">
                      <span className="font-bold text-zinc-200 block">Down Payment Axis (20% Rule Benchmark)</span>
                      <span className="text-zinc-400 font-sans leading-normal block">
                        {results.ruleChecks.downPaymentMet
                          ? `Healthy checkup. Down payment of ₹${results.downPaymentAmount.toFixed(2)}L (${results.downPaymentPercent.toFixed(0)}%) meets or exceeds the recommended 20% benchmark (₹${results.downPaymentRequired.toFixed(2)}L).`
                          : `Caution. Down payment of ₹${results.downPaymentAmount.toFixed(2)}L (${results.downPaymentPercent.toFixed(0)}%) is below the recommended 20% benchmark (₹${results.downPaymentRequired.toFixed(2)}L). A lower down payment increases loan principal (₹${results.loanAmount.toFixed(2)}L) and monthly interest.`
                        }
                      </span>
                    </div>
                  </li>

                  {/* Axis 2: Tenure */}
                  <li className="flex items-start gap-2.5">
                    <span className="shrink-0 mt-0.5 text-base select-none">✅</span>
                    <div className="space-y-0.5">
                      <span className="font-bold text-zinc-200 block">Loan Tenure Axis (4 Years)</span>
                      <span className="text-zinc-400 font-sans leading-normal block">
                        Healthy checkup. Calculated over a safe 4-year loan term (48 months) to limit interest compound.
                      </span>
                    </div>
                  </li>

                  {/* Axis 3: EMI Limit */}
                  <li className="flex items-start gap-2.5">
                    <span className="shrink-0 mt-0.5 text-base select-none">
                      {results.actualCarEMI > results.maxAllowedEMI * 1.5 
                        ? '🔴' 
                        : results.actualCarEMI > results.maxAllowedEMI 
                          ? '⚠️' 
                          : '✅'
                      }
                    </span>
                    <div className="space-y-0.5">
                      <span className="font-bold text-zinc-200 block">EMI Axis (10% of Income)</span>
                      <span className="text-zinc-400 font-sans leading-normal block">
                        {results.actualCarEMI > results.maxAllowedEMI * 1.5 
                          ? `Risk. Monthly EMI of ₹${results.actualCarEMI.toLocaleString('en-IN')} severely exceeds the safe 10% limit of ₹${results.maxAllowedEMI.toLocaleString('en-IN')}/mo.`
                          : results.actualCarEMI > results.maxAllowedEMI 
                            ? `Caution. Monthly EMI of ₹${results.actualCarEMI.toLocaleString('en-IN')} stretches past the safe 10% limit of ₹${results.maxAllowedEMI.toLocaleString('en-IN')}/mo.`
                            : `Healthy. Monthly EMI of ₹${results.actualCarEMI.toLocaleString('en-IN')} is within the safe 10% limit of ₹${results.maxAllowedEMI.toLocaleString('en-IN')}/mo.`
                        }
                      </span>
                    </div>
                  </li>

                </ul>
              </div>
            </div>

          </div>

          {/* Pricing breakdowns details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-card-border">
            
            <div className="bg-card-bg p-3 rounded-md border border-card-border text-center shadow-sm">
              <span className="block text-[9px] text-zinc-400 font-sans font-bold uppercase tracking-wider">Target Car Price</span>
              <span className="block text-sm font-mono font-bold text-zinc-100 mt-1">
                ₹{carPriceLakhs.toFixed(1)}L
              </span>
            </div>

            <div className="bg-card-bg p-3 rounded-md border border-card-border text-center shadow-sm">
              <span className="block text-[9px] text-zinc-400 font-sans font-bold uppercase tracking-wider">Down Payment</span>
              <span className="block text-sm font-mono font-bold text-emerald-400 mt-1">
                ₹{results.downPaymentAmount.toFixed(1)}L ({results.downPaymentPercent.toFixed(0)}%)
              </span>
            </div>

            <div className="bg-card-bg p-3 rounded-md border border-card-border text-center shadow-sm">
              <span className="block text-[9px] text-zinc-400 font-sans font-bold uppercase tracking-wider">Net Loan Amount</span>
              <span className="block text-sm font-mono font-bold text-brand-blue mt-1">
                ₹{results.loanAmount.toFixed(1)}L
              </span>
            </div>

            <div className="bg-card-bg p-3 rounded-md border border-card-border text-center shadow-sm">
              <span className="block text-[9px] text-zinc-400 font-sans font-bold uppercase tracking-wider">Estimated Monthly EMI</span>
              <span className="block text-sm font-mono font-bold text-zinc-100 mt-1">
                ₹{results.actualCarEMI.toLocaleString('en-IN')}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
