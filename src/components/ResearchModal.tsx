'use client';

import React from 'react';

interface ResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResearchModal({ isOpen, onClose }: ResearchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FAF7F2] rounded-2xl max-w-2xl w-full max-h-[88dvh] flex flex-col shadow-2xl border border-[#E5DFD3] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5DFD3] flex items-center justify-between bg-[#FAF6EE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#164E3B] text-[#E8D7B0] border border-[#164E3B]/30 flex items-center justify-center shadow-2xs flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  Arsitektur Sistem &amp; Kajian Ilmiah
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-[#164E3B]/10 text-[#164E3B] border border-[#164E3B]/20 rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                  Riset Turats
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                Prototipe Ilmiah: Asisten AI Kaji Kitab Turats &amp; Penelusuran Sanad Nahwu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            aria-label="Tutup jendela"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-5 text-xs sm:text-sm text-stone-600 leading-relaxed">
          {/* Latar Belakang */}
          <section className="bg-white border border-[#E7DFC6] rounded-xl p-4 sm:p-5 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold text-[#164E3B] uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#164E3B] text-[#FAF6EE] flex items-center justify-center text-[10px] font-bold">
                01
              </span>
              Latar Belakang &amp; Urgensi Riset
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              Kitab Turats (literatur klasik Islam/kitab kuning) memuat khazanah keilmuan yang kaya namun memiliki tantangan aksesibilitas bagi santri pemula dan generasi digital, seperti format aksara Arab gundul tanpa harakat, ragam dialektika gramatika (nahwu-sharaf), istilah fikih spesifik, serta kesulitan penelusuran rujukan silang (<em>cross-referencing</em>) antarkitab secara cepat. Prototipe ini menjembatani tantangan tersebut menggunakan arsitektur kecerdasan buatan berbasis penelusuran korpus terpercaya (RAG etis).
            </p>
          </section>

          {/* Diagram Alur RAG & Multimodal */}
          <section className="space-y-3">
            <h4 className="text-xs font-bold text-[#164E3B] uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#164E3B] text-[#FAF6EE] flex items-center justify-center text-[10px] font-bold">
                02
              </span>
              Arsitektur &amp; Pipeline Teknologi
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-white border border-[#E7DFC6] rounded-xl shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#164E3B] text-[#FAF6EE] flex items-center justify-center font-mono font-bold text-[10px]">
                    01
                  </span>
                  <span className="text-xs font-bold text-stone-900">Hybrid RAG</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Temu kembali semantik vektor &amp; pencocokan istilah pada naskah kurikulum inti: <em>Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah Al-Jurumiyyah</em> (284 Halaman, 558 segmen terindeks) terhubung langsung ke pembaca dokumen PDF interaktif.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#E7DFC6] rounded-xl shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-[#164E3B] text-[#FAF6EE] flex items-center justify-center font-mono font-bold text-[10px]">
                    02
                  </span>
                  <span className="text-xs font-bold text-stone-900">Grounded Sanad</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Penulisan syarah dan sintesis materi yang terhubung langsung dengan sitasi teks matan Arab, nama kitab, bab, dan fasal rujukan otentik tanpa fabrikasi data.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-[#E7DFC6] rounded-xl shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-[#164E3B] text-[#FAF6EE] flex items-center justify-center font-mono font-bold text-[10px]">
                      03
                    </span>
                    <span className="text-xs font-bold text-stone-900">Vision OCR</span>
                  </div>
                  <span className="text-[9px] bg-[#164E3B]/10 text-[#164E3B] font-bold px-1.5 py-0.5 rounded border border-[#164E3B]/20">
                    Aktif
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Pembacaan dan transkripsi cerdas citra naskah fisik kitab kuning (aksara Arab/Pegon) dengan model Vision AI, otomatis menyajikan teks matan berharakat serta syarah kaidah nahwu.
                </p>
              </div>
            </div>
          </section>

          {/* Modul Hafalan */}
          <section className="bg-white border border-[#E7DFC6] rounded-xl p-4 sm:p-5 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold text-[#164E3B] uppercase tracking-wider font-mono flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#164E3B] text-[#FAF6EE] flex items-center justify-center text-[10px] font-bold">
                03
              </span>
              Inovasi Modul Simulasi Hafalan
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              Menggabungkan metode takrir/muraja&apos;ah tradisional dengan gamifikasi interaktif digital. Fitur mencakup: uji sambung ayat, deteksi ketepatan kata (lafadz), dan umpan balik reflektif berbasis makna surah Al-Qur&apos;an 30 Juz.
            </p>
          </section>

          {/* Etika & Guardrails */}
          <section className="p-4 bg-[#FAF6ED] border border-[#E7DFC6] rounded-xl space-y-1.5">
            <h4 className="text-xs font-bold text-[#8B1E24] uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-[#8B1E24] flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              Prinsip Etika Kecerdasan Buatan Islam
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              Sistem memposisikan AI murni sebagai <em>Khadim at-Tahqiq / Asisten Penelusuran</em> (pembantu referensi), bukan sebagai pembuat fatwa independen (Mufti). Otoritas hukum keagamaan dan penafsiran final tetap berada pada bimbingan Masyaikh, Guru, dan Ulama muktamad pembimbing sanad keilmuan.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5DFD3] bg-[#FAF6EE] flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-medium">Dayah Perbatasan Minhajussalam &bull; Edisi Riset 2026</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#164E3B] hover:bg-[#123E2F] text-[#FAF6EE] rounded-xl text-xs font-semibold shadow-2xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
