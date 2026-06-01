'use client';

import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { 
  IndianRupee, 
  Users, 
  Car, 
  Fuel, 
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
    { label: 'Petrol', desc: 'Refined performance', icon: Fuel },
    { label: 'Diesel', desc: 'Torque & highway efficiency', icon: Fuel },
    { label: 'CNG', desc: 'Ultra-low commuter running cost', icon: Fuel },
    { label: 'EV', desc: 'Zero emissions & modern tech', icon: Zap },
    { label: 'No Preference', desc: 'Open to any fuel type', icon: Car }
  ];

  const bodyOptions = [
    { label: 'Hatchback', desc: 'Compact & highly agile', icon: Car },
    { label: 'SUV', desc: 'Tall view & high ground clearance', icon: Car },
    { label: 'Sedan', desc: 'Elegant looks & three-box comfort', icon: Car },
    { label: 'MPV', desc: 'Multi-seater family carrier', icon: Car },
    { label: 'No Preference', desc: 'Open to all styling body types', icon: Car }
  ];

  const priorityOptions = [
    { label: 'Mileage', desc: 'Maximize kilometers per liter', icon: Zap, color: 'text-emerald-500 bg-emerald-50' },
    { label: 'Comfort', desc: 'Spacious seats & smooth suspensions', icon: HeartHandshake, color: 'text-blue-500 bg-blue-50' },
    { label: 'Safety', desc: 'High crash ratings & solid build', icon: ShieldAlert, color: 'text-rose-500 bg-rose-50' },
    { label: 'Performance', desc: 'High power & sporty acceleration', icon: Zap, color: 'text-amber-500 bg-amber-50' },
    { label: 'Low Maintenance', desc: 'Hassle-free service & cheap spares', icon: Wrench, color: 'text-teal-500 bg-teal-50' },
    { label: 'Resale Value', desc: 'Strong market value retention', icon: LineChart, color: 'text-purple-500 bg-purple-50' }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl border border-brand-border p-6 md:p-8 shadow-sm">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round(((step - 1) / totalSteps) * 100)}% Completed</span>
        </div>
        <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-red transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Budget */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-2">What is your target budget?</h2>
            <p className="text-sm text-brand-gray mb-6">Budget is the baseline of our search. Select the pricing boundaries that feel most comfortable.</p>
            
            <div className="space-y-3">
              {budgetOptions.map((opt) => {
                const isSelected = preferences.budget === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => updatePreference('budget', opt.label)}
                    className={`w-full flex items-center justify-between text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'border-brand-red bg-brand-red-light' 
                        : 'border-brand-border hover:border-brand-gray bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-brand-red text-white' : 'bg-gray-100 text-brand-gray'}`}>
                        <IndianRupee className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block font-semibold text-brand-dark text-base">{opt.label}</span>
                        <span className="block text-xs text-brand-gray mt-0.5">{opt.desc}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-brand-red text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
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
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-2">How many people ride together?</h2>
              <p className="text-sm text-brand-gray mb-4">This helps determine cabin space requirements (e.g. 5-seaters vs 7-seaters).</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {familyOptions.map((opt) => {
                  const isSelected = preferences.familySize === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => updatePreference('familySize', opt.label)}
                      className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected 
                          ? 'border-brand-red bg-brand-red-light' 
                          : 'border-brand-border hover:border-brand-gray bg-white'
                      }`}
                    >
                      <opt.icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-brand-red' : 'text-brand-gray'}`} />
                      <span className="block font-semibold text-brand-dark">{opt.label} Persons</span>
                      <span className="block text-xs text-brand-gray mt-1">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-2">Where will you drive the most?</h2>
              <p className="text-sm text-brand-gray mb-4">This impacts priorities like automatic transmission preference and optimal engine sizing.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {usageOptions.map((opt) => {
                  const isSelected = preferences.primaryUsage === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => updatePreference('primaryUsage', opt.label)}
                      className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected 
                          ? 'border-brand-red bg-brand-red-light' 
                          : 'border-brand-border hover:border-brand-gray bg-white'
                      }`}
                    >
                      <opt.icon className={`w-6 h-6 mb-2 ${isSelected ? 'text-brand-red' : 'text-brand-gray'}`} />
                      <span className="block font-semibold text-brand-dark">{opt.label}</span>
                      <span className="block text-xs text-brand-gray mt-1">{opt.desc}</span>
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
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-2">What is your fuel preference?</h2>
              <p className="text-sm text-brand-gray mb-4">Decide between running costs (CNG/EV) vs absolute convenience (Petrol/Diesel).</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {fuelOptions.map((opt) => {
                  const isSelected = preferences.fuelPreference === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => updatePreference('fuelPreference', opt.label)}
                      className={`text-center p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center ${
                        isSelected 
                          ? 'border-brand-red bg-brand-red-light' 
                          : 'border-brand-border hover:border-brand-gray bg-white'
                      }`}
                    >
                      <opt.icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-brand-red' : 'text-brand-gray'}`} />
                      <span className="font-semibold text-brand-dark text-xs">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-2">What body style do you prefer?</h2>
              <p className="text-sm text-brand-gray mb-4">Select what design style excites you or select No Preference.</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {bodyOptions.map((opt) => {
                  const isSelected = preferences.bodyType === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => updatePreference('bodyType', opt.label)}
                      className={`text-center p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center ${
                        isSelected 
                          ? 'border-brand-red bg-brand-red-light' 
                          : 'border-brand-border hover:border-brand-gray bg-white'
                      }`}
                    >
                      <opt.icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-brand-red' : 'text-brand-gray'}`} />
                      <span className="font-semibold text-brand-dark text-xs">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Top Priority */}
        {step === 4 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl md:text-2xl font-bold text-brand-dark mb-2">What is your absolute top priority?</h2>
            <p className="text-sm text-brand-gray mb-6">Choose the **single most important driver** for your decision. We will use this to rank and explain matches.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {priorityOptions.map((opt) => {
                const isSelected = preferences.topPriority === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => updatePreference('topPriority', opt.label)}
                    className={`flex items-start text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'border-brand-red bg-brand-red-light shadow-sm' 
                        : 'border-brand-border hover:border-brand-gray bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mr-3 ${opt.color}`}>
                      <opt.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="block font-semibold text-brand-dark text-sm">{opt.label}</span>
                      <span className="block text-xs text-brand-gray mt-0.5">{opt.desc}</span>
                    </div>
                    {isSelected && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-brand-red text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
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
          <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-600 text-xs font-semibold animate-scale-in">
            ⚠️ {error}
          </div>
        )}

        {/* Bottom Actions Panel */}
        <div className="mt-8 pt-6 border-t border-brand-border flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className={`flex items-center gap-2 font-semibold text-sm px-4 py-2.5 rounded-lg border border-brand-border transition-all duration-200 ${
              step === 1 
                ? 'opacity-0 pointer-events-none' 
                : 'text-brand-dark hover:bg-brand-bg cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 font-bold text-sm bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 font-bold text-sm bg-brand-red hover:bg-brand-red-hover disabled:bg-red-400 text-white px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-1">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
