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
    label: 'Kaji Kitab',
    description: 'RAG & Multimodal Bot',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    id: 'hafalan',
    label: 'Simulasi Hafalan',
    description: "Al-Qur'an",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
  {
    id: 'upload',
    label: 'Unggah Dokumen',
    description: 'Knowledge Base RAG',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 lg:w-64 flex flex-col
          bg-white/90 backdrop-blur-xl
          border-r border-emerald-100
          shadow-lg lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo / Brand */}
        <div className="p-5 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-200">
              <span className="text-white text-lg">📚</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 leading-tight">Asisten AI</h1>
              <p className="text-xs text-emerald-600 font-medium">Kaji Kitab & Turats</p>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse-gentle"></span>
            <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">Prototype Lomba Karya Ilmiah</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modul</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => {
                onModuleChange(item.id);
                onClose();
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-xl
                transition-all duration-200 group text-left
                ${activeModule === item.id
                  ? 'bg-gradient-to-r from-emerald-50 to-emerald-100/60 border border-emerald-200 text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-transparent'
                }
              `}
            >
              <div className={`
                p-2 rounded-lg transition-colors
                ${activeModule === item.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                }
              `}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{item.label}</p>
                <p className={`text-[11px] truncate ${activeModule === item.id ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {item.description}
                </p>
              </div>
              {activeModule === item.id && (
                <div className="ml-auto w-1.5 h-8 bg-emerald-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-emerald-100">
          <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-gentle" />
            <span className="text-[11px] text-emerald-700 font-medium">
              Sistem RAG Aktif
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
