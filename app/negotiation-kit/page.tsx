'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import NegotiationKitModal from '../../components/NegotiationKitModal';
import SearchableSelect from '../../components/SearchableSelect';
import SmartChatDrawer from '../../components/SmartChatDrawer';
import { Car } from '../../types';
import { getCarActualImage, getCarRawUrl } from '../../services/carImages';
import { ArrowLeft, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function NegotiationKitPage() {
  const [selectedCarForKit, setSelectedCarForKit] = useState<string>('Tata Nexon');
  const [allCars, setAllCars] = useState<Car[]>([]);
  const [activeCarModal, setActiveCarModal] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'}/api/cars`)
      .then(res => {
        if (res.data && res.data.data) {
          setAllCars(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const matchedCar = allCars.find(c => `${c.brand} ${c.name}` === selectedCarForKit || c.name === selectedCarForKit);

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

        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 bg-zinc-900 text-brand-blue text-xs font-mono px-3.5 py-1.5 rounded-md uppercase tracking-widest border border-zinc-800">
            <FileText className="w-3.5 h-3.5" /> On-Road Price & Dealership Fee Shield
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-semibold tracking-tight text-zinc-100">
            Dealer Negotiation Kit Generator
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-sans max-w-xl mx-auto">
            Select any car model to generate an itemized cost breakdown, expose mandatory vs illegal dealer charges, and view step-by-step negotiation tactics.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Car Search Dropdown */}
          <div className="bento-card p-6 md:p-8 space-y-5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300 block">
              Select Car Model to Inspection:
            </label>

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
              searchPlaceholder="Search car model (e.g. Fortuner, Swift, Nexon)..."
            />

            {/* Dynamic Trim Preview */}
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[16/9] flex items-center justify-center">
              <img
                src={getCarActualImage(selectedCarForKit, matchedCar?.image)}
                alt={selectedCarForKit}
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[9px] font-mono text-zinc-400 rounded-md border border-zinc-800 uppercase tracking-widest">
                {matchedCar?.body_type || 'SUV'}
              </div>
            </div>

            <button
              onClick={() => setActiveCarModal(selectedCarForKit)}
              className="btn-primary w-full py-3 rounded-xl text-xs font-mono font-bold hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-zinc-950" />
              <span>Generate Full {selectedCarForKit} Negotiation Kit</span>
            </button>
          </div>

          {/* Quick Info Checklist */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
              Included in your Negotiation Kit:
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400 font-sans">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Exact Ex-Showroom, RTO, and Fastag itemized breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Detection of illegal Logistics / Dealer Handling Charges</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Optional vs Mandatory Essential Kit checklist</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Step-by-step dealership closing script</span>
              </li>
            </ul>
          </div>
        </div>
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

      {activeCarModal && (
        <NegotiationKitModal
          carName={activeCarModal}
          onClose={() => setActiveCarModal(null)}
          initialVariant="Mid"
        />
      )}

      <SmartChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        recommendedCars={[]}
        allCars={allCars}
      />
    </div>
  );
}
