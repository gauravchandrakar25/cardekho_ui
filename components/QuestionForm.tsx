'use client';

import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { 
  IndianRupee, 
  Users, 
  Car, 
  Zap, 
  ShieldAlert, 
  Milestone, 
  HeartHandshake, 
  Wrench, 
  LineChart, 
  Compass,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';

interface QuestionFormProps {
  onSubmit: (preferences: UserPreferences) => void;
  isLoading: boolean;
}

export default function QuestionForm({ onSubmit, isLoading }: QuestionFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: '',
    familySize: '',
    primaryUsage: '',
    fuelPreference: '',
    bodyType: '',
    topPriority: ''
  });

  const [error, setError] = useState('');

  const updatePreference = (key: keyof UserPreferences, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    setError(''); // clear error when choice is made
  };

  const handleNext = () => {
    if (step === 1 && !preferences.budget) {
      setError('Please select a budget range to proceed.');
      return;
    }
    if (step === 2 && (!preferences.familySize || !preferences.primaryUsage)) {
      setError('Please answer both questions to proceed.');
      return;
    }
    if (step === 3 && (!preferences.fuelPreference || !preferences.bodyType)) {
      setError('Please select both fuel and body type preferences.');
      return;
    }
    
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferences.topPriority) {
      setError('Please select your top purchasing priority.');
      return;
    }
    onSubmit(preferences);
  };

  // Option lists with icon mapping
  const budgetOptions = [
    { label: 'Under 10 Lakhs', desc: 'Budget-friendly hatchbacks & micro SUVs' },
    { label: '10–15 Lakhs', desc: 'Premium hatchbacks, compact SUVs & entry sedans' },
    { label: '15–20 Lakhs', desc: 'Feature-rich midsize SUVs & premium sedans' },
    { label: '20–30 Lakhs', desc: 'High-end SUVs & luxurious driving options' },
    { label: 'Above 30 Lakhs', desc: 'Full-sized 4x4 SUVs, luxury cars & top-tier EVs' }
  ];

  const familyOptions = [
    { label: '1–2', desc: 'Solo or Couples', icon: Users },
    { label: '3–4', desc: 'Small Family', icon: Users },
    { label: '5+', desc: 'Large Joint Family', icon: Users }
  ];

  const usageOptions = [
    { label: 'City Driving', desc: 'Daily stop-and-go office commutes', icon: Milestone },
    { label: 'Highway Driving', desc: 'Frequent long weekend road trips', icon: Compass },
    { label: 'Mixed', desc: 'Balanced urban and highway trips', icon: Car }
  ];

  const fuelOptions = [
    { label: 'Petrol', desc: 'Refined performance' },
    { label: 'Diesel', desc: 'Torque & highway efficiency' },
    { label: 'CNG', desc: 'Ultra-low commuter running cost' },
    { label: 'EV', desc: 'Zero emissions & modern tech' },
    { label: 'No Preference', desc: 'Open to any fuel type' }
  ];

  const bodyOptions = [
    { label: 'Hatchback', desc: 'Compact & highly agile' },
    { label: 'SUV', desc: 'Tall view & high ground clearance' },
    { label: 'Sedan', desc: 'Elegant looks & three-box comfort' },
    { label: 'MPV', desc: 'Multi-seater family carrier' },
    { label: 'No Preference', desc: 'Open to all styling body types' }
  ];

  const priorityOptions = [
    { label: 'Mileage', desc: 'Maximize kilometers per liter', icon: Zap, color: 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' },
    { label: 'Comfort', desc: 'Spacious seats & smooth suspensions', icon: HeartHandshake, color: 'text-zinc-100 bg-zinc-900 border border-zinc-800' },
    { label: 'Safety', desc: 'High crash ratings & solid build', icon: ShieldAlert, color: 'text-rose-500 bg-rose-500/10 border border-rose-500/20' },
    { label: 'Performance', desc: 'High power & sporty acceleration', icon: Zap, color: 'text-amber-500 bg-amber-500/10 border border-amber-500/20' },
    { label: 'Resale Value', desc: 'Strong market value retention', icon: LineChart, color: 'text-zinc-100 bg-zinc-900 border border-zinc-800' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-800/80 p-6 md:p-10 shadow-2xl relative animate-scale-in">
      {/* Progress Header */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round(((step - 1) / totalSteps) * 100)}% Completed</span>
        </div>
        <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850/50">
          <div 
            className="h-full bg-brand-blue transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.3)]"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Budget */}
        {step === 1 && (
          <div className="animate-fade-in-up space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">What is your target budget?</h2>
              <p className="text-xs md:text-sm text-zinc-400 font-sans font-normal">Budget is the baseline of our search. Select the pricing boundaries that feel most comfortable.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgetOptions.map((opt, idx) => {
                const isSelected = preferences.budget === opt.label;
                const isLast = idx === budgetOptions.length - 1;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => updatePreference('budget', opt.label)}
                    className={`flex items-center justify-between text-left p-4.5 rounded-xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                      isLast ? 'md:col-span-2' : ''
                    } ${
                      isSelected 
                        ? 'border-brand-blue bg-brand-blue/10 text-fg-main shadow-md shadow-brand-blue/10' 
                        : 'border-card-border hover:border-brand-blue/50 bg-card-bg text-fg-main shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`p-2.5 rounded-lg transition-colors duration-300 ${isSelected ? 'bg-brand-blue text-white dark:text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                        <IndianRupee className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-display font-semibold text-zinc-100 text-sm md:text-base">{opt.label}</span>
                        <span className="block text-[11px] text-zinc-400 mt-0.5 font-normal leading-relaxed">{opt.desc}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-brand-blue text-zinc-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Family & Usage */}
        {step === 2 && (
          <div className="animate-fade-in-up space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">How many people ride together?</h2>
              <p className="text-xs md:text-sm text-zinc-400 font-sans font-normal mb-4">This helps determine cabin space requirements (e.g. 5-seaters vs 7-seaters).</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {familyOptions.map((opt) => {
                  const isSelected = preferences.familySize === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => updatePreference('familySize', opt.label)}
                      className={`text-left p-5 rounded-xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                        isSelected 
                          ? 'border-brand-blue bg-brand-blue/10 text-fg-main shadow-md shadow-brand-blue/10' 
                          : 'border-card-border hover:border-brand-blue/50 bg-card-bg text-fg-main shadow-xs'
                      }`}
                    >
                      <opt.icon className={`w-6 h-6 mb-3 transition-colors duration-300 ${isSelected ? 'text-brand-blue' : 'text-zinc-400'}`} />
                      <span className="block font-display font-semibold text-zinc-100 text-sm md:text-base">{opt.label} Persons</span>
                      <span className="block text-[11px] text-zinc-400 mt-1 font-normal leading-relaxed">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">Where will you drive the most?</h2>
              <p className="text-xs md:text-sm text-zinc-400 font-sans font-normal mb-4">This impacts priorities like automatic transmission preference and optimal engine sizing.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {usageOptions.map((opt) => {
                  const isSelected = preferences.primaryUsage === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => updatePreference('primaryUsage', opt.label)}
                      className={`text-left p-5 rounded-xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                        isSelected 
                          ? 'border-brand-blue bg-brand-blue/10 text-fg-main shadow-md shadow-brand-blue/10' 
                          : 'border-card-border hover:border-brand-blue/50 bg-card-bg text-fg-main shadow-xs'
                      }`}
                    >
                      <opt.icon className={`w-6 h-6 mb-3 transition-colors duration-300 ${isSelected ? 'text-brand-blue' : 'text-zinc-400'}`} />
                      <span className="block font-display font-semibold text-zinc-100 text-sm md:text-base">{opt.label}</span>
                      <span className="block text-[11px] text-zinc-400 mt-1 font-normal leading-relaxed">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Fuel & Body Type */}
        {step === 3 && (
          <div className="animate-fade-in-up space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">What is your fuel preference?</h2>
              <p className="text-xs md:text-sm text-zinc-400 font-sans font-normal mb-4">Decide between running costs (CNG/EV) vs absolute convenience (Petrol/Diesel).</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {fuelOptions.map((opt) => {
                  const isSelected = preferences.fuelPreference === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => updatePreference('fuelPreference', opt.label)}
                      className={`text-center p-4 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center hover:scale-[1.01] cursor-pointer min-h-[80px] ${
                        isSelected 
                          ? 'border-brand-blue bg-brand-blue/10 text-fg-main shadow-md shadow-brand-blue/10' 
                          : 'border-card-border hover:border-brand-blue/50 bg-card-bg text-fg-main shadow-xs'
                      }`}
                    >
                      <span className="font-display font-semibold text-zinc-100 text-xs md:text-sm">{opt.label}</span>
                      <span className="text-[9px] text-zinc-400 mt-1 leading-normal hidden md:block">{opt.desc.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">What body style do you prefer?</h2>
              <p className="text-xs md:text-sm text-zinc-400 font-sans font-normal mb-4">Select what design style excites you or select No Preference.</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {bodyOptions.map((opt) => {
                  const isSelected = preferences.bodyType === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => updatePreference('bodyType', opt.label)}
                      className={`text-center p-4 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center hover:scale-[1.01] cursor-pointer min-h-[80px] ${
                        isSelected 
                          ? 'border-brand-blue bg-brand-blue/10 text-fg-main shadow-md shadow-brand-blue/10' 
                          : 'border-card-border hover:border-brand-blue/50 bg-card-bg text-fg-main shadow-xs'
                      }`}
                    >
                      <span className="font-display font-semibold text-zinc-100 text-xs md:text-sm">{opt.label}</span>
                      <span className="text-[9px] text-zinc-400 mt-1 leading-normal hidden md:block">{opt.desc.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Top Priority */}
        {step === 4 && (
          <div className="animate-fade-in-up space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">What is your absolute top priority?</h2>
              <p className="text-xs md:text-sm text-zinc-400 font-sans font-normal">Choose the **single most important driver** for your decision. We will use this to rank and explain matches.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {priorityOptions.map((opt) => {
                const isSelected = preferences.topPriority === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => updatePreference('topPriority', opt.label)}
                    className={`flex items-start text-left p-4.5 rounded-xl border transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
                      isSelected 
                        ? 'border-brand-blue bg-brand-blue/10 text-fg-main shadow-md shadow-brand-blue/10' 
                        : 'border-card-border hover:border-brand-blue/50 bg-card-bg text-fg-main shadow-xs'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg mr-3.5 transition-colors duration-300 shrink-0 ${opt.color}`}>
                      <opt.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block font-display font-semibold text-zinc-100 text-sm md:text-base">{opt.label}</span>
                      <span className="block text-[11px] text-zinc-400 mt-0.5 font-normal leading-relaxed">{opt.desc}</span>
                    </div>
                    {isSelected && (
                      <div className="ml-auto w-6 h-6 rounded-full bg-brand-blue text-zinc-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Error Alert Box */}
        {error && (
          <div className="mt-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-mono font-bold animate-scale-in flex items-center gap-1.5 shadow-xs">
            ⚠️ {error}
          </div>
        )}

        {/* Bottom Actions Panel */}
        <div className="mt-8 pt-6 border-t border-zinc-800/60 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className={`btn-secondary flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] rounded-lg ${
              step === 1 ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 text-xs md:text-sm px-5 py-2.5 rounded-lg font-bold"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2 text-xs md:text-sm px-6 py-2.5 rounded-lg font-bold disabled:bg-zinc-850 disabled:text-zinc-500 disabled:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Shortlisting...
                </span>
              ) : (
                <>
                  Get My Recommendations <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
