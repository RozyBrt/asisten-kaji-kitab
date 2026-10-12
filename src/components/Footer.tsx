'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-sm flex-shrink-0">
      <div className="px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 max-w-7xl mx-auto w-full">
        {/* Disclaimer: Tampil penuh di layar desktop/tablet, ringkas 1-baris di layar HP */}
        <div className="hidden sm:flex items-start gap-2.5 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl">
          <div className="p-1 bg-amber-500 text-white rounded-md flex-shrink-0 mt-0.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-0.5">Catatan Etika &amp; Metodologi Keilmuan</p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Hasil penelusuran sistem ditujukan sebagai rujukan awal telaah literatur turats. Untuk fatwa dan ketetapan hukum syar&apos;i, tetap merujuk pada masyaikh, guru pembimbing, dan naskah matan muktamad.
            </p>
          </div>
        </div>

        {/* Mobile-only compact ethics & copyright */}
        <div className="sm:hidden flex items-center justify-between text-[10px] text-slate-500 py-0.5">
          <span className="truncate font-medium text-slate-600">
            &copy; 2026 Asisten Turats &bull; Karya Ilmiah
          </span>
          <span className="text-[9px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 font-semibold flex-shrink-0">
            RAG &amp; Turats
          </span>
        </div>

        {/* Desktop Copyright */}
        <div className="hidden sm:flex mt-2 items-center justify-between">
          <p className="text-[10px] text-slate-500">
            &copy; 2026 Edisi Riset Lomba Karya Ilmiah &mdash; Asisten Kaji Kitab &amp; Turats
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400">Arsitektur RAG &amp; Sanad Kitab</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
