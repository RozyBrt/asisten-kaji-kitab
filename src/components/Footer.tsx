'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-white/60 backdrop-blur-lg">
      <div className="px-4 py-3 lg:px-6">
        {/* Disclaimer */}
        <div className="flex items-start gap-2.5 p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
          <div className="p-1 bg-amber-400 rounded-lg flex-shrink-0 mt-0.5">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-0.5">Disclaimer Etika AI</p>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Hasil generasi AI bertujuan sebagai asisten penelusuran materi/referensi. 
              Untuk penafsiran hukum/fatwa mutakhir, tetap konfirmasikan kepada Guru/Ustadz Pembimbing.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[10px] text-slate-400">
            © 2026 Prototype Lomba Karya Ilmiah — Bot AI Pembantu Kaji Kitab & Hafalan Al-Qur&apos;an
          </p>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400">Powered by</span>
            <span className="text-[10px] font-bold text-emerald-600">Google Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
