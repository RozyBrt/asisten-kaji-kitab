'use client';

import React from 'react';
import type { AiProviderMode, AiProviderStatus } from '@/lib/ai-provider';

interface HeaderProps {
  onMenuToggle: () => void;
  activeModuleLabel: string;
  onOpenResearchModal: () => void;
  aiStatus: AiProviderStatus | null;
}

const MODE_STYLES: Record<
  AiProviderMode | 'unknown',
  { dot: string; box: string; text: string }
> = {
  mock: {
    dot: 'bg-amber-500',
    box: 'bg-amber-50/80 border-amber-200/80',
    text: 'text-amber-800',
  },
  unknown: {
    dot: 'bg-slate-400',
    box: 'bg-slate-50 border-slate-200',
    text: 'text-slate-600',
  },
  gemini: {
    dot: 'bg-emerald-600',
    box: 'bg-emerald-50/80 border-emerald-200/80',
    text: 'text-emerald-800',
  },
  sumopod: {
    dot: 'bg-emerald-600',
    box: 'bg-emerald-50/80 border-emerald-200/80',
    text: 'text-emerald-800',
  },
};

export default function Header({ onMenuToggle, activeModuleLabel, onOpenResearchModal, aiStatus }: HeaderProps) {
  const modeStyle = aiStatus ? MODE_STYLES[aiStatus.mode] : MODE_STYLES.unknown;

  // Nama provider ringkas untuk mobile
  const shortStatusLabel = aiStatus
    ? aiStatus.mode === 'sumopod'
      ? 'SumoPod'
      : aiStatus.mode === 'gemini'
      ? 'Gemini'
      : aiStatus.mode === 'mock'
      ? 'Demo'
      : 'AI Aktif'
    : 'AI Siap';

  return (
    <header className="sticky top-0 z-30 w-full bg-[#FAF8F4] border-b border-[#E5DFD3] shadow-2xs flex-shrink-0">
      <div className="flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 max-w-7xl mx-auto w-full gap-2">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            id="mobile-menu-toggle"
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#EBE5D8] text-stone-700 transition-colors flex-shrink-0"
            aria-label="Buka menu navigasi"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base lg:text-lg font-bold text-stone-900 font-serif tracking-tight truncate leading-tight">
                <span className="sm:hidden">Asisten Turats</span>
                <span className="hidden sm:inline">Asisten Kaji Kitab &amp; Turats</span>
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 bg-[#8B1E24]/10 border border-[#8B1E24]/20 text-[#8B1E24] text-[10px] font-semibold rounded-md uppercase tracking-wider">
                Karya Ilmiah
              </span>
            </div>
            <div className="flex items-center gap-x-2 mt-0.5 min-w-0">
              <span className="text-[10px] sm:text-[11px] text-stone-600 font-medium truncate max-w-[180px] sm:max-w-none">
                {activeModuleLabel}
              </span>
              <span className="text-stone-400 text-xs hidden lg:inline">&bull;</span>
              <span className="text-[11px] text-stone-500 hidden lg:inline">Rujukan Intisari Al-Kawakib (284 Halaman)</span>
            </div>
          </div>
        </div>

        {/* Right: Research info button + Status indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          <button
            id="btn-open-research-info"
            onClick={onOpenResearchModal}
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 bg-white border border-[#E5DFD3] hover:border-[#C5A059] hover:bg-[#FAF6ED] text-stone-700 hover:text-stone-900 rounded-lg text-xs font-semibold transition-all shadow-2xs"
            title="Lihat Arsitektur Sistem & Dasar Ilmiah"
            aria-label="Lihat Arsitektur Sistem & Dasar Ilmiah"
          >
            <svg className="w-4 h-4 text-[#164E3B] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
            <span className="hidden md:inline">Arsitektur &amp; Riset</span>
          </button>

          <div
            role="status"
            aria-live="polite"
            className={`flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-medium ${modeStyle.box}`}
            title={aiStatus?.hint ?? 'Status provider AI'}
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${modeStyle.dot}`} />
            <span className={`text-[10px] sm:text-[11px] font-semibold truncate ${modeStyle.text}`}>
              <span className="sm:hidden">{shortStatusLabel}</span>
              <span className="hidden sm:inline">{aiStatus ? aiStatus.label : 'Status AI'}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
