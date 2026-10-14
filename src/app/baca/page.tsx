'use client';

import React, { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Script from 'next/script';

function PdfReader() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialPage = parseInt(searchParams.get('page') || '13', 10);
  const [currentPage, setCurrentPage] = useState<number>(isNaN(initialPage) ? 13 : Math.max(1, Math.min(284, initialPage)));
  const [totalPages, setTotalPages] = useState<number>(284);
  const [scale, setScale] = useState<number>(1.2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Hitung nomor halaman kitab (Halaman PDF = Halaman Kitab + 12)
  const bookPage = currentPage > 12 ? currentPage - 12 : `Romawi (${currentPage})`;

  // Update query string di URL tanpa reload halaman
  const updateUrlPage = useCallback((newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(newPage));
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, []);

  // Inisialisasi dokumen PDF
  useEffect(() => {
    if (!scriptLoaded) return;
    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) return;

    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';

    let isMounted = true;
    setIsLoading(true);

    const loadingTask = pdfjsLib.getDocument({
      url: '/api/pdf',
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
    });

    loadingTask.promise.then(
      (pdf: any) => {
        if (!isMounted) return;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages || 284);
        renderPage(currentPage, pdf);
      },
      (err: any) => {
        console.error('Error loading PDF document:', err);
        if (isMounted) {
          setRenderError('Gagal memuat berkas naskah PDF. Silakan muat ulang halaman.');
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
    };
  }, [scriptLoaded]);

  // Render halaman tertentu ke Canvas
  const renderPage = useCallback((num: number, pdfInstance?: any) => {
    const pdf = pdfInstance || pdfDocRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas) return;

    setIsLoading(true);
    setRenderError(null);

    // Batalkan task render sebelumnya jika masih berjalan
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {}
    }

    pdf.getPage(num).then((page: any) => {
      const context = canvas.getContext('2d');
      if (!context) return;

      // Otomatis sesuaikan scale dengan lebar layar (terutama untuk smartphone)
      const containerWidth = Math.min(window.innerWidth - 32, 900);
      const unscaledViewport = page.getViewport({ scale: 1.0 });
      const responsiveScale = Math.min(Math.max((containerWidth / unscaledViewport.width) * scale, 0.75), 2.5);

      const viewport = page.getViewport({ scale: responsiveScale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;

      task.promise.then(
        () => {
          setIsLoading(false);
          // Scroll halus ke atas canvas saat berganti halaman
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        (err: any) => {
          if (err?.name !== 'RenderingCancelledException') {
            console.error('Render error:', err);
            setIsLoading(false);
          }
        }
      );
    });
  }, [scale]);

  // Trigger render saat currentPage berubah
  const goToPage = (newPage: number) => {
    const validPage = Math.max(1, Math.min(totalPages, newPage));
    setCurrentPage(validPage);
    updateUrlPage(validPage);
    renderPage(validPage);
  };

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  // Swipe navigation untuk layar sentuh HP
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartXRef.current - touchEndX;

    if (Math.abs(diffX) > 60) {
      if (diffX > 0) {
        handleNext(); // Geser kiri -> Halaman berikutnya
      } else {
        handlePrev(); // Geser kanan -> Halaman sebelumnya
      }
    }
    touchStartXRef.current = null;
  };

  // Keyboard navigation untuk desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') handleNext();
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      <Script
        src="/pdfjs/pdf.min.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      {/* STICKY TOPBAR NAVIGASI RUJUKAN */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-emerald-800/60 px-3 py-2.5 sm:px-6 sm:py-3 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          
          {/* Sisi Kiri: Judul Kitab & Tombol Kembali */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="Kembali ke Ruang Chat Kajian"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              <span className="hidden sm:inline">Kajian</span>
            </button>

            <div>
              <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-[180px] sm:max-w-xs">
                Intisari Al-Kawakib Al-Durriyyah
              </h1>
              <p className="text-[10px] text-emerald-400 font-medium">
                Dayah Perbatasan Minhajussalam • 284 Hal.
              </p>
            </div>
          </div>

          {/* Sisi Tengah: Kontrol Pindah Halaman */}
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700/60">
            <button
              onClick={handlePrev}
              disabled={currentPage <= 1 || isLoading}
              className="p-1 sm:p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors cursor-pointer"
              title="Halaman Sebelumnya (Panah Kiri)"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="text-center px-1 sm:px-2">
              <span className="text-xs sm:text-sm font-bold text-emerald-300">
                Hal. {bookPage}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 block -mt-0.5">
                (PDF {currentPage} / {totalPages})
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage >= totalPages || isLoading}
              className="p-1 sm:p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors cursor-pointer"
              title="Halaman Berikutnya (Panah Kanan)"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Sisi Kanan: Zoom & Unduh */}
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden md:flex items-center gap-1 bg-slate-800/60 px-1.5 py-1 rounded-lg border border-slate-700/50">
              <button
                onClick={() => setScale(s => Math.max(0.8, s - 0.2))}
                className="px-2 py-0.5 text-xs text-slate-300 hover:text-white rounded hover:bg-slate-700"
                title="Perkecil Tampilan"
              >
                -
              </button>
              <span className="text-[10px] text-slate-400 font-mono w-10 text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale(s => Math.min(2.2, s + 0.2))}
                className="px-2 py-0.5 text-xs text-slate-300 hover:text-white rounded hover:bg-slate-700"
                title="Perbesar Tampilan"
              >
                +
              </button>
            </div>

            <a
              href="/api/pdf?download=1"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              title="Unduh seluruh file PDF (1.69 MB)"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.5V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span className="hidden sm:inline">Unduh PDF</span>
            </a>
          </div>

        </div>
      </header>

      {/* AREA UTAMA PEMBACA NASKAH KITAB */}
      <main 
        className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 overflow-x-auto relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-emerald-300 font-medium tracking-wide">
              Membuka Halaman {currentPage} Naskah Al-Kawakib...
            </p>
          </div>
        )}

        {/* Error Alert */}
        {renderError && (
          <div className="my-8 p-4 bg-rose-950/80 border border-rose-700 text-rose-200 rounded-xl text-xs max-w-md text-center">
            {renderError}
          </div>
        )}

        {/* Paper Canvas Container */}
        <div className="bg-white rounded-xl shadow-2xl p-1 sm:p-2 border border-slate-300 max-w-full overflow-hidden transition-all duration-300">
          <canvas
            ref={canvasRef}
            className="block max-w-full h-auto rounded-lg mx-auto"
          />
        </div>

        {/* Petunjuk Interaksi Layar Sentuh Mobile */}
        <div className="mt-4 text-center text-slate-500 text-[11px] sm:text-xs">
          <span className="hidden sm:inline">Gunakan tombol panah keyboard atau kontrol di atas untuk membalik halaman.</span>
          <span className="sm:hidden">Geser (swipe) layar ke kiri atau kanan untuk membalik halaman.</span>
        </div>
      </main>
    </div>
  );
}

export default function BacaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PdfReader />
    </Suspense>
  );
}
