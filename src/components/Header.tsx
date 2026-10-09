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
    box: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
  },
  unknown: {
    dot: 'bg-slate-400',
    box: 'bg-slate-50 border-slate-200',
    text: 'text-slate-600',
  },
  gemini: {
    dot: 'bg-emerald-500',
    box: 'bg-emerald-50 border-emerald-100',
    text: 'text-emerald-800',
  },
  sumopod: {
    dot: 'bg-emerald-500',
    box: 'bg-emerald-50 border-emerald-100',
    text: 'text-emerald-800',
  },
};

export default function Header({ onMenuToggle, activeModuleLabel, onOpenResearchModal, aiStatus }: HeaderProps) {
  const modeStyle = aiStatus ? MODE_STYLES[aiStatus.mode] : MODE_STYLES.unknown;

  return (
    <header className="sticky top-0 z-30 glass border-b border-emerald-100/50">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="mobile-menu-toggle"
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-emerald-50 text-slate-600 transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="min-w-0">
            <h1 className="text-base lg:text-lg font-bold gradient-text truncate">
              Asisten AI Kaji Kitab & Turats
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5">
              <span className="text-[11px] text-slate-500 font-medium">{activeModuleLabel}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 rounded-full max-w-full">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></span>
                <span className="text-[9px] font-bold text-amber-700 uppercase tracking-wide leading-tight">
                  Prototype Lomba Karya Ilmiah
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Research info button + Status indicators */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            id="btn-open-research-info"
            onClick={onOpenResearchModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold hover:bg-emerald-50 hover:border-emerald-300 transition-all btn-press shadow-xs"
            title="Lihat Arsitektur Sistem & Dasar Ilmiah"
          >
            <span>🔬</span>
            <span className="hidden md:inline">Arsitektur & Riset</span>
          </button>

          <div
            role="status"
            aria-live="polite"
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border min-w-0 ${modeStyle.box}`}
            title={aiStatus?.hint ?? 'Status provider AI tidak dapat diperiksa.'}
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${modeStyle.dot} ${aiStatus?.mode !== 'mock' && aiStatus ? 'animate-pulse-gentle' : ''}`} />
            <span className={`text-[10px] sm:text-[11px] font-semibold truncate ${modeStyle.text}`}>
              {aiStatus ? aiStatus.label : 'Status AI tidak tersedia'}
            </span>
          </div>

          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm shadow-md shadow-emerald-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
