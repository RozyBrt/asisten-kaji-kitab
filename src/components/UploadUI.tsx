'use client';

import React, { useState, useRef } from 'react';
import { mockDocuments } from '@/lib/mock-data';
import { UploadedDocument } from '@/lib/types';

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const ALLOWED_FILE_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'txt']);

function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function FileIcon({ type }: { type: string }) {
  const colors: Record<string, string> = {
    pdf: 'from-rose-500 to-rose-600',
    word: 'from-blue-500 to-blue-600',
    txt: 'from-slate-500 to-slate-600',
  };
  const labels: Record<string, string> = { pdf: 'PDF', word: 'DOC', txt: 'TXT' };

  return (
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[type] || colors.txt} flex items-center justify-center shadow-md`}>
      <span className="text-[10px] font-bold text-white">{labels[type] || 'FILE'}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: UploadedDocument['status'] }) {
  const styles: Record<string, string> = {
    indexed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    indexing: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-rose-100 text-rose-700 border-rose-200',
  };
  const labels: Record<string, string> = {
    indexed: '✓ Terindeks',
    indexing: '⟳ Mengindeks...',
    error: '✗ Gagal',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold border rounded-full ${styles[status]}`}>
      {status === 'indexing' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse-gentle mr-1" />}
      {labels[status]}
    </span>
  );
}

function CategoryBadge({ category }: { category?: string }) {
  if (!category) return null;
  const colors: Record<string, string> = {
    Fiqih: 'bg-emerald-50 text-emerald-700',
    Akhlaq: 'bg-purple-50 text-purple-700',
    Tasawuf: 'bg-blue-50 text-blue-700',
    Hadits: 'bg-amber-50 text-amber-700',
    Tafsir: 'bg-rose-50 text-rose-700',
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${colors[category] || 'bg-slate-50 text-slate-600'}`}>
      {category}
    </span>
  );
}

export default function UploadUI() {
  const [documents, setDocuments] = useState<UploadedDocument[]>(mockDocuments);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const addFiles = (files: File[]) => {
    const acceptedFiles = files.filter((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      return ALLOWED_FILE_EXTENSIONS.has(ext) && file.size <= MAX_FILE_SIZE_BYTES;
    });
    const unsupportedCount = files.filter((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      return !ALLOWED_FILE_EXTENSIONS.has(ext);
    }).length;
    const oversizedCount = files.filter((file) => file.size > MAX_FILE_SIZE_BYTES).length;

    if (unsupportedCount || oversizedCount) {
      const issues = [
        unsupportedCount ? `${unsupportedCount} file berformat tidak didukung` : '',
        oversizedCount ? `${oversizedCount} file melebihi batas 50 MB` : '',
      ].filter(Boolean);
      setUploadError(`${issues.join(' dan ')}; file tersebut tidak ditambahkan.`);
    } else {
      setUploadError(null);
    }

    if (acceptedFiles.length === 0) return;

    const newDocs: UploadedDocument[] = acceptedFiles.map((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let type: 'pdf' | 'word' | 'txt' = 'txt';
      if (ext === 'pdf') type = 'pdf';
      else if (ext === 'doc' || ext === 'docx') type = 'word';

      return {
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        type,
        size: formatFileSize(file.size),
        uploadedAt: new Date(),
        status: 'indexing',
        category: 'Fiqih',
      };
    });

    setDocuments(prev => [...newDocs, ...prev]);

    // Simulate indexing completion after delay
    setTimeout(() => {
      setDocuments(prev =>
        prev.map(doc =>
          newDocs.some(nd => nd.id === doc.id)
            ? { ...doc, status: 'indexed' as const }
            : doc
        )
      );
    }, 3000);
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const indexedCount = documents.filter(d => d.status === 'indexed').length;
  const indexingCount = documents.filter(d => d.status === 'indexing').length;

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold gradient-text mb-1">Panel Unggah Dokumen Kitab</h2>
        <p className="text-sm text-slate-500">
          Unggah file kitab (PDF/Word/TXT) untuk diindeks ke dalam sistem Knowledge Base RAG.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Dokumen', value: documents.length, icon: '📚', color: 'emerald' },
          { label: 'Terindeks', value: indexedCount, icon: '✓', color: 'emerald' },
          { label: 'Sedang Proses', value: indexingCount, icon: '⟳', color: 'amber' },
        ].map((stat, idx) => (
          <div key={idx} className="p-4 bg-white border border-emerald-100 rounded-xl shadow-sm card-hover">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{stat.icon}</span>
              <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
          ${isDragging
            ? 'border-emerald-400 bg-emerald-50/50 scale-[1.01]'
            : 'border-slate-200 bg-white/50 hover:border-emerald-300 hover:bg-emerald-50/30'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <p className="text-sm font-semibold text-slate-700 mb-1">
          Seret & Lepas file kitab ke sini
        </p>
        <p className="text-xs text-slate-400 mb-4">
          Atau klik tombol di bawah untuk memilih file
        </p>

        <button
          id="btn-upload-file"
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl
                     font-semibold text-sm hover:from-emerald-700 hover:to-emerald-800
                     shadow-lg shadow-emerald-200 transition-all btn-press inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Pilih File
        </button>

        <p className="text-[10px] text-slate-400 mt-3">
          Format: PDF, DOC, DOCX, TXT • Maks. 50 MB per file
        </p>
      </div>
      {uploadError && (
        <p role="alert" className="-mt-4 text-xs font-medium text-rose-700" aria-live="polite">
          {uploadError}
        </p>
      )}

      {/* Document List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-700">Dokumen Terindeks</h3>
          <span className="text-[10px] text-slate-400">{documents.length} dokumen</span>
        </div>

        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl
                         hover:border-emerald-200 hover:shadow-sm transition-all duration-200 group"
            >
              <FileIcon type={doc.type} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-slate-700 truncate">{doc.name}</p>
                  <CategoryBadge category={doc.category} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400">{doc.size}</span>
                  {doc.pages && <span className="text-[11px] text-slate-400">{doc.pages} hal.</span>}
                  <span className="text-[11px] text-slate-400">{formatDate(doc.uploadedAt)}</span>
                </div>
              </div>

              <StatusBadge status={doc.status} />

              <button
                onClick={() => removeDocument(doc.id)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 
                           opacity-0 group-hover:opacity-100 transition-all duration-200"
                title="Hapus dokumen"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
