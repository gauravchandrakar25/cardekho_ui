'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CandorLogo from './CandorLogo';
import { Sparkles, ShieldCheck, FileText, Sun, Moon, Info, MessageSquare } from 'lucide-react';
import AboutUsModal from './AboutUsModal';
import { useTheme } from './ThemeProvider';

interface NavbarProps {
  onOpenChat?: () => void;
  showAboutUsButton?: boolean;
}

export default function Navbar({ onOpenChat, showAboutUsButton = false }: NavbarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/ai-car-matcher', label: 'AI Shortlist', icon: Sparkles },
    { href: '/financial-shield', label: 'Financial Shield', icon: ShieldCheck },
    { href: '/negotiation-kit', label: 'Negotiation Kit', icon: FileText },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 glass-overlay border-b border-card-border/80">
        <div className="max-w-7xl w-full mx-auto px-6 py-3.5 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group">
            <CandorLogo />
            <span className="bg-zinc-900/90 text-zinc-400 group-hover:text-zinc-200 text-[9px] font-mono px-1.5 py-0.5 rounded ml-1 uppercase border border-zinc-800 transition-colors">
              Concierge
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 p-1 rounded-xl shadow-xs">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-brand-blue/15 text-brand-blue font-semibold border border-brand-blue/30 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onOpenChat && (
              <button
                onClick={onOpenChat}
                className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-brand-blue" />
                <span>AI Chat</span>
              </button>
            )}

            {showAboutUsButton && (
              <button
                onClick={() => setIsAboutOpen(true)}
                className="text-xs font-mono text-zinc-400 hover:text-zinc-100 transition-colors px-3 py-1.5 rounded-lg border border-card-border hover:border-brand-blue/50 flex items-center gap-1.5 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-brand-blue" />
                <span className="hidden sm:inline">About Us</span>
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-card-border bg-card-bg text-fg-main hover:scale-105 transition-all cursor-pointer shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 text-zinc-800" /> : <Sun className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

        </div>
      </header>

      {isAboutOpen && <AboutUsModal onClose={() => setIsAboutOpen(false)} />}
    </>
  );
}
