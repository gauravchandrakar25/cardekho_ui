'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Loader2,
  Lock
} from 'lucide-react';
import { RecommendedCar } from '../types';
import { Car } from '../types';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface SmartChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedCars: RecommendedCar[];
  allCars: Car[];
}

export default function SmartChatDrawer({ isOpen, onClose, recommendedCars, allCars }: SmartChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'bot', 
      text: 'Hello! I am your Candor Concierge Advisor. Ask me anything about car financing, the 20/4/10 rule, illegal dealer markup fees, or specifications of Indian cars.' 
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  // Preset query questions to make user interaction super simple
  const presets = [
    'Is the dealer handling fee really illegal?',
    'How do I match insurance prices outside?',
    'Should I choose SBI or HDFC car loan?',
    'Can I afford a Tata Nexon on ₹80K salary?'
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add User Message
    const userMsg: Message = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate AI response calculation
    setTimeout(() => {
      let reply = "I'm looking into this for you. According to standard auto guidelines, always request an itemized 'Out-the-Door' invoice from the dealership and negotiate each markup line by line.";
      
      const query = text.toLowerCase();
      if (query.includes('handling') || query.includes('logistics') || query.includes('illegal')) {
        reply = "Yes, logistics and handling charges are illegal. Multiple State RTO directives and Consumer Courts in India have ruled that dealers cannot charge extra fees for transporting a car from the stockyard. Tell the dealer: 'Logistics fees have been declared illegal by the RTO. Please remove this charge, or provide it in writing so I can file a claim with the manufacturer and RTO.'";
      } else if (query.includes('insurance') || query.includes('outside')) {
        reply = "Absolutely. Dealers markup insurance premiums by 30% to 40%. You have the legal right to purchase motor insurance from any IRDAI-approved insurer outside. Get a direct quote online (e.g. Tata AIG, HDFC Ergo) and show it to the dealer. They will usually match it or remove their markup to save the sale.";
      } else if (query.includes('sbi') || query.includes('hdfc') || query.includes('loan') || query.includes('bank')) {
        reply = "SBI generally offers the lowest interest rates (currently around 8.75% - 9.0%) and zero foreclosure charges, but takes 3-7 days for processing. HDFC and ICICI are faster (often instant approvals) but charge higher rates (9.1% - 9.5%) and foreclosure penalties. Under the 20/4/10 rule, prioritize the lowest overall rate to keep your EMI under 10% of monthly income.";
      } else if (query.includes('nexon') || query.includes('salary') || query.includes('afford')) {
        reply = "Let's check the math. A Tata Nexon mid variant costs around ₹11.5 Lakhs. Under the 20/4/10 rule, 20% down payment is ₹2.3L, leaving a loan of ₹9.2L. At 8.75% for 48 months, the monthly EMI is ~₹22,800. To comfortably afford this, your monthly salary should be at least ₹2,28,000 (since EMI should be <= 10% of salary). On an ₹80K salary, the max safe EMI is ₹8,000, which supports a car price of under ₹4.2 Lakhs (e.g. pre-owned hatchbacks or basic Alto).";
      } else if (recommendedCars.length > 0 && (query.includes('my recommended') || query.includes('which car') || query.includes('shortlist'))) {
        const carNames = recommendedCars.map(c => c.name).join(', ');
        reply = `Based on your survey matches, your top choices are the ${carNames}. Under the 20/4/10 rule, the entry-spec models will require a 20% down payment, and we highly recommend checking their specific ex-showroom invoices to remove accessory markup bundles.`;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md bg-card-bg border-l border-card-border shadow-2xl h-full flex flex-col z-10 animate-slide-in-right">
        
        {/* Header */}
        <div className="p-4 border-b border-card-border flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-brand-blue">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm text-zinc-100">Candor Chat Advisor</h3>
              <span className="text-[10px] text-zinc-400 font-sans block">Ask about financing & dealer markups</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-100 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Local disclaimer banner */}
        <div className="px-4 py-2 bg-brand-blue-light/25 border-b border-brand-blue/15 text-[10px] text-brand-blue flex items-center gap-1.5 font-semibold font-mono">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Local Engine: Data remains strictly inside your browser.</span>
        </div>

        {/* Message area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/20">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-6.5 h-6.5 rounded-full flex items-center justify-center font-mono font-bold text-[9px] shrink-0 ${
                msg.sender === 'user' ? 'bg-brand-blue text-zinc-950 shadow-sm' : 'bg-zinc-800 text-zinc-350 border border-zinc-700/50'
              }`}>
                {msg.sender === 'user' ? 'YOU' : 'AI'}
              </div>
              
              <div className={`p-3 rounded-md text-xs leading-relaxed font-sans font-normal shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-brand-blue text-zinc-950 rounded-tr-none font-semibold' 
                  : 'bg-zinc-900 text-zinc-300 border border-zinc-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2.5 max-w-[85%]">
              <div className="w-6.5 h-6.5 rounded-full bg-zinc-800 text-zinc-350 flex items-center justify-center font-mono font-bold text-[9px] border border-zinc-700/50">
                AI
              </div>
              <div className="p-3 bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-md rounded-tl-none text-xs flex items-center gap-1.5 font-sans shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue" />
                <span>Concierge is calculating...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Presets Panel */}
        <div className="p-3 border-t border-card-border space-y-2 shrink-0 bg-card-bg">
          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block font-mono">Suggested Topics:</span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(preset)}
                className="text-[10px] font-sans font-normal text-zinc-400 bg-zinc-900 hover:bg-zinc-850 px-2.5 py-1.5 rounded-md border border-zinc-800 cursor-pointer transition-all hover:scale-[1.01]"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Input panel */}
        <div className="p-3 border-t border-card-border bg-zinc-950 shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about handling charges, loans..."
              className="flex-1 p-2.5 border border-zinc-800 rounded-md bg-zinc-900 text-xs font-mono text-zinc-100 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            />
            <button
              type="submit"
              className="btn-primary p-2.5 rounded-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center shadow-sm border-none"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
