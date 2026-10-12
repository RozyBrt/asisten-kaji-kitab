'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { mockDocuments } from '@/lib/mock-data';
import { UploadedDocument } from '@/lib/types';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = new Set(['pdf', 'png', 'jpg', 'jpeg', 'webp', 'doc', 'docx', 'txt']);

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

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Helper untuk memuat pdf.js di browser secara dinamis
const loadPdfJs = async () => {
  if (typeof window === 'undefined') return null;
  // @ts-expect-error global pdfjsLib
  if (window.pdfjsLib) return window.pdfjsLib;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      // @ts-expect-error global pdfjsLib
      const pdfjs = window.pdfjsLib;
      pdfjs.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(pdfjs);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const PROTECTED_DOC_IDS = ['safinatun-najah', 'fathul-qarib', 'talimul-mutaallim', 'al-kawakib-ad-durriyyah'];

function isProtectedDoc(id: string): boolean {
  if (!id) return false;
  return PROTECTED_DOC_IDS.some(p => id === p || id.startsWith(p + '-'));
}

export default function UploadUI() {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [visionProgress, setVisionProgress] = useState<{
    docName: string;
    currentPage: number;
    totalPages: number;
    stage: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Fallback ke mock jika offline
      setDocuments(mockDocuments);
    }
  }, []);

  useEffect(() => {
    fetchIndexedDocs();
  }, [fetchIndexedDocs]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processScannedPdfWithVision = async (
    file: File,
    docId: string,
    totalPages: number,
    tempDocId: string
  ) => {
    try {
      setVisionProgress({
        docName: file.name,
        currentPage: 0,
        totalPages,
        stage: 'Menyiapkan modul pembaca visual...',
      });

      const pdfjs = await loadPdfJs();
      if (!pdfjs) throw new Error('Gagal memuat modul PDF.js di browser.');

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = Math.min(pdfDoc.numPages, totalPages, 100);

      let totalIndexedChunks = 0;

      for (let i = 1; i <= numPages; i++) {
        setVisionProgress({
          docName: file.name,
          currentPage: i,
          totalPages: numPages,
          stage: `Membaca & mentranskripsikan halaman ${i} dari ${numPages} dengan AI Vision...`,
        });

        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) continue;

        await page.render({ canvasContext: ctx, viewport }).promise;
        const imageBase64 = canvas.toDataURL('image/jpeg', 0.85);

        // Kirim halaman gambar ke API RAG Vision
        const visionRes = await fetch('/api/rag', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'vision-page',
            docId,
            docName: file.name,
            pageNumber: i,
            imageBase64,
          }),
        });

        if (visionRes.ok) {
          const vData = await visionRes.json();
          totalIndexedChunks += vData.nChunks || 0;
        }
      }

      setVisionProgress(null);
      setDocuments(prev =>
        prev.map(d =>
          d.id === tempDocId
            ? { ...d, id: docId, status: 'indexed' as const, size: `${totalIndexedChunks} chunk` }
            : d
        )
      );
      setUploadSuccess(`Kitab "${file.name}" berhasil di-index dengan AI Vision (${totalIndexedChunks} chunk).`);
      setTimeout(() => setUploadSuccess(null), 8000);

    } catch (err) {
      console.error('Vision processing error:', err);
      setVisionProgress(null);
      setDocuments(prev =>
        prev.map(d => d.id === tempDocId ? { ...d, status: 'error' as const } : d)
      );
      setUploadError(`Gagal memproses visual kitab "${file.name}": ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const addFiles = async (files: File[]) => {
    const acceptedFiles = files.filter((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      return ALLOWED_FILE_EXTENSIONS.has(ext) && file.size <= MAX_FILE_SIZE_BYTES;
    });

    if (acceptedFiles.length === 0) {
      setUploadError('Pilih file berformat PDF atau Gambar (PNG/JPG/WEBP) dengan ukuran maksimal 50 MB.');
      return;
    }

    setUploadError(null);
    setUploadSuccess(null);
    setIsUploading(true);

    for (const file of acceptedFiles) {
      const tempId = `uploading-${Date.now()}-${file.name}`;
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf';
      const type: 'pdf' | 'word' | 'txt' = ext === 'pdf' ? 'pdf' : 'pdf';

      const tempDoc: UploadedDocument = {
        id: tempId,
        name: file.name,
        type,
        size: formatFileSize(file.size),
        uploadedAt: new Date(),
        status: 'indexing',
        category: 'Kajian Turats',
      };
      setDocuments(prev => [tempDoc, ...prev]);

      try {
        const form = new FormData();
        form.append('file', file);

        const res = await fetch('/api/rag', { method: 'POST', body: form });
        const data = await res.json();

        if (res.ok && data.docId) {
          if (data.needsVision) {
            // PDF terdeteksi gambar scan -> jalankan render browser per halaman
            await processScannedPdfWithVision(file, data.docId, data.totalPages || 1, tempId);
          } else {
            // Berhasil di-index langsung
            setDocuments(prev =>
              prev.map(d =>
                d.id === tempId
                  ? { ...d, id: data.docId, status: 'indexed' as const, size: `${data.nChunks} chunk` }
                  : d
              )
            );
            setUploadSuccess(`"${file.name}" berhasil di-index (${data.nChunks} chunk).`);
            setTimeout(() => setUploadSuccess(null), 6000);
          }
        } else {
          setDocuments(prev =>
            prev.map(d => d.id === tempId ? { ...d, status: 'error' as const } : d)
          );
          setUploadError(`Gagal meng-index "${file.name}": ${data.error ?? 'Unknown error'}`);
        }
      } catch (err) {
        setDocuments(prev =>
          prev.map(d => d.id === tempId ? { ...d, status: 'error' as const } : d)
        );
        setUploadError(`Gagal mengunggah file "${file.name}". ${err instanceof Error ? err.message : ''}`);
      }
    }

    setIsUploading(false);
  };

  const removeDocument = async (id: string, name: string) => {
    try {
      const res = await fetch('/api/rag', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: id }),
      });
      if (res.ok) {
        setDocuments(prev => prev.filter(d => d.id !== id));
        setUploadSuccess(`Dokumen "${name}" berhasil dihapus dari Knowledge Base.`);
        setTimeout(() => setUploadSuccess(null), 4000);
      } else {
        setUploadError(`Gagal menghapus dokumen "${name}".`);
      }
    } catch {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'Semua' || doc.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const categories = ['Semua', 'Fiqih', 'Hadits', 'Gramatika Nahwu', 'Akhlaq', 'Kajian Turats'];

  return (
    <div className="min-h-full w-full bg-slate-50 p-3 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
              Korpus Literatur Kitab (Knowledge Base RAG)
            </h1>
            <span className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold bg-slate-100 text-slate-700 rounded-full border border-slate-200 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Modul RAG Terindeks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Kelola dan telusuri korpus naskah kitab kuning dan literatur turats yang diintegrasikan ke dalam basis rujukan ilmiah.
          </p>
        </div>

        {/* Notifikasi Sukses / Error */}
        {uploadSuccess && (
          <div className="p-2.5 sm:p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2 font-medium">
              <svg className="w-4 h-4 text-emerald-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {uploadSuccess}
            </span>
            <button onClick={() => setUploadSuccess(null)} className="text-emerald-600 hover:text-emerald-800 p-1">
              &times;
            </button>
          </div>
        )}
        {uploadError && (
          <div className="p-2.5 sm:p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs sm:text-sm flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2 font-medium">
              <svg className="w-4 h-4 text-rose-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              {uploadError}
            </span>
            <button onClick={() => setUploadError(null)} className="text-rose-600 hover:text-rose-800 p-1">
              &times;
            </button>
          </div>
        )}

        {/* Live Progress Bar untuk AI Vision */}
        {visionProgress && (
          <div className="p-3.5 sm:p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl shadow-xs space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Transkripsi AI Vision Berjalan
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-800">
                {visionProgress.currentPage} / {visionProgress.totalPages} Halaman
              </span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-0.5 truncate">{visionProgress.docName}</p>
              <p className="text-[11px] text-emerald-700">{visionProgress.stage}</p>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${Math.min(100, (visionProgress.currentPage / Math.max(1, visionProgress.totalPages)) * 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Statistik Kompak di Mobile */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 sm:p-4 shadow-xs">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">Total Naskah</p>
            <p className="text-lg sm:text-2xl font-bold text-slate-900 mt-0.5">{documents.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 sm:p-4 shadow-xs">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-800">Terindeks</p>
            <p className="text-lg sm:text-2xl font-bold text-emerald-800 mt-0.5">
              {documents.filter(d => d.status === 'indexed').length}
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-2.5 sm:p-4 shadow-xs">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-800">Proses</p>
            <p className="text-lg sm:text-2xl font-bold text-amber-800 mt-0.5">
              {isUploading ? documents.filter(d => d.status === 'indexing').length : 0}
            </p>
          </div>
        </div>

        {/* Dropzone Upload */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-2xl p-5 sm:p-8 text-center transition-all duration-200 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-slate-300 bg-white hover:border-slate-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.txt"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-2.5 text-emerald-800 shadow-xs">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-0.5">
            Unggah Berkas Naskah Kitab
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-500 mb-3 max-w-sm mx-auto">
            Mendukung dokumen PDF teks atau naskah digital hingga 100 halaman (Maks. 50 MB).
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            {isUploading ? 'Sedang Memproses...' : '+ Pilih File Kitab'}
          </button>
        </div>

        {/* Filter & Daftar Dokumen */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3.5">
          <div className="flex flex-col sm:flex-row gap-2.5 justify-between items-start sm:items-center">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900">Dokumen Terindeks</h2>
            {/* Horizontal scroll untuk kategori di mobile */}
            <div className="flex overflow-x-auto pb-1 gap-1.5 w-full sm:w-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex-shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-emerald-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                  {/* Bagian Info Dokumen (Judul Lengkap Tanpa Terpotong M./F..) */}
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

                  {/* Bagian Status & Aksi (Sejajar rapi di mobile) */}
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
                      <button
                        onClick={() => removeDocument(doc.id, doc.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Hapus Dokumen"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
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
