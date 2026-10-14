'use client';

import React, { useState } from 'react';

type TabKey = 'disclaimer' | 'knowledge' | 'demo' | 'arsitektur';

export default function PanduanDisclaimerUI() {
  const [activeTab, setActiveTab] = useState<TabKey>('disclaimer');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#FBF9F5] overflow-y-auto overscroll-contain text-stone-800">
      {/* Editorial Scholarly Header */}
      <div className="bg-[#12241E] text-stone-100 px-6 py-7 sm:px-8 sm:py-8 border-b border-[#233C33] flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          {/* Scholarly Rubric Metadata */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3 text-[11px] tracking-widest uppercase font-semibold text-[#C5A059]">
            <span>Risalah Metodologi &amp; Manhaj Korpus</span>
            <span className="text-stone-500 font-normal">&bull;</span>
            <span className="text-stone-300">Dayah Perbatasan Minhajussalam</span>
            <span className="text-stone-500 font-normal">&bull;</span>
            <span className="text-stone-400 font-mono">1447 H / 2026 M</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-2 font-serif">
            Panduan Sistem, Manhaj Korpus &amp; Catatan Etika Keilmuan
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
            Dokumentasi formal mengenai batas epistemologis kecerdasan buatan, metodologi penambatan korpus <em>Al-Kawakib Al-Durriyyah</em> (Retrieval-Augmented Generation), serta protokol pengujian ilmiah bagi dewan juri dan pemerhati turats.
          </p>

          {/* Understated Nav Tabs (Anti-Slop: clean SVG, no noisy emojis) */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[#233C33]">
            <button
              onClick={() => setActiveTab('disclaimer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'disclaimer'
                  ? 'bg-[#1C3A31] text-[#E8D7B0] border border-[#C5A059]/40 shadow-2xs font-semibold'
                  : 'bg-transparent text-stone-300 hover:bg-[#1A332B] hover:text-white border border-transparent'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              I. Manhaj &amp; Batasan Sistem
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'knowledge'
                  ? 'bg-[#1C3A31] text-[#E8D7B0] border border-[#C5A059]/40 shadow-2xs font-semibold'
                  : 'bg-transparent text-stone-300 hover:bg-[#1A332B] hover:text-white border border-transparent'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
              </svg>
              II. Korpus Al-Kawakib
            </button>

            <button
              onClick={() => setActiveTab('demo')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'demo'
                  ? 'bg-[#1C3A31] text-[#E8D7B0] border border-[#C5A059]/40 shadow-2xs font-semibold'
                  : 'bg-transparent text-stone-300 hover:bg-[#1A332B] hover:text-white border border-transparent'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              III. Protokol Uji Dewan Juri
            </button>

            <button
              onClick={() => setActiveTab('arsitektur')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                activeTab === 'arsitektur'
                  ? 'bg-[#1C3A31] text-[#E8D7B0] border border-[#C5A059]/40 shadow-2xs font-semibold'
                  : 'bg-transparent text-stone-300 hover:bg-[#1A332B] hover:text-white border border-transparent'
              }`}
            >
              <svg className="w-3.5 h-3.5 text-[#C5A059]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
              </svg>
              IV. Arsitektur Rekayasa RAG
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 p-5 sm:p-7 lg:p-9 max-w-5xl mx-auto w-full space-y-6">
        
        {/* TAB 1: MANHAJ & DISCLAIMER */}
        {activeTab === 'disclaimer' && (
          <div className="space-y-6">
            {/* Primary Manuscript Callout */}
            <div className="bg-[#FCFAF6] border border-[#E7DFC6] rounded-xl p-5 sm:p-6 shadow-2xs relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[#8B1E24]" />
              <div className="pl-2 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[#8B1E24] text-xs font-bold tracking-wider uppercase">
                    &bull; Tanbih Epistemologis &amp; Kedudukan Alat Bantu
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                  Pernyataan Batasan Kodifikasi AI &amp; Adab Keilmuan Islam
                </h2>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  Sistem <strong>Asisten Kaji Kitab &amp; Turats</strong> dibangun murni sebagai instrumen bantu telaah digital <em>(Khadim at-Tahqiq / Research Companion)</em> untuk mempercepat pencarian leksikal, rekonstruksi pembacaan lembaran kitab kuning fisik, dan penelusuran sanad kaidah gramatika Arab. Sistem ini <strong>bukan sumber otoritas hukum independen</strong> dan tunduk pada adab transmisi keilmuan pesantren.
                </p>
              </div>
            </div>

            {/* 4 Pillars with Semantic Hierarchy (Not 4 identical copy-paste boxes) */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Empat Pilar Integritas Metodologi:
              </h3>

              {/* Pillar 1: Primary Theological Anchor (Featured Treatment) */}
              <div className="bg-white border border-[#E2DDD3] rounded-xl p-5 shadow-2xs space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-[#164E3B]">
                    <span className="w-6 h-6 rounded-md bg-[#164E3B]/10 text-[#164E3B] font-mono font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <h4 className="text-sm font-bold font-serif text-stone-900">
                      Bukan Otoritas Fatwa Syariat &amp; Bukan Pengganti Majelis Guru
                    </h4>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#8B1E24] bg-[#8B1E24]/10 px-2 py-0.5 rounded">
                    Ketentuan Mutlak
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed pl-8">
                  Model komputasi bahasa alami tidak memiliki kelayakan spiritual maupun epistemologis sebagai <em>Mufti</em>. Pemaknaan teks agama, istinbath hukum, dan penerapan kaidah kontekstual mutlak berpulang pada bimbingan para masyaikh, dewan guru, dan ulama muktamad pemegang sanad naskah turats.
                </p>
              </div>

              {/* Pillar 2 & 3: Computational Reality (Two balanced columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-[#E2DDD3] rounded-xl p-5 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2.5 text-[#164E3B]">
                    <span className="w-6 h-6 rounded-md bg-[#164E3B]/10 text-[#164E3B] font-mono font-bold flex items-center justify-center text-xs">
                      2
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">
                      Sifat Probabilistik Model Bahasa (LLM)
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pl-8">
                    Model AI merangkai kalimat atas dasar probabilitas distribusi bahasa. Meskipun sistem telah diikat secara deterministik <em>(grounded)</em> pada korpus <em>Al-Kawakib</em>, variasi gaya prompt pengguna dapat menimbulkan variasi artikulasi. Oleh sebab itu, tombol verifikasi naskah fisik PDF selalu disertakan sebagai rujukan primer.
                  </p>
                </div>

                <div className="bg-white border border-[#E2DDD3] rounded-xl p-5 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2.5 text-[#164E3B]">
                    <span className="w-6 h-6 rounded-md bg-[#164E3B]/10 text-[#164E3B] font-mono font-bold flex items-center justify-center text-xs">
                      3
                    </span>
                    <h4 className="text-sm font-bold text-stone-900">
                      Limitasi Fisik Citra Naskah (Vision OCR)
                    </h4>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed pl-8">
                    Kecermatan pembacaan OCR dipengaruhi oleh kualitas foto (sudut kemiringan, bayangan santri saat memotret, serta kertas kitab yang menguning atau terkena rembesan tinta cetak batu). Hasil transkripsi aksara Arab disajikan sebagai telaah mula-mula yang wajib di-<em>tashih</em> ulang.
                  </p>
                </div>
              </div>

              {/* Pillar 4: Academic Transparency */}
              <div className="bg-[#FAF8F3] border border-[#E7DFC6] rounded-xl p-5 shadow-2xs space-y-2">
                <div className="flex items-center gap-2.5 text-stone-800">
                  <span className="w-6 h-6 rounded-md bg-stone-200 text-stone-800 font-mono font-bold flex items-center justify-center text-xs">
                    4
                  </span>
                  <h4 className="text-sm font-bold text-stone-900">
                    Transparansi Metodologis Riset Karya Ilmiah
                  </h4>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed pl-8">
                  Penyusunan halaman catatan etika ini merupakan manifestasi kejujuran akademik peserta lomba karya ilmiah. Sistem kecerdasan buatan yang unggul bukanlah yang mengklaim kesempurnaan tanpa cela, melainkan yang secara presisi mendefinisikan batas-batas fungsionalitas dan akuntabilitas ilmiahnya.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KNOWLEDGE BASE KITAB */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            {/* Codex Header Sheet */}
            <div className="bg-white border border-[#E2DDD3] rounded-xl p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#164E3B] bg-[#164E3B]/8 px-2.5 py-0.5 rounded border border-[#164E3B]/20">
                    Naskah Indeks Kanonikal
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-serif pt-1">
                    Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah Al-Jurumiyyah
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-stone-600 pt-0.5">
                    <span>Penulis: <strong className="text-stone-900 font-semibold">Iswandi El-Nisamy</strong></span>
                    <span className="text-stone-300">&bull;</span>
                    <span>Editor: <strong className="text-stone-900 font-semibold">Tgk. Dr. Safriadi, MA.</strong></span>
                    <span className="text-stone-300">&bull;</span>
                    <span>Penerbit: <span className="text-stone-700">CV. Manhaji Medan (Cet. I, Maret 2020)</span></span>
                    <span className="text-stone-300">&bull;</span>
                    <span className="text-[#164E3B] font-medium">Digitalisasi: Dayah Perbatasan Minhajussalam</span>
                  </div>
                </div>

                <a
                  href="/baca?page=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#164E3B] hover:bg-[#123E2F] text-[#FAF6EE] rounded-lg text-xs font-semibold shadow-2xs flex items-center gap-2 transition-colors self-start sm:self-auto flex-shrink-0"
                >
                  <svg className="w-4 h-4 text-[#C5A059]" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Buka Naskah PDF (284 Halaman)
                </a>
              </div>

              {/* Scholarly Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#FBF9F5] border border-[#E7DFC6] rounded-lg text-center">
                  <p className="text-2xl font-bold font-serif text-[#164E3B]">284</p>
                  <p className="text-[11px] font-medium text-stone-600 mt-0.5">Total Halaman Dokumen</p>
                </div>
                <div className="p-3.5 bg-[#FBF9F5] border border-[#E7DFC6] rounded-lg text-center">
                  <p className="text-2xl font-bold font-serif text-[#164E3B]">272</p>
                  <p className="text-[11px] font-medium text-stone-600 mt-0.5">Halaman Materi Naskah</p>
                </div>
                <div className="p-3.5 bg-[#FBF9F5] border border-[#E7DFC6] rounded-lg text-center">
                  <p className="text-2xl font-bold font-serif text-[#164E3B]">35</p>
                  <p className="text-[11px] font-medium text-stone-600 mt-0.5">Bab Kaidah Terpetakan</p>
                </div>
                <div className="p-3.5 bg-[#FBF9F5] border border-[#E7DFC6] rounded-lg text-center">
                  <p className="text-2xl font-bold font-serif text-[#164E3B]">558</p>
                  <p className="text-[11px] font-medium text-stone-600 mt-0.5">Vektor Segmen Korpus</p>
                </div>
              </div>

              {/* Indexed Chapters Scope */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Cakupan Bab &amp; Fasal Nahwu yang Telah Terpetakan:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs text-stone-700">
                  {[
                    { title: "Bab Kalam & Pembagian Kalimat", hal: "Hal. 1–3" },
                    { title: "Bab I'rab & Tanda-Tandanya", hal: "Hal. 4–22" },
                    { title: "Bab Fa'il & Na'ibul Fa'il", hal: "Hal. 46–56" },
                    { title: "Bab Mubtada & Khabar", hal: "Hal. 57–75" },
                    { title: "Nawasikh: Kaana & Inna", hal: "Hal. 76–103" },
                    { title: "Af'alul Qulub / Zhanna", hal: "Hal. 104–112" },
                    { title: "Maf'ul Bih & Maf'ul Muthlaq", hal: "Hal. 120–136" },
                    { title: "Bab Hal, Tamyiz & Mustatsna", hal: "Hal. 142–167" },
                    { title: "Makhfudhatul Asma / Huruf Jar", hal: "Hal. 250–272" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-[#FAF8F3] rounded-lg border border-[#E7DFC6] flex items-center justify-between gap-2">
                      <span className="font-medium text-stone-800 truncate">{item.title}</span>
                      <span className="text-[10px] font-mono text-stone-500 whitespace-nowrap bg-white px-1.5 py-0.5 rounded border border-stone-200">
                        {item.hal}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PANDUAN PENGUJIAN DEWAN JURI */}
        {activeTab === 'demo' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E2DDD3] rounded-xl p-6 shadow-2xs space-y-5">
              <div className="border-b border-stone-200 pb-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#164E3B] bg-[#164E3B]/8 px-2.5 py-0.5 rounded border border-[#164E3B]/20 inline-block mb-1">
                  Protokol Demonstrasi Ilmiah
                </div>
                <h2 className="text-lg font-bold text-stone-900 font-serif">
                  Skenario Pengujian Komprehensif Dewan Juri
                </h2>
                <p className="text-xs text-stone-600">
                  Berikut panduan langkah demi langkah yang dirancang untuk menguji validitas sitasi, kestabilan grounding, dan kemampuan multimodal sistem secara terarah.
                </p>
              </div>

              {/* Scenarios */}
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    title: "Uji 1: Penelusuran Kaidah Nahwu Spesifik",
                    tag: "Kesesuaian Matan",
                    instruction: "Ketik salah satu pertanyaan gramatika berikut pada menu Kaji Kitab & Turats:",
                    prompts: [
                      "jelaskan apa yang dimaksud dengan Fi'il Qulub",
                      "apa syarat-syarat kalam menurut pengarang Mutammimah?",
                      "sebutkan tanda i'rab rofa' pada Asmaul Khamsah"
                    ],
                    check: "Periksa: Asisten akan menyajikan teks matan Arab berharakat utuh beserta kartu rujukan halaman fisik kitab yang akurat."
                  },
                  {
                    id: 2,
                    title: "Uji 2: Validasi Sitasi & Pelompatan PDF Otomatis",
                    tag: "Integritas RAG",
                    instruction: "Setelah asisten memberikan jawaban, klik kartu rujukan naskah fisik yang muncul di bawah obrolan.",
                    prompts: [],
                    check: "Periksa: Modal pembaca PDF akan terbuka seketika dan langsung mengarah tepat pada nomor halaman naskah kitab yang disitir tanpa deviasi."
                  },
                  {
                    id: 3,
                    title: "Uji 3: Multimodal Vision OCR (Analisis Foto Lembaran)",
                    tag: "Vision AI",
                    instruction: "Klik ikon kamera di kolom obrolan, kirim foto lembaran kitab kuning (teks Arab), lalu ajukan pertanyaan.",
                    prompts: [
                      "Transkripsikan matan Arab pada lembaran ini dan jelaskan kedudukan i'rabnya"
                    ],
                    check: "Periksa: Model AI mengekstrak aksara Arab, menganalisis struktur nahwunya, dan mencocokkan ke indeks Al-Kawakib bila babnya beririsan."
                  },
                  {
                    id: 4,
                    title: "Uji 4: Simulasi Muraja'ah Hafalan Al-Qur'an",
                    tag: "Evaluasi Hafalan",
                    instruction: "Pindah ke menu 'Muraja'ah Hafalan' di bilah samping kiri untuk mencoba kuis interaktif tebak surah dan sambung ayat 30 Juz.",
                    prompts: [],
                    check: "Periksa: Sistem menguji ketepatan hafalan ayat dan memberikan penilaian skor objektif di akhir sesi kuis."
                  }
                ].map((scenario) => (
                  <div key={scenario.id} className="p-4 bg-[#FAF8F3] border border-[#E7DFC6] rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#164E3B] uppercase tracking-wider font-serif">
                        {scenario.title}
                      </span>
                      <span className="text-[10px] font-semibold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {scenario.tag}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed">
                      {scenario.instruction}
                    </p>

                    {scenario.prompts.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                          Klik untuk menyalin contoh prompt:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {scenario.prompts.map((p, pIdx) => {
                            const uniqueIndex = scenario.id * 10 + pIdx;
                            const isCopied = copiedIndex === uniqueIndex;
                            return (
                              <button
                                key={pIdx}
                                onClick={() => handleCopyPrompt(p, uniqueIndex)}
                                className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-300 rounded text-xs font-mono text-stone-800 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                                title="Salin teks prompt"
                              >
                                <span>&ldquo;{p}&rdquo;</span>
                                <span className={`text-[10px] font-sans font-semibold ${isCopied ? 'text-emerald-700' : 'text-stone-400'}`}>
                                  {isCopied ? '✓ Disalin' : '⧉'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="p-2.5 bg-white rounded border border-[#E2DDD3] text-[11px] text-[#164E3B] font-medium leading-relaxed">
                      {scenario.check}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ARSITEKTUR & REKAYASA RAG */}
        {activeTab === 'arsitektur' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E2DDD3] rounded-xl p-6 shadow-2xs space-y-5">
              <div className="border-b border-stone-200 pb-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#164E3B] bg-[#164E3B]/8 px-2.5 py-0.5 rounded border border-[#164E3B]/20 inline-block mb-1">
                  Spesifikasi Rekayasa Perangkat Lunak
                </div>
                <h2 className="text-lg font-bold text-stone-900 font-serif">
                  Pipeline Retrieval-Augmented Generation (RAG) &amp; Dual AI Engine
                </h2>
                <p className="text-xs text-stone-600">
                  Rancangan topologi komputasi yang menjembatani naskah statis kitab kuning dengan model generatif modern.
                </p>
              </div>

              {/* 3 Steps Pipeline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E7DFC6] space-y-2">
                  <div className="w-7 h-7 rounded bg-[#164E3B] text-[#FAF6EE] flex items-center justify-center font-mono font-bold text-xs">
                    01
                  </div>
                  <h3 className="text-xs font-bold text-stone-900">Chunking &amp; Vektorisasi Naskah</h3>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Dokumen 284 halaman dipilah menjadi 558 segmen berbasis semantik gramatika lengkap dengan metadata bab, fasal, dan nomor halaman cetak.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E7DFC6] space-y-2">
                  <div className="w-7 h-7 rounded bg-[#164E3B] text-[#FAF6EE] flex items-center justify-center font-mono font-bold text-xs">
                    02
                  </div>
                  <h3 className="text-xs font-bold text-stone-900">Dual-Engine Resilience</h3>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Arsitektur backend mengintegrasikan provider SumoPod API dan Gemini Multimodal dengan mekanisme fallback otomatis untuk menjamin keandalan 24/7.
                  </p>
                </div>

                <div className="p-4 bg-[#FAF8F3] rounded-xl border border-[#E7DFC6] space-y-2">
                  <div className="w-7 h-7 rounded bg-[#164E3B] text-[#FAF6EE] flex items-center justify-center font-mono font-bold text-xs">
                    03
                  </div>
                  <h3 className="text-xs font-bold text-stone-900">Grounded Citation Binding</h3>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Setiap sitasi dikunci ke indeks kanonikal, menekan halusinasi generatif dan memastikan rujukan selalu merujuk pada halaman PDF yang valid.
                  </p>
                </div>
              </div>


            </div>
          </div>
        )}

      </div>
    </div>
  );
}
