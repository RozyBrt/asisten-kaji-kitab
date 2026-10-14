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
  
  // Tampilan cerdas: default 'fit-height' untuk layar desktop/laptop agar pas satu halaman tanpa scroll berlebih
  // dan 'fit-width' untuk smartphone agar teks mudah terbaca
  const [viewMode, setViewMode] = useState<'fit-height' | 'fit-width'>('fit-height');
  const [zoomMultiplier, setZoomMultiplier] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Jump page input modal/toggle
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [jumpPageVal, setJumpPageVal] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Deteksi ukuran layar awal untuk memilih default view mode yang paling pas
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        setViewMode('fit-width');
      } else {
        setViewMode('fit-height');
      }
    }
  }, []);

  // Hitung nomor halaman kitab asli (Halaman PDF = Halaman Kitab + 12)
  const bookPage = currentPage > 12 ? currentPage - 12 : `Romawi (${currentPage})`;

  // Update query string di URL tanpa reload halaman
  const updateUrlPage = useCallback((newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(newPage));
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, []);

  // Render halaman tertentu ke Canvas dengan skala yang pas dan resolusi tajam (HiDPI / DPR)
  const renderPage = useCallback((num: number, pdfInstance?: any) => {
    const pdf = pdfInstance || pdfDocRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas) return;

    setIsLoading(true);
    setRenderError(null);

    // Batalkan render sebelumnya jika masih berjalan
    if (renderTaskRef.current) {
      try {
        renderTaskRef.current.cancel();
      } catch {}
    }

    pdf.getPage(num).then((page: any) => {
      const context = canvas.getContext('2d');
      if (!context) return;

      const unscaledViewport = page.getViewport({ scale: 1.0 });

      // Hitung dimensi layar yang tersedia
      // Header ~56px + margin atas/bawah ~48px = ~104px
      const availableHeight = Math.max(window.innerHeight - 110, 360);
      const availableWidth = Math.max(window.innerWidth - 32, 280);

      // 1. Skala untuk 'fit-height' (Pas satu halaman tinggi layar - ideal laptop/desktop)
      const scaleFitHeight = availableHeight / unscaledViewport.height;

      // 2. Skala untuk 'fit-width' (Pas lebar layar - ideal HP smartphone)
      // Pada desktop, kita batasi max lebar bacaan ke 750px agar tidak melebar berlebihan
      const maxReadableWidth = window.innerWidth >= 1024 ? Math.min(availableWidth, 750) : availableWidth;
      const scaleFitWidth = maxReadableWidth / unscaledViewport.width;

      const baseScale = viewMode === 'fit-height' ? scaleFitHeight : scaleFitWidth;
      const displayScale = Math.max(0.4, Math.min(3.0, baseScale * zoomMultiplier));

      // HiDPI (Device Pixel Ratio) agar teks Arab dan latin setajam naskah asli
      const dpr = Math.max(window.devicePixelRatio || 1, 1);
      const renderViewport = page.getViewport({ scale: displayScale * dpr });

      canvas.width = Math.floor(renderViewport.width);
      canvas.height = Math.floor(renderViewport.height);

      const cssWidth = Math.floor(renderViewport.width / dpr);
      const cssHeight = Math.floor(renderViewport.height / dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;

      const renderContext = {
        canvasContext: context,
        viewport: renderViewport,
      };

      const task = page.render(renderContext);
      renderTaskRef.current = task;

      task.promise.then(
        () => {
          setIsLoading(false);
          // Scroll halus ke atas jika dalam mode pas lebar
          if (viewMode === 'fit-width') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        },
        (err: any) => {
          if (err?.name !== 'RenderingCancelledException') {
            console.error('Render error:', err);
            setIsLoading(false);
          }
        }
      );
    }).catch((err: any) => {
      console.error('PDF getPage error:', err);
      setIsLoading(false);
      setRenderError('Gagal memuat halaman naskah.');
    });
  }, [viewMode, zoomMultiplier]);

  // Inisialisasi dokumen PDF setelah script PDF.js dimuat
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

  // Re-render canvas secara otomatis saat viewMode, zoomMultiplier, atau currentPage berubah
  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(currentPage);
    }
  }, [currentPage, viewMode, zoomMultiplier, renderPage]);

  // Otomatis sesuaikan ukuran saat jendela browser di-resize (responsif)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (pdfDocRef.current) {
          renderPage(currentPage);
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [currentPage, renderPage]);

  // Navigasi halaman
  const goToPage = (newPage: number) => {
    const validPage = Math.max(1, Math.min(totalPages, newPage));
    setCurrentPage(validPage);
    updateUrlPage(validPage);
  };

  const handlePrev = () => goToPage(currentPage - 1);
  const handleNext = () => goToPage(currentPage + 1);

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpPageVal, 10);
    if (!isNaN(target)) {
      goToPage(target);
    }
    setIsJumping(false);
  };

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
      // Abaikan jika sedang mengetik di input lompat halaman
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') handleNext();
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') handlePrev();
      if (e.key === 'f' || e.key === 'F') {
        setViewMode(m => m === 'fit-height' ? 'fit-width' : 'fit-height');
      }
      if (e.key === '+' || e.key === '=') {
        setZoomMultiplier(z => Math.min(2.5, Math.round((z + 0.15) * 100) / 100));
      }
      if (e.key === '-') {
        setZoomMultiplier(z => Math.max(0.5, Math.round((z - 0.15) * 100) / 100));
      }
      if (e.key === '0') {
        setZoomMultiplier(1.0);
      }
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
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-emerald-800/60 px-3 py-2 sm:px-6 sm:py-2.5 shadow-lg">
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
              <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate max-w-[170px] sm:max-w-xs">
                Intisari Al-Kawakib Al-Durriyyah
              </h1>
              <p className="text-[10px] text-emerald-400 font-medium">
                Dayah Perbatasan Minhajussalam • 284 Hal.
              </p>
            </div>
          </div>

          {/* Sisi Tengah: Kontrol Pindah Halaman & Lompat Cepat */}
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-800/90 px-2 py-1 rounded-xl border border-slate-700/70 shadow-xs">
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

            {/* Indikator Halaman (Bisa diklik untuk lompat langsung) */}
            {isJumping ? (
              <form onSubmit={handleJumpSubmit} className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  autoFocus
                  defaultValue={currentPage}
                  onChange={(e) => setJumpPageVal(e.target.value)}
                  onBlur={() => setIsJumping(false)}
                  className="w-14 bg-slate-950 border border-emerald-500 rounded px-1.5 py-0.5 text-xs text-center text-white focus:outline-hidden"
                />
                <button type="submit" className="text-[10px] bg-emerald-700 hover:bg-emerald-600 px-1.5 py-0.5 rounded text-white">
                  Go
                </button>
              </form>
            ) : (
              <div 
                onClick={() => {
                  setJumpPageVal(String(currentPage));
                  setIsJumping(true);
                }}
                className="text-center px-1 sm:px-2 cursor-pointer hover:bg-slate-700/50 py-0.5 rounded transition-colors"
                title="Klik untuk lompat ke nomor halaman tertentu"
              >
                <span className="text-xs sm:text-sm font-bold text-emerald-300 block leading-tight">
                  Hal. {bookPage}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 block -mt-0.5">
                  (PDF {currentPage} / {totalPages})
                </span>
              </div>
            )}

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

          {/* Sisi Kanan: Mode Tampilan, Zoom & Unduh */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Tombol Toggle Mode: Pas Layar (Tinggi) vs Pas Lebar */}
            <button
              onClick={() => {
                setViewMode(m => m === 'fit-height' ? 'fit-width' : 'fit-height');
                setZoomMultiplier(1.0);
              }}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/70 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title={viewMode === 'fit-height' ? 'Ganti ke Mode Pas Lebar (Teks lebih besar)' : 'Ganti ke Mode Pas Layar (Pas satu halaman utuh)'}
            >
              {viewMode === 'fit-height' ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                  <span>Pas Lebar</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                  </svg>
                  <span>Pas Layar</span>
                </>
              )}
            </button>

            {/* Kontrol Zoom Bertingkat (- / + / Reset) */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-800/90 px-1 py-0.5 rounded-lg border border-slate-700/60">
              <button
                onClick={() => setZoomMultiplier(z => Math.max(0.5, Math.round((z - 0.15) * 100) / 100))}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
                title="Perkecil Tampilan (Tombol -)"
              >
                -
              </button>
              <button
                onClick={() => setZoomMultiplier(1.0)}
                className="px-1 text-[11px] font-mono text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer min-w-[36px] text-center"
                title="Klik untuk reset zoom ke 100%"
              >
                {Math.round(zoomMultiplier * 100)}%
              </button>
              <button
                onClick={() => setZoomMultiplier(z => Math.min(2.5, Math.round((z + 0.15) * 100) / 100))}
                className="w-6 h-6 flex items-center justify-center text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer"
                title="Perbesar Tampilan (Tombol +)"
              >
                +
              </button>
            </div>

            {/* Tombol Unduh PDF Asli */}
            <a
              href="/api/pdf?download=1"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              title="Unduh seluruh file PDF"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.5V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span className="hidden md:inline">Unduh PDF</span>
            </a>

          </div>

        </div>
      </header>

      {/* AREA UTAMA PEMBACA NASKAH KITAB */}
      <main 
        className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 overflow-auto relative"
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

        {/* Paper Canvas Container (Berbentuk lembar kitab elegan dengan bayangan realistis) */}
        <div className="bg-white rounded-md shadow-2xl p-1 sm:p-1.5 border border-slate-300/80 max-w-full overflow-hidden transition-all duration-200 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="block rounded-xs mx-auto"
          />
        </div>

        {/* Petunjuk Interaksi */}
        <div className="mt-3 text-center text-slate-500 text-[11px] sm:text-xs">
          <span className="hidden sm:inline">
            Gunakan panah keyboard (← / →) untuk ganti halaman • Tekan 'F' untuk toggle Pas Layar / Pas Lebar • Tekan '0' untuk reset zoom
          </span>
          <span className="sm:hidden">
            Geser (swipe) layar ke kiri/kanan untuk ganti halaman • Klik nomor halaman untuk melompat
          </span>
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
