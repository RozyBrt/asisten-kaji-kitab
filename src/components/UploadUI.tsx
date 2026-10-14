'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { mockDocuments } from '@/lib/mock-data';
import { UploadedDocument } from '@/lib/types';

function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function FileIcon({ type }: { type: string }) {
  const colors: Record<string, string> = {
    pdf: 'bg-emerald-800 text-amber-200 border border-emerald-900/30',
    word: 'bg-slate-700 text-slate-100 border border-slate-800',
    txt: 'bg-slate-600 text-slate-100 border border-slate-700',
    image: 'bg-amber-700 text-amber-100 border border-amber-800',
  };
  const labels: Record<string, string> = {
    pdf: 'PDF',
    word: 'DOC',
    txt: 'TXT',
    image: 'IMG',
  };

  const key = ['png', 'jpg', 'jpeg', 'webp'].includes(type) ? 'image' : type;

  return (
    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${colors[key] || colors.txt} flex items-center justify-center shadow-xs flex-shrink-0`}>
      <span className="text-[10px] font-bold">{labels[key] || 'KITAB'}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: UploadedDocument['status'] }) {
  const styles: Record<string, string> = {
    indexed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    indexing: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-rose-50 text-rose-800 border-rose-200',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold border rounded-full ${styles[status]}`}>
      {status === 'indexing' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />}
      {status === 'indexed' && (
        <svg className="w-3 h-3 text-emerald-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      )}
      {status === 'error' && (
        <svg className="w-3 h-3 text-rose-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      )}
      {status === 'indexed' ? 'Terindeks' : status === 'indexing' ? 'Mengindeks...' : 'Gagal'}
    </span>
  );
}

function CategoryBadge({ category }: { category?: string }) {
  if (!category) return null;
  return (
    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md">
      {category}
    </span>
  );
}

const PROTECTED_DOC_IDS = ['doc-1', 'al-kawakib-ad-durriyyah'];

function isProtectedDoc(id: string): boolean {
  if (!id) return false;
  return PROTECTED_DOC_IDS.some(p => id === p || id.startsWith(p + '-'));
}

export default function UploadUI() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const fetchIndexedDocs = useCallback(async () => {
    try {
      const res = await fetch('/api/rag');
      if (!res.ok) throw new Error('HTTP ' + res.status);

      const data = await res.json();

      if (Array.isArray(data.documents) && data.documents.length > 0) {
        const mapped: UploadedDocument[] = data.documents.map((doc: { docId: string; docName: string; chunkCount: number }) => {
          const name = doc.docName || doc.docId.replace(/^\d+-/, '');
          const ext = name.split('.').pop()?.toLowerCase() || 'pdf';
          const type: 'pdf' | 'word' | 'txt' = ['png', 'jpg', 'jpeg', 'webp'].includes(ext) ? 'pdf' : (ext === 'pdf' ? 'pdf' : (ext === 'docx' || ext === 'doc' ? 'word' : 'txt'));
          let cat = 'Kajian Turats';
          if (doc.docId.includes('fathul') || doc.docId.includes('safinatun')) cat = 'Fiqih';
          else if (doc.docId.includes('talim')) cat = 'Akhlaq';
          else if (doc.docId.includes('kawakib') || doc.docId.includes('jurumiyyah')) cat = 'Gramatika Nahwu';

          return ({
            id: doc.docId,
            name: name,
            type: type,
            size: `${doc.chunkCount} chunk`,
            uploadedAt: new Date(),
            status: 'indexed' as const,
            category: cat,
          });
        });
        setDocuments(mapped);
      } else {
        setDocuments([]);
      }
    } catch {
      setDocuments(mockDocuments);
    }
  }, []);

  useEffect(() => {
    fetchIndexedDocs();
  }, [fetchIndexedDocs]);

  const filteredDocs = documents.filter(doc => {
    const matchSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'Semua' || doc.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const categories = ['Semua', 'Nahwu & Gramatika Arab Klasik', "Kaidah I'rab", 'Syarah Mutammimah', 'Dokumen Tambahan'];

  return (
    <div className="min-h-full w-full bg-[#FAF7F2] p-3 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-base sm:text-xl font-bold text-stone-900 font-serif tracking-tight">
              Korpus Literatur Kitab (Knowledge Base RAG)
            </h1>
            <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold bg-[#164E3B]/8 text-[#164E3B] rounded-full border border-[#164E3B]/20 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#164E3B] animate-pulse"></span>
              Katalog Terindeks &amp; Terverifikasi
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Koleksi naskah kitab kuning dan literatur turats pesantren yang diintegrasikan ke dalam basis rujukan ilmiah asisten AI.
          </p>
        </div>

        {/* Informasi Panduan Kurikulum & OCR Naskah */}
        <div className="p-3.5 sm:p-4 bg-white border border-[#E5DFD3] rounded-2xl shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FAF8F4] border border-[#E5DFD3] flex items-center justify-center text-[#164E3B] shrink-0 mt-0.5 sm:mt-0 shadow-2xs">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 font-serif">
                Basis Data Turats Standar Pesantren
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-600 mt-0.5 leading-relaxed">
                Seluruh naskah di bawah telah melalui pra-pemrosesan semantik vektor RAG. Untuk mengkaji foto lembar fisik kitab naskah langsung, gunakan tombol kamera di menu <strong>Kaji Kitab</strong>.
              </p>
            </div>
          </div>
          <span className="self-end sm:self-auto shrink-0 px-2.5 py-1 text-[11px] font-semibold bg-[#8B1E24]/10 text-[#8B1E24] rounded-lg border border-[#8B1E24]/20 uppercase tracking-wider">
            Rujukan Mu&apos;tamad
          </span>
        </div>

        {/* Statistik Kompak */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-white border border-[#E5DFD3] rounded-xl p-2.5 sm:p-4 shadow-2xs">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-500">Total Naskah</p>
            <p className="text-lg sm:text-2xl font-bold font-serif text-stone-900 mt-0.5">{documents.length}</p>
          </div>
          <div className="bg-white border border-[#E5DFD3] rounded-xl p-2.5 sm:p-4 shadow-2xs">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#164E3B]">Terindeks RAG</p>
            <p className="text-lg sm:text-2xl font-bold font-serif text-[#164E3B] mt-0.5">
              {documents.filter(d => d.status === 'indexed').length}
            </p>
          </div>
          <div className="bg-white border border-[#E5DFD3] rounded-xl p-2.5 sm:p-4 shadow-2xs">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-600">Status Korpus</p>
            <p className="text-xs sm:text-sm font-bold text-[#164E3B] mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#164E3B] inline-block"></span>
              Aktif &amp; Terjaga
            </p>
          </div>
        </div>

        {/* Filter & Daftar Dokumen */}
        <div className="bg-white border border-[#E5DFD3] rounded-2xl p-3.5 sm:p-5 shadow-2xs space-y-3.5">
          <div className="flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
            <h2 className="text-xs sm:text-sm font-bold text-stone-900 font-serif">Daftar Literatur Terindeks</h2>
            {/* Horizontal scroll untuk kategori di mobile */}
            <div className="flex overflow-x-auto pb-1 gap-1.5 w-full sm:w-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex-shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#164E3B] text-white'
                      : 'bg-[#FAF8F4] text-stone-600 hover:bg-stone-200/60 border border-[#E5DFD3]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Cari naskah kitab..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 bg-slate-50/50"
            />
          </div>

          <div className="divide-y divide-slate-100">
            {filteredDocs.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">
                Belum ada dokumen yang sesuai kriteria pencarian.
              </p>
            ) : (
              filteredDocs.map(doc => (
                <div key={doc.id} className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                  {/* Bagian Info Dokumen */}
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    <FileIcon type={doc.type} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug break-words">
                        {doc.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                        <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">{doc.size}</span>
                        <span className="text-[10px] sm:text-[11px] text-slate-300">&bull;</span>
                        <span className="text-[10px] sm:text-[11px] text-slate-500">{formatDate(new Date(doc.uploadedAt))}</span>
                        <CategoryBadge category={doc.category} />
                      </div>
                    </div>
                  </div>

                  {/* Bagian Status */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 pl-12 sm:pl-0">
                    <StatusBadge status={doc.status} />
                    {isProtectedDoc(doc.id) ? (
                      <span
                        className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg shadow-2xs"
                        title="Kitab Kurikulum Inti Pesantren (Dilindungi Sistem)"
                      >
                        <svg className="w-3 h-3 text-emerald-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Kitab Inti
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-slate-600 bg-slate-100 rounded-lg">
                        Terverifikasi
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

