'use client';

import React from 'react';
import { ActiveModule } from '@/lib/types';

interface SidebarProps {
  activeModule: ActiveModule;
  onModuleChange: (module: ActiveModule) => void;
  isOpen: boolean;
  onClose: () => void;
}

const navItems: { id: ActiveModule; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'kaji-kitab',
    label: 'Kaji Kitab & Turats',
    description: 'Rujukan Sanad & Matan',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    id: 'hafalan',
    label: 'Muraja`ah Hafalan',
    description: 'Uji Ayat & Sambung Matan',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    id: 'upload',
    label: 'Korpus Literatur',
    description: 'Kitab Kuning Terindeks',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    id: 'panduan',
    label: 'Panduan & Disclaimer',
    description: 'Knowledge AI & Batasan',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
  },
];

export default function Sidebar({ activeModule, onModuleChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 lg:w-64 flex flex-col
          bg-white border-r border-slate-200
          shadow-xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center p-0.5 bg-white border border-slate-200 shadow-xs flex-shrink-0">
              <img
                src="/logo-dayah.png"
                alt="Logo Dayah Minhajussalam"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">Asisten Turats</h2>
              <p className="text-xs text-slate-500 font-medium truncate">Dayah Minhajussalam</p>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            aria-label="Tutup menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-2 border-b border-slate-50">
          <div className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider text-center">
              Dayah Perbatasan Minhajussalam
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <p className="px-3 pt-1 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Kajian
          </p>
          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onModuleChange(item.id);
                  onClose();
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-150 text-left relative
                  ${isActive
                    ? 'bg-emerald-950/[0.05] border border-emerald-900/15 text-emerald-950 font-medium shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 border border-transparent'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-lg transition-colors flex-shrink-0
                  ${isActive
                    ? 'bg-emerald-900 text-amber-100 shadow-2xs'
                    : 'bg-slate-100 text-slate-500'
                  }
                `}>
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-semibold truncate leading-snug ${isActive ? 'text-emerald-950' : 'text-slate-800'}`}>
                    {item.label}
                  </p>
                  <p className={`text-[11px] truncate ${isActive ? 'text-emerald-800/80 font-medium' : 'text-slate-400'}`}>
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <span className="w-1 h-5 bg-emerald-800 rounded-full flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3.5 pb-10 sm:pb-3.5 border-t border-slate-100">
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50/70 border border-emerald-100 rounded-lg">
            <div className="w-2 h-2 bg-emerald-600 rounded-full flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-emerald-900 truncate">
                Rujukan Intisari Al-Kawakib
              </p>
              <p className="text-[9px] text-slate-500 truncate">
                Syarah Mutammimah (284 Hal)
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
