'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import QuestionForm from '../../components/QuestionForm';
import RecommendationCard from '../../components/RecommendationCard';
import ReasoningSection from '../../components/ReasoningSection';
import RejectedCars from '../../components/RejectedCars';
import FinancialShield from '../../components/FinancialShield';
import NegotiationKitModal from '../../components/NegotiationKitModal';
import SmartChatDrawer from '../../components/SmartChatDrawer';
import { UserPreferences, AIResponse, APIMetadata, Car } from '../../types';
import { getRecommendations, checkBackendHealth } from '../../services/api';
import { getCarActualImage, getCarRawUrl } from '../../services/carImages';
import { Sparkles, RefreshCw, Gauge, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AICarMatcherPage() {
  const [view, setView] = useState<'survey' | 'loading' | 'results'>('survey');
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [results, setResults] = useState<AIResponse | null>(null);
  const [metadata, setMetadata] = useState<APIMetadata | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeCarNameForKit, setActiveCarNameForKit] = useState<string | null>(null);
  const [activeCarForShield, setActiveCarForShield] = useState<{ name: string; price: number } | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [allCars, setAllCars] = useState<Car[]>([]);

  useEffect(() => {
    checkBackendHealth();
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'}/api/cars`)
      .then(res => {
        if (res.data && res.data.data) {
          setAllCars(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleFormSubmit = async (prefs: UserPreferences) => {
    setPreferences(prefs);
    setView('loading');
    setErrorMsg(null);

    try {
      const response = await getRecommendations(prefs);
      setResults(response.data);
      setMetadata(response.metadata);
      setView('results');
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
      setErrorMsg(err.message || 'Failed to get recommendations. Please try again.');
      setView('survey');
    }
  };

  const handleStartOver = () => {
    setView('survey');
    setPreferences(null);
    setResults(null);
    setMetadata(null);
    setErrorMsg(null);
  };

  const getCarAffordabilityStatus = (carName: string): 'Safe' | 'Stretching' | 'Unsafe' => {
    if (!preferences) return 'Safe';
    const matchedCar = allCars.find(c => c.name.toLowerCase() === carName.toLowerCase() || `${c.brand} ${c.name}`.toLowerCase() === carName.toLowerCase());
    const priceLakhs = matchedCar ? matchedCar.price_min : 10;
    if (priceLakhs <= 10) return 'Safe';
    if (priceLakhs <= 18) return 'Stretching';
    return 'Unsafe';
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar onOpenChat={() => setIsChatOpen(true)} showAboutUsButton={false} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 md:py-12">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>

        {/* View 1: Survey Form */}
        {view === 'survey' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <div className="inline-flex items-center gap-1.5 bg-zinc-900 text-brand-blue text-xs font-mono px-3.5 py-1.5 rounded-md uppercase tracking-widest border border-zinc-800">
                <Sparkles className="w-3.5 h-3.5" /> Step-by-Step AI Shortlist Engine
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-zinc-100">
                Find Your Ideal Car Match
              </h1>
              <p className="text-xs md:text-sm text-zinc-400 font-sans max-w-xl mx-auto">
                Answer a few quick questions about your family size, budget, mileage priority, and features. Our AI will curate the top 3 best-fitting Indian cars with clinical tradeoffs.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono text-center">
                {errorMsg}
              </div>
            )}

            <QuestionForm onSubmit={handleFormSubmit} isLoading={false} />
          </div>
        )}

        {/* View 2: Loading State */}
        {view === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-brand-blue/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-t-brand-blue border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display font-semibold text-zinc-100">Analyzing 17 Seeded Indian Car Models...</h3>
              <p className="text-xs text-zinc-400 font-mono">Running 20/4/10 affordability rules & safety GNCAP scoring...</p>
            </div>
          </div>
        )}

        {/* View 3: AI Recommendations Results */}
        {view === 'results' && results && (
          <div className="space-y-10 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-card-border pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-blue uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Recommendation Complete
                </div>
                <h1 className="text-2xl md:text-4xl font-display font-semibold text-zinc-100">
                  Your Curated Car Shortlist
                </h1>
              </div>

              <button
                onClick={handleStartOver}
                className="btn-secondary flex items-center justify-center gap-2 text-xs px-4 py-2.5 hover:scale-[1.01] active:scale-[0.99]"
              >
                <RefreshCw className="w-4 h-4" /> Start Shortlisting Again
              </button>
            </div>

            {/* Top 3 Matches */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-brand-blue text-zinc-950 flex items-center justify-center">
                  <Gauge className="w-4 h-4" />
                </div>
                <h2 className="text-xl md:text-2xl font-display font-semibold text-zinc-100 tracking-tight">Your Top Recommended Matches</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.recommendedCars.map((car, idx) => {
                  const matchedCar = allCars.find(c => 
                    c.name.toLowerCase() === car.name.toLowerCase() || 
                    `${c.brand} ${c.name}`.toLowerCase() === car.name.toLowerCase()
                  );
                  return (
                    <RecommendationCard
                      key={car.name}
                      car={car}
                      rank={idx + 1}
                      affordabilityStatus={getCarAffordabilityStatus(car.name)}
                      bodyType={matchedCar?.body_type}
                      dbImage={matchedCar?.image}
                      onGenerateKit={(carName) => setActiveCarNameForKit(carName)}
                      onShowFinancialShield={(carName) => {
                        const matched = allCars.find(c => c.name.toLowerCase() === carName.toLowerCase() || `${c.brand} ${c.name}`.toLowerCase() === carName.toLowerCase());
                        setActiveCarForShield({ name: carName, price: matched ? matched.price_min : 10 });
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <ReasoningSection reasoning={results.selectionReasoning} />
            <RejectedCars rejected={results.rejectedCars} />
          </div>
        )}
      </main>

      {/* Standard Feature Page Minimal Footer */}
      <footer className="border-t border-card-border py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs font-mono text-zinc-500">
          <p>© 2026 Candor Config Engine.</p>
          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
            Beta Version v1.0
          </span>
        </div>
      </footer>

      {/* Modals & Chat */}
      {activeCarNameForKit && (
        <NegotiationKitModal
          carName={activeCarNameForKit}
          onClose={() => setActiveCarNameForKit(null)}
          initialVariant="Mid"
        />
      )}

      {activeCarForShield && (
        <div className="fixed inset-0 z-100 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card-bg rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in border border-card-border">
            <div className="overflow-y-auto p-1">
              <FinancialShield
                initialCarPriceLakhs={activeCarForShield.price}
                carName={activeCarForShield.name}
                onClose={() => setActiveCarForShield(null)}
              />
            </div>
          </div>
        </div>
      )}

      <SmartChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recommendedCars={results?.recommendedCars || []}
        allCars={allCars}
      />
    </div>
  );
}
