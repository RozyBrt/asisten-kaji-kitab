# Asisten Kaji Kitab & Turats 📖✨
### Meja Telaah Turats, Rujukan Sanad & Matan, serta Muraja'ah Hafalan Santri
**Dayah Perbatasan Minhajussalam — Kota Subulussalam, Aceh**  
🌐 **Website Resmi:** [asisten-kajian.online](https://asisten-kajian.online)

---

## 📌 Ringkasan Proyek

**Asisten Kaji Kitab & Turats** adalah platform kecerdasan buatan (*Ethical Grounded AI*) berbasis web yang dirancang khusus untuk lingkungan dayah/pesantren dalam menelaah literatur klasik Islam (**Kitab Kuning**), memverifikasi rujukan sanad & matan, serta mendukung gamifikasi muraja'ah hafalan Al-Qur'an santri.

Dibangun dengan arsitektur **Hybrid RAG (Retrieval-Augmented Generation)**, sistem ini menghubungkan teks naskah digital dan lembaran fisik kitab klasik dengan mesin penalaran AI yang berpegang teguh pada adab dan integritas ilmiah Islam.

---

## ⚖️ Prinsip Etika: AI Sebagai *Khadim*, Bukan *Mufti*

1. **AI Berposisi Sebagai Khadim (Pembantu Riset):**  
   AI difungsikan untuk membantu santri mencari ibarat naskah, menelusuri silang rujukan (*cross-referencing*), dan mentranskripsi teks Arab. AI **bukanlah Mufti** yang berhak mengeluarkan fatwa hukum syar'i independen.
2. **Otoritas Sanad Keilmuan:**  
   Penetapan hukum dan fatwa final mutlak berada di bawah bimbingan **Masyaikh, Dewan Guru, dan Asatidzah** yang memiliki sanad keilmuan bersambung (*muttashil*).
3. **Integritas Ilmiah & Anti-Halusinasi (*Zero False Attribution*):**  
   Model dilarang keras mengarang ibarat kitab atau mencatut nama ulama secara serampangan. Pembahasan fiqih praktis merujuk pada kitab furu'iyyah, sedangkan dasar dalil disandarkan pada hadits nabawi dan kitab ushul.

---

## 🚀 Tiga Modul Utama Aplikasi

### 1. Meja Telaah Kitab & Turats (Chatbot AI Interaktif)
* **Penyajian 3 Lapis:** Setiap telaah menyajikan:
  1. *Uraian Syarah & Konseptual* (bahasa Indonesia lugas, terstruktur, dan bernas).
  2. *Teks Matan Arab Berharakat* (tipografi klasik *Amiri Font* RTL).
  3. *Kartu Sitasi Rujukan* (nama kitab, pengarang, bab/fasal, dan referensi naskah).
* **Multimodal Vision OCR Kitab Kuning:**
  - Fitur pemindaian foto lembaran fisik naskah kitab kuning santri.
  - Mentranskripsikan aksara Arab gundul/berharakat dan langsung menjabarkan syarah pembahasannya.
  - Dilengkapi tombol *Demo Naskah Turats* (bab Fardhu Wudhu) untuk demonstrasi instan saat presentasi.
* **Ekspor Risalah Lengkap ke Dokumen PDF:**
  - Fitur unduh seluruh sesi percakapan menjadi risalah resmi pesantren ber-kop Dayah Minhajussalam yang bernomor halaman, rapi, dan siap dicetak untuk disetorkan ke guru pembimbing.
* **Multi-Provider AI Fallback:**
  - Terintegrasi dengan **SumoPod (OpenAI-compatible)**, **Google Gemini Multimodal**, dan **Simulasi Mock Cerdas** (tetap responsif meski tanpa kuota/internet).

### 2. Muraja'ah Hafalan Al-Qur'an (Gamifikasi Santri)
* **Bank Soal:** 15 soal uji sambung ayat terverifikasi dari Surah-surah Juz 'Amma (*Al-Fatihah* hingga *At-Tin*).
* **Pengacakan Dinamis (Fisher-Yates):** Posisi opsi jawaban (A, B, C, D) diacak secara otomatis di setiap sesi baru agar kunci jawaban tidak statis.
* **Pilihan Jumlah Soal Fleksibel:** Santri dapat memilih porsi latihan:
  - **5 Soal** (Uji Kilat)
  - **10 Soal** (Sesi Standar)
  - **15 Soal** (Uji Lengkap)
* **Evaluasi & Refleksi:** Menampilkan skor akurasi persentase, koreksi jawaban, dan mutiara tadabbur makna ayat.

### 3. Korpus Literatur Kitab (Knowledge Base RAG)
* **Katalog Rujukan Mu'tamad:** Menampilkan status kitab kurikulum pesantren yang telah terindeks.
* **Ingest Dokumen Mandiri:** Memfasilitasi asatidzah mengunggah dokumen kitab baru (PDF, DOCX, TXT, Gambar).
* **Chunking & Vector Embedding:** Teks dibagi dalam potongan 800 token (overlap 150) dan disimpan dalam representasi vektor untuk pencarian leksikal-semantik.
* **Proteksi Kitab Inti:** Kitab-kitab kurikulum inti dikunci aman dari penghapusan tidak disengaja.

---

## 📚 Naskah Rujukan Utama (Fokus Inti Pesantren)

Sesuai arahan dan kurikulum resmi Dayah/Pesantren, sistem ini difokuskan secara mendalam pada satu naskah gramatika Arab klasik mu'tamad:

### 📖 **INTISARI KITAB AL-KAWAKIB AL-DURRIYYAH SYARAH MUTAMMIMAH AL-JURUMIYYAH**
* **Karya:** Syaikh Muhammad az-Zuhri al-Ghamrawi (Syarah atas *Mutammimah Al-Jurumiyyah* karya Syaikh Syamsuddin Muhammad bin Muhammad ar-Ra'ini / Al-Haththab).
* **Ukuran Berkas & Volume:** 284 Halaman Dokumen PDF (1.77 MB) / 272 Halaman Naskah Asli Kitab ($Halaman\_PDF = Halaman\_Kitab + 12$).
* **Struktur Digital:** 558 segmen/bab terindeks leksikal & semantik secara utuh (dari Bab Kalam, Tanda I'rab, Ma'rifat-Nakirah, Af'al, Marfu'at, Manshubat, Mahfudhat, hingga Bab Idgham).
* **Integrasi PDF Interaktif:**
  - 🔗 **Buka Halaman Rujukan Langsung:** Setiap jawaban AI menyertakan sitasi halaman kitab & halaman PDF beserta tombol `[Buka Halaman Rujukan]` yang langsung mengarahkan peramban ke halaman PDF terkait (`/api/pdf#page=X`).
  - 📥 **Unduh Naskah Resmi:** Tombol `[Unduh PDF]` (`/api/pdf?download=1`) untuk mengunduh naskah resmi pesantren kapan saja.
  - 🌐 **Multilingual Presisi:** Teks Arab berharakat (*tasykil*) dan syarah bahasa Indonesia diproses secara harmonis tanpa kerusakan karakter (*encoding*) atau halusinasi makna.

---

## 🛠️ Teknologi yang Digunakan

* **Framework:** Next.js 16 (App Router, Turbopack)
* **Bahasa:** TypeScript & Node.js 24
* **Styling & UI:** Tailwind CSS, Amiri Arabic Font, Inter Font, Islamic Geometry SVG Patterns
* **AI & Embedding Engine:**
  - SumoPod API (`text-embedding-3-small`, OpenAI-compatible LLM)
  - Google Gemini API (`gemini-1.5-flash` / Multimodal Vision)
  - Local In-Memory Vector Store (`.vector-store.json`)
* **Dokumentasi & Ekspor:** `html2pdf.js` untuk konversi dokumen client-side
* **Mobile-First UX:** Pinned header (`100dvh`), `overscroll-contain`, responsif di semua ukuran layar smartphone

---

## 💻 Cara Menjalankan di Lokal (Development)

### 1. Klon Repositori & Pasang Dependensi
```bash
git clone https://github.com/RozyBrt/asisten-kaji-kitab.git
cd asisten-kaji-kitab
npm install
```

### 2. Konfigurasi Lingkungan (`.env.local`)
Buat file `.env.local` di root proyek:
```env
# Opsi 1: SumoPod (OpenAI-compatible) - Rekomendasi
SUMOPOD_API_KEY=sk-xxxx
SUMOPOD_BASE_URL=https://ai.sumopod.com/v1

# Opsi 2: Google Gemini API (Opsional)
GEMINI_API_KEY=AIzaxxxx
```
*(Catatan: Jika dibiarkan kosong, sistem otomatis beralih ke mode simulasi cerdas Mock tanpa error).*

### 3. Jalankan Server Dev
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 🌐 Panduan Deployment di Server VPS

Untuk memperbarui aplikasi pada server produksi Ubuntu/Debian:

```bash
cd /var/www/asisten-kaji-kitab
git pull origin master
npm run build
pm2 restart asisten-turats
```

---

## 📂 Dokumentasi Terkait

* [Profil Lengkap & Inventarisasi Literatur](docs/profil_lengkap_sistem_dan_korpus_rujukan.md) — Dokumen resmi pengenalan sistem & bahan pemaparan pesantren
* [Catatan Pembaruan 13 Oktober 2026](docs/catatan_pengembangan_sesi_siang_13_oktober.md) — Rangkuman perbaikan mobile header, pengacakan hafalan, dan OpenGraph
* [Implementasi RAG Nyata](docs/real_rag_implementation.md) — Spesifikasi teknis arsitektur RAG & Vector Store
* [Matriks Fitur & Roadmap](docs/matriks_fitur.md) — Status kelengkapan fitur sistem

---

## 👥 Pengembang & Hak Cipta
Dikembangkan oleh **Tim Riset Karya Ilmiah Dayah Perbatasan Minhajussalam** (2026).  
Didedikasikan untuk kemajuan literasi turats santri dan dakwah Islamiyah berbasis teknologi beradab.
