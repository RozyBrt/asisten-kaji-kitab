# 📖 Prototype Lomba Karya Ilmiah: Asisten AI Kaji Kitab & Turats

> **Panduan teknis & brief awal Antigravity:** [`panduan_pengembangan.md`](./panduan_pengembangan.md)  
> **Matriks fitur (sudah / belum / roadmap):** [`matriks_fitur.md`](./matriks_fitur.md)

> **Tema:** Inovasi Kecerdasan Buatan untuk Pemajuan Khazanah Turats Islam & Pendidikan Al-Qur'an  
> **Status:** Siap Didemonstrasikan (*Interactive Full-Stack Web App*)  
> **Aplikasi Berjalan di:** [http://localhost:3000](http://localhost:3000)

---

## 🌟 Ringkasan Inovasi & Latar Belakang

Kitab Turats (kitab kuning / literatur klasik Islam) menyimpan fondasi keilmuan fiqih, tafsir, hadits, dan tasawuf. Namun, santri pemula maupun akademisi kerap menghadapi tantangan:
1. **Naskah Arab Klasik (Gundul/Tanpa Harakat):** Sulit dibaca dan ditranskripsi cepat.
2. **Penelusuran Rujukan Silang (Cross-Referencing):** Memerlukan waktu lama untuk memverifikasi matan dan syarah antar-kitab.
3. **Metode Muraja'ah Konvensional:** Memerlukan partner untuk menguji sambung ayat Al-Qur'an.

**Solusi yang Dikembangkan:**
Aplikasi web cerdas multimodal yang mengintegrasikan:
- **Vision OCR & AI Syarah:** Membaca foto lembar fisik kitab klasik dan menjabarkan penjelasan dalam bahasa Indonesia terstruktur.
- **Retrieval-Augmented Generation (RAG):** Menghubungkan setiap jawaban dengan kartu sitasi kitab (Nama Kitab, Bab/Pasal, dan Halaman).
- **Simulasi Hafalan Interaktif:** Fitur kuis sambung ayat, tebak surah, dan isi lanjutan dengan umpan balik tajwid/arti.
- **Etika AI Islam:** Pagar pembatas (*guardrail*) etika bahwa AI berfungsi sebagai asisten penelusuran (*khadim*), bukan pembuat fatwa (*mufti*).

---

## 🚀 Fitur Utama & Modul Aplikasi

### 1. Modul Kaji Kitab (RAG & Multimodal Bot)
- **Input Multimodal Fleksibel:** Mendukung pesan teks dan unggah foto halaman kitab fisik (Kamera/Paperclip).
- **1-Klik Demo Multimodal:** Tombol khusus untuk memuat sampel naskah klasik (*Matan Furu'dhul Wudhu'*) sehingga juri lomba dapat langsung menguji tanpa perlu mencari file foto.
- **Preview Thumbnail:** Menampilkan pratinjau gambar di atas form input sebelum dikirim.
- **Tipografi Arab Otentik:** Render matan dan kutipan menggunakan font **Amiri / Traditional Arabic** dengan tata letak RTL yang rapi.
- **Kartu Sitasi Terverifikasi:** Setiap jawaban menyajikan kartu sumber (*Nama Kitab, Bab, Halaman*).
- **Fitur Audio Web Speech:** Tombol **"🔊 Baca Lafal"** untuk mendengarkan pelafalan teks Arab langsung dari peramban.

### 2. Modul Simulasi Hafalan Al-Qur'an
- **Mode Ujian Interaktif:**
  - *Sambung Ayat:* Melanjutkan penggalan ayat yang terputus.
  - *Tebak Surah:* Menentukan asal surah dari potongan ayat.
  - *Isi Lanjutan:* Melengkapi kata kunci dalam ayat.
- **Skor & Feedback Instan:** Penilaian persentase akurasi, pembacaan ayat lengkap berharakat, dan penjelasan latar belakang surah.

### 3. Modul Panel Unggah Dokumen (Knowledge Base RAG)
- **Area Drag & Drop:** Simulasi penyerahan dokumen format PDF, DOCX, dan TXT.
- **Indeksasi Real-Time:** Menampilkan status *Mengindeks* hingga *Terindeks* pada korpus kitab (Fathul Qarib, Safinatun Najah, Ihya Ulumiddin, Ta'limul Muta'allim).
- **Metrik Korpus:** Statistik jumlah kitab, halaman, dan kategori keilmuan (Fiqih, Akhlaq, Tasawuf).

### 4. Modal Arsitektur & Riset Ilmiah
- Tombol **`🔬 Arsitektur & Riset`** pada header membuka ringkasan metodologi ilmiah, bagan alur Vision OCR + RAG + Grounded AI, dan prinsip etika AI.

---

## 🛠️ Arsitektur Kode & Struktur Direktori

```
asisten-kaji-kitab/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts         # Route handler Next.js (Multimodal + Gemini API + Fallback Mock)
│   │   ├── globals.css              # Theme Islami-Akademis, Amiri Arabic font, Tailwind utilities
│   │   ├── layout.tsx               # Root Layout dengan metadata SEO & Google Fonts
│   │   └── page.tsx                 # Orkestrasi modul (Kaji Kitab, Hafalan, Upload)
│   ├── components/
│   │   ├── Sidebar.tsx              # Navigasi modul responsif & badge prototype
│   │   ├── Header.tsx               # Header glassmorphism, AI status, & trigger riset
│   │   ├── ChatUI.tsx               # Antarmuka chatbot multimodal, OCR, audio & sitasi
│   │   ├── HafalanUI.tsx            # Antarmuka kuis hafalan Al-Qur'an interaktif
│   │   ├── UploadUI.tsx             # Panel kelola file & status indeks RAG
│   │   ├── ResearchModal.tsx        # Modal kajian ilmiah & diagram arsitektur
│   │   └── Footer.tsx               # Banner etika AI & disclaimer fatwa
│   └── lib/
│       ├── types.ts                 # Definisi tipe TypeScript
│       ├── mock-data.ts             # Data mock interaktif (OCR, fikih, hafalan, korpus)
│       └── sample-kitab.ts          # Vektor grafis sampel naskah turats untuk demo cepat
├── .env.local                       # Konfigurasi GEMINI_API_KEY
├── package.json
└── tsconfig.json
```

---

## 🔑 Integrasi API Google Gemini (Opsional)

Aplikasi **sudah langsung dapat berjalan 100% tanpa API Key** menggunakan sistem simulasi cerdas (*mock fallback*).

Untuk menghubungkan ke API Google Gemini secara langsung:
1. Dapatkan API Key di [Google AI Studio](https://aistudio.google.com/apikey).
2. Buka file `.env.local` dan masukkan:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
3. Backend route `app/api/chat/route.ts` otomatis memanggil model `gemini-2.0-flash` dengan konfigurasi multimodal teks dan gambar.
