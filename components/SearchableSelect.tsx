'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search cars...',
  className = '',
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || {
    value,
    label: value || placeholder,
  };

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opt.sublabel && opt.sublabel.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-900 border border-zinc-800 hover:border-brand-blue/60 focus:border-brand-blue rounded-md p-3 flex items-center justify-between transition-colors text-left group cursor-pointer"
      >
        <span className="text-xs font-mono font-medium text-zinc-100 truncate pr-2">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 group-hover:text-brand-blue transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-brand-blue' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-zinc-900/95 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-72">
          {/* Search Input Sticky Header */}
          <div className="p-2.5 border-b border-zinc-800/80 sticky top-0 bg-zinc-900 z-10 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-brand-blue shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="bg-transparent border-none outline-none text-xs font-mono text-zinc-100 w-full focus:ring-0 placeholder:text-zinc-500 p-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="overflow-y-auto p-1.5 space-y-0.5 max-h-56">
            {filteredOptions.length === 0 ? (
              <div className="py-4 text-center text-xs font-mono text-zinc-500">
                No matching cars found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-brand-blue/15 text-brand-blue font-semibold'
                        : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-zinc-100'
                    }`}
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="truncate">{opt.label}</span>
                      {opt.sublabel && (
                        <span className="text-[10px] text-zinc-500 font-sans leading-tight">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-blue shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
