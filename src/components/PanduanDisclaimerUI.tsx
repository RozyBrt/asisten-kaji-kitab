'use client';

import React, { useState } from 'react';

export default function PanduanDisclaimerUI() {
  const [activeTab, setActiveTab] = useState<'disclaimer' | 'knowledge' | 'demo' | 'arsitektur'>('disclaimer');

  return (
    <div className="h-full w-full flex flex-col bg-slate-50/50 overflow-y-auto overscroll-contain">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 border-b border-emerald-950/20 shadow-sm flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-emerald-700/80 border border-emerald-500/30 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-emerald-100">
              Edisi Riset &amp; Lomba Karya Ilmiah 2026
            </span>
            <span className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-full text-[10px] sm:text-xs font-medium text-white/90">
              Dayah Perbatasan Minhajussalam
            </span>
            <span className="px-2.5 py-1 bg-amber-400/20 border border-amber-300/30 rounded-full text-[10px] sm:text-xs font-semibold text-amber-200">
              Prototipe Akademik Terbuka
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-2">
            Panduan Sistem, Knowledge Base &amp; Catatan Etika (Disclaimer)
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-3xl">
            Dokumentasi resmi mengenai ruang lingkup literatur turats, metodologi kecerdasan buatan berbasis korpus (RAG), batasan teknologi, serta panduan pengujian terarah bagi dewan juri dan akademisi.
          </p>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-emerald-700/50">
            <button
              onClick={() => setActiveTab('disclaimer')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'disclaimer'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-700/70'
              }`}
            >
              <span className="text-amber-500 font-bold">&#9888;</span>
              Disclaimer &amp; Etika AI
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'knowledge'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-700/70'
              }`}
            >
              <span>&#128218;</span>
              Knowledge Base Kitab
            </button>
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'demo'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-700/70'
              }`}
            >
              <span>&#127919;</span>
              Panduan Uji Dewan Juri
            </button>
            <button
              onClick={() => setActiveTab('arsitektur')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'arsitektur'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'bg-emerald-800/60 text-emerald-100 hover:bg-emerald-700/70'
              }`}
            >
              <span>&#9881;</span>
              Arsitektur &amp; Pipeline RAG
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        
        {/* TAB 1: DISCLAIMER & ETIKA KEILMUAN */}
        {activeTab === 'disclaimer' && (
          <div className="space-y-5 animate-fade-in">
            {/* Primary Notice Card */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xl flex-shrink-0 shadow-xs">
                  &#9888;
                </div>
                <div className="space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-amber-950">
                    Pernyataan Batasan Sistem &amp; Etika Keilmuan Islam (Disclaimer)
                  </h2>
                  <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
                    Sistem <strong>Asisten Kaji Kitab &amp; Turats</strong> dirancang secara khusus sebagai instrumen bantu akademis digital <em>(Khadim at-Tahqiq / Research Assistant)</em> untuk mempercepat pencarian materi, pembacaan naskah fisik, serta penelusuran sanad bab gramatika bahasa Arab (nahwu-sharaf).
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">1</span>
                  Bukan Pengganti Fatwa atau Majelis Guru
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kecerdasan buatan tidak memiliki kedudukan sebagai <em>Mufti</em> atau otoritas fatwa syariat independen. Pemahaman substantif keagamaan dan penafsiran hukum mutlak merujuk pada musyawarah dewan guru, masyaikh, dan ulama muktamad pemegang sanad keilmuan naskah turats.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">2</span>
                  Sifat Probabilistik Model Bahasa Alami (LLM)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Model AI memproses teks berbasis estimasi probabilitas statistik bahasa alami. Meskipun sistem telah diikat secara ketat <em>(grounded)</em> dengan korpus Al-Kawakib, variasi susunan kalimat pada prompt pengguna dapat memicu perbedaan redaksi. Sistem selalu menyertakan tombol verifikasi naskah fisik PDF sebagai rujukan primer yang tak terbantahkan.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">3</span>
                  Toleransi Pembacaan Citra Naskah (Vision OCR)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Kecermatan fitur OCR bergantung pada kualitas input gambar (resolusi kamera, intensitas cahaya, bayangan, naskah miring, atau kertas kitab yang sudah menguning/lapuk). Hasil transkripsi aksara Arab disajikan sebagai telaah awal yang dapat dicocokkan kembali dengan naskah fisik aslinya.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs">4</span>
                  Prinsip Kejujuran Riset Ilmiah (Academic Integrity)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Transparansi mengenai kelebihan maupun limitasi sistem ini merupakan wujud integritas akademik dalam perlombaan karya ilmiah. Kehadiran halaman disclaimer ini menegaskan bahwa sistem dibangun dengan kesadaran metodologis dan akuntabilitas ilmiah yang matang.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KNOWLEDGE BASE KITAB */}
        {activeTab === 'knowledge' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Naskah Indeks Utama
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah Al-Jurumiyyah
                  </h2>
                  <p className="text-xs text-slate-500">
                    Karya Ilmiah Abuya Tgk. H. Syarifuddin Abu Bakar &bull; Dayah Perbatasan Minhajussalam
                  </p>
                </div>
                <a
                  href="/baca?page=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                >
                  <span>&#128196;</span>
                  Buka Dokumen PDF (284 Halaman)
                </a>
              </div>

              {/* Statistics Counter */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <p className="text-2xl font-black text-emerald-800">284</p>
                  <p className="text-[11px] font-medium text-slate-600">Total Halaman PDF</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <p className="text-2xl font-black text-emerald-800">272</p>
                  <p className="text-[11px] font-medium text-slate-600">Halaman Naskah Asli</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <p className="text-2xl font-black text-emerald-800">35</p>
                  <p className="text-[11px] font-medium text-slate-600">Bab Materi Gramatika</p>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <p className="text-2xl font-black text-emerald-800">558</p>
                  <p className="text-[11px] font-medium text-slate-600">Segmen Korpus Terindeks</p>
                </div>
              </div>

              {/* Bab Scope Information */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Cakupan Bab &amp; Fasal Nahwu yang Telah Terpetakan:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-700">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Bab Kalam &amp; Pembagian Kalimat (Hal. 1-3)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Bab I&apos;rab &amp; Tanda-Tandanya (Hal. 4-22)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Bab Fa&apos;il &amp; Na&apos;ibul Fa&apos;il (Hal. 46-56)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Bab Mubtada &amp; Khabar (Hal. 57-75)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Nawasikh: Kaana &amp; Inna (Hal. 76-103)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Af&apos;alul Qulub / Zhanna (Hal. 104-112)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Maf&apos;ul Bih &amp; Maf&apos;ul Muthlaq (Hal. 120-136)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Bab Hal, Tamyiz &amp; Mustatsna (Hal. 142-167)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span>Makhfudhatul Asma / Huruf Jar (Hal. 250-272)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PANDUAN PENGUJIAN JURI */}
        {activeTab === 'demo' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  Panduan Demonstrasi &amp; Pengujian
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Skenario Pengujian Optimal untuk Penilaian Dewan Juri
                </h2>
                <p className="text-xs text-slate-500">
                  Gunakan rekomendasi skenario di bawah ini untuk menguji kapabilitas sistem secara komprehensif saat sesi presentasi.
                </p>
              </div>

              {/* Skenario List */}
              <div className="space-y-3">
                {/* Skenario 1 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Uji 1: Penelusuran Kaidah Nahwu Spesifik
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      Rekomendasi Utama
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Ketik pertanyaan seputar kaidah gramatika nahwu di menu <strong>Kaji Kitab &amp; Turats</strong>:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-700">
                      &quot;jelaskan apa yang dimaksud dengan Fi&apos;il Qulub&quot;
                    </span>
                    <span className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-700">
                      &quot;apa syarat-syarat kalam menurut pengarang Mutammimah?&quot;
                    </span>
                    <span className="px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-700">
                      &quot;sebutkan tanda i&apos;rab rofa&apos; pada Asmaul Khamsah&quot;
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    &#10003; Periksa: Asisten akan menyajikan teks matan Arab berharakat utuh beserta kartu rujukan naskah fisik yang dapat diklik.
                  </p>
                </div>

                {/* Skenario 2 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Uji 2: Verifikasi Lembaran Naskah Fisik PDF
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                      Integritas Sitasi
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Setelah asisten memberikan jawaban, klik tombol hijau <strong>&quot;Buka Halaman Rujukan&quot;</strong> pada kartu sitasi.
                  </p>
                  <p className="text-[11px] text-blue-700 font-medium">
                    &#10003; Periksa: Pembaca PDF interaktif akan terbuka seketika dan langsung melompat tepat pada halaman naskah kitab yang disitir tanpa perlu mencari manual.
                  </p>
                </div>

                {/* Skenario 3 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Uji 3: Vision OCR (Kamera / Unggah Foto Kitab)
                    </span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
                      Multimodal AI
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Klik ikon kamera pada kolom input obrolan, unggah foto lembaran kitab kuning (berupa teks Arab), lalu tekan kirim.
                  </p>
                  <p className="text-[11px] text-purple-700 font-medium">
                    &#10003; Periksa: Model AI Vision akan mengekstrak transkripsi teks Arab, menjelaskan hukum gramatikanya, dan jika naskah berasal dari Al-Kawakib, sistem otomatis mengaitkan kartu rujukannya.
                  </p>
                </div>

                {/* Skenario 4 */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                      Uji 4: Simulasi Muraja&apos;ah Hafalan Al-Qur&apos;an
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                      Modul Evaluasi
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Pindah ke menu <strong>Muraja&apos;ah Hafalan</strong> di bilah samping kiri untuk mencoba kuis sambung ayat dan tebak lafadz Al-Qur&apos;an (30 Juz).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ARSITEKTUR & PIPELINE RAG */}
        {activeTab === 'arsitektur' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Arsitektur Rekayasa Perangkat Lunak
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Pipeline Retrieval-Augmented Generation (RAG) &amp; Dual AI Engine
                </h2>
                <p className="text-xs text-slate-500">
                  Struktur komputasi cerdas yang menghubungkan naskah statis kitab kuning dengan model generatif modern.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">Chunking &amp; Vektorisasi Naskah</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Dokumen 284 halaman dipecah menjadi 558 segmen semantik dengan metadata naskah (judul bab, fasal, nomor halaman cetak, dan nomor halaman file PDF).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">Dual-Engine Resilience</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Arsitektur backend mengintegrasikan provider SumoPod API dengan Gemini Multimodal sebagai failover berkecepatan tinggi, memastikan ketersediaan layanan 24/7.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">Grounded Citation Binding</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Setiap sitasi diverifikasi silang ke indeks kanonikal, mengeliminasi halusinasi model dan memastikan rujukan selalu membuka halaman kitab yang valid.
                  </p>
                </div>
              </div>

              {/* Troubleshooting during presentation */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <span>&#128161;</span> Tips Penyampaian Saat Sesi Tanya-Jawab Juri
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Bila dewan juri menguji pertanyaan di luar naskah kitab nahwu (misal: fikih jual-beli atau fiqh jinayat), sistem akan tetap berupaya menjawab namun dengan catatan bahwa korpus primer yang saat ini terindeks secara mendalam adalah gramatika bahasa Arab <em>Al-Kawakib Al-Durriyyah Syarah Mutammimah</em>. Rencana pengembangan selanjutnya mencakup ekspansi korpus ke rumpun kitab fikih (Fathul Qarib, Bajuri) dan ushul fikih.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
