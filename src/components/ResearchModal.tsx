'use client';

import React from 'react';

interface ResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResearchModal({ isOpen, onClose }: ResearchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white text-lg shadow-sm">
              🔬
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Arsitektur Sistem & Kajian Ilmiah
              </h3>
              <p className="text-xs text-emerald-700 font-medium">
                Prototype Lomba Karya Ilmiah: Bot AI Pembantu Kaji Kitab & Turats
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-600 leading-relaxed">
          {/* Latar Belakang */}
          <section>
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              1. Latar Belakang & Urgensi
            </h4>
            <p>
              Kitab Turats (literatur klasik Islam/kitab kuning) memuat khazanah keilmuan yang kaya namun memiliki tantangan aksesibilitas bagi santri pemula dan generasi digital, seperti format aksara Arab gundul tanpa harakat, istilah fikih spesifik, serta kesulitan penelusuran rujukan silang (cross-referencing) secara cepat. Prototipe ini menjembatani tantangan tersebut menggunakan kecerdasan buatan multimodal etis.
            </p>
          </section>

          {/* Diagram Alur RAG & Multimodal */}
          <section>
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              2. Arsitektur & Pipeline Teknologi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-base font-bold text-emerald-700 block mb-1">① Vision OCR</span>
                <p className="text-[11px] text-slate-600">
                  Transkripsi visual otomatis teks Arab/matan dari foto lembar fisik kitab klasik via Gemini Multimodal.
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-base font-bold text-emerald-700 block mb-1">② Hybrid RAG</span>
                <p className="text-[11px] text-slate-600">
                  Pencarian semantik & leksikal pada korpus kitab terindeks (Fathul Qarib, Safinatun Najah, dll).
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-base font-bold text-emerald-700 block mb-1">③ Grounded AI</span>
                <p className="text-[11px] text-slate-600">
                  Penulisan syarah dan sintesis jawaban yang terhubung langsung dengan sitasi nama kitab, bab, dan halaman.
                </p>
              </div>
            </div>
          </section>

          {/* Modul Hafalan */}
          <section>
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              3. Inovasi Modul Simulasi Hafalan
            </h4>
            <p>
              Menggabungkan metode takrir/muraja&apos;ah tradisional dengan gamifikasi interaktif digital. Fitur mencakup: uji sambung ayat, deteksi ketepatan kata (lafadz), dan umpan balik reflektif berbasis makna surah.
            </p>
          </section>

          {/* Etika & Guardrails */}
          <section className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-2">
              ⚠️ Prinsip Etika Kecerdasan Buatan Islam
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              Sistem memposisikan AI murni sebagai <em>Khadim / Asisten Penelusuran</em> (pembantu referensi), bukan sebagai pembuat fatwa independen (Mufti). Otoritas hukum keagamaan dan penafsiran final tetap berada pada bimbingan Masyaikh / Guru / Ustadz pembimbing sanad keilmuan.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Tim Riset Prototype Ilmiah • 2026</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
