# Asisten Kaji Kitab & Turats 📖✨
### Platform Telaah Turats Digital, Penelusuran Sanad & Matan, serta Muraja'ah Hafalan Santri
**Dayah Perbatasan Minhajussalam — Kota Subulussalam, Aceh**  
🌐 **Website Resmi:** [asisten-kajian.online](https://asisten-kajian.online)

---

## 📌 Ringkasan Proyek

**Asisten Kaji Kitab & Turats** adalah platform kecerdasan buatan (*Ethical Grounded AI*) berbasis web yang dirancang khusus untuk lingkungan dayah/pesantren dalam menelaah literatur klasik Islam (**Kitab Kuning**), memverifikasi rujukan sanad & matan, membaca naskah fisik via Vision OCR, serta mendukung gamifikasi muraja'ah hafalan Al-Qur'an santri.

Dibangun dengan arsitektur **Hybrid RAG (Retrieval-Augmented Generation)** dan antarmuka bertema **Turats Klasik (*warm parchment & heritage emerald*)**, sistem ini menghubungkan teks naskah digital dan lembaran fisik kitab klasik dengan mesin penalaran AI yang berpegang teguh pada adab, metodologi ilmiah, dan integritas akademik Islam.

---

## ⚖️ Prinsip Etika: AI Sebagai *Khadim*, Bukan *Mufti*

1. **AI Berposisi Sebagai Khadim at-Tahqiq (Pembantu Riset):**  
   AI difungsikan untuk membantu santri mencari ibarat naskah, menelusuri rujukan silang (*cross-referencing*), dan mentranskripsi naskah fisik Arab. AI **bukanlah Mufti** yang berhak mengeluarkan fatwa hukum syar'i independen.
2. **Otoritas Sanad Keilmuan:**  
   Penetapan hukum dan fatwa final mutlak berada di bawah bimbingan **Masyaikh, Dewan Guru, dan Asatidzah** yang memiliki sanad keilmuan bersambung (*muttashil*).
3. **Integritas Ilmiah & Anti-Halusinasi (*Zero False Attribution*):**  
   Model dilarang keras mengarang ibarat naskah atau mencatut rujukan secara serampangan (*grounded citations*). Pada percakapan umum/salam, sistem menerapkan *zero false citations* agar tidak memunculkan rujukan kitab yang tidak relevan.

---

## 🚀 Empat Modul Utama Aplikasi

### 1. Meja Telaah Kitab & Turats (Chatbot AI Interaktif)
* **Penyajian 3 Lapis Terstruktur:**
  1. *Uraian Syarah & Konseptual:* Penjelasan bahasa Indonesia yang lugas, terstruktur, dan bernas.
  2. *Teks Matan Arab Berharakat:* Tipografi klasik Arab berharakat utuh (*Amiri Font* RTL).
  3. *Kartu Sitasi Rujukan Otentik:* Nama kitab, bab/fasal, nomor halaman cetak, dan nomor halaman PDF.
* **Multimodal Vision OCR Kitab Kuning:**
  - Fitur pemindaian foto lembaran fisik naskah kitab kuning dari kamera ponsel santri.
  - Mentranskripsikan aksara Arab (cetakan lama/gundul) dan otomatis menyajikan syarah kaidah nahwunya.
  - **Pencocokan Otomatis (*Auto-Match*):** Foto naskah dari kitab Al-Kawakib langsung dikenali dan ditautkan ke lembar PDF aslinya.
  - **Pelacakan Konteks Lanjutan:** Mendukung pertanyaan tindak lanjut (misal: *"tolong berikan rujukannya"*) dengan mempertahankan konteks citra sebelumnya.
* **Ekspor Risalah Resmi ke PDF:**
  - Fitur unduh seluruh sesi kajian menjadi lembar risalah resmi pesantren ber-kop Dayah Perbatasan Minhajussalam, lengkap dengan nomor halaman dan waktu cetak.
* **Dual-Engine Resilience:**
  - Terintegrasi dengan **SumoPod API (OpenAI-compatible)** dengan failover otomatis ke **Google Gemini Multimodal API**, serta mode simulasi cerdas Mock.

### 2. Muraja'ah Hafalan Al-Qur'an (Gamifikasi Evaluasi Santri)
* **Bank Soal Terverifikasi:** Koleksi soal uji sambung ayat, tebak asal surah, dan pelengkap lafal Al-Qur'an 30 Juz.
* **Pengacakan Dinamis (Algoritma Fisher-Yates):** Opsi jawaban diacak secara dinamis di setiap sesi baru agar hafalan teruji murni tanpa ketergantungan pola statis.
* **Pilihan Porsi Soal Fleksibel:** Santri dapat memilih 5 Soal (Uji Kilat), 10 Soal (Standar), atau Semua Soal.
* **Evaluasi & Refleksi:** Menampilkan skor akurasi persentase, koreksi kesalahan lafal, dan catatan tadabbur makna ayat.

### 3. Korpus Literatur Kitab (Knowledge Base RAG)
* **Katalog Rujukan Terverifikasi:** Menampilkan status naskah kurikulum pesantren yang telah terindeks.
* **Ingest Dokumen Mandiri:** Memfasilitasi santri dan asatidzah untuk mengunggah dokumen kitab baru (PDF, DOCX, TXT, Gambar).
* **Chunking Semantik Presisi:** Teks dipecah berdasarkan bab dan fasal gramatika dengan pemetaan nomor halaman cetak dan halaman file PDF.

### 4. Panduan Sistem, Knowledge Base & Disclaimer (Modul Baru)
* **Disclaimer & Etika AI Islam:** Dokumentasi resmi kedudukan AI sebagai asisten penelaahan, sifat probabilistik model bahasa alami (LLM), serta toleransi pembacaan citra kamera.
* **Knowledge Base Kitab Kanonikal:** Metadata ilmiah lengkap naskah kurikulum inti, statistik 284 halaman, 35 bab, dan 558 segmen vektor terindeks.
* **Panduan Pengujian Dewan Juri:** Daftar skenario pengujian terarah untuk mendemonstrasikan kapabilitas sistem saat presentasi lomba.
* **Arsitektur & Pipeline RAG:** Penjelasan alur temu-kembali informasi (*information retrieval*), chunking semantik, dan pengikatan sitasi.

---

## 📖 Naskah Rujukan Utama (Korpus Inti Pesantren)

Sistem ini difokuskan secara mendalam pada naskah gramatika bahasa Arab klasik mu'tamad:

### **INTISARI KITAB AL-KAWAKIB AL-DURRIYYAH SYARAH MUTAMMIMAH AL-JURUMIYYAH**
* **Penulis / Penyusun:** **Iswandi El-Nisamy** (Cot Trueng)
* **Editor Naskah:** **Tgk. Dr. Safriadi, MA.** *(Mudir Dayah Raudhatul Ma'arif Cot Trueng)*
* **Penerbit:** **CV. Manhaji Medan**, Cetakan Pertama: Maret 2020
* **Digitalisasi & Implementasi AI:** **Dayah Perbatasan Minhajussalam, Kota Subulussalam, Aceh**
* **Volume Naskah:** 284 Halaman PDF (272 Halaman Naskah Materi Pokok).
* **Struktur Digital:** 558 segmen bab terindeks lengkap (Bab Kalam, Tanda I'rab, Fa'il, Mubtada-Khabar, Nawasikh, Af'alul Qulub, Manshubat, Mustatsna, hingga Makhfudhatul Asma).
* **Fitur Pembaca PDF Mandiri (*In-App PDF Viewer*):**
  - Menggunakan engine PDF.js mandiri (*self-hosted*) dengan rendering kanvas tajam berbasis `devicePixelRatio`.
  - Tombol *"Buka Halaman Rujukan"* langsung melompat tepat ke halaman naskah fisik yang disitir (`/baca?page=X`).
  - Dilengkapi kontrol zoom reaktif (`+`, `-`, reset `100%`), *quick page jump*, serta pintasan keyboard (`←` / `→` / `F` / `+` / `-`).

---

## 🎨 Harmonisasi Desain Turats Klasik (*Anti-Slop*)

Seluruh antarmuka web dibangun dengan prinsip estetika pesantren klasik:
* **Palet Warna Naskah Kuno:** Kertas naskah hangat (*Warm Parchment* `#FAF7F2` dan `#FAF6EE`), aksen *Deep Heritage Emerald* (`#164E3B`, `#123E2F`), dan border keemasan naskah (`#E5DFD3`, `#E7DFC6`).
* **Tipografi:** Kombinasi font serif klasik (*Amiri Font* untuk teks Arab gundul/berharakat) dan font modern (*Inter*) untuk kenyamanan pembacaan syarah latin.
* **Bebas Elemen Generik / Slop:** Mengeliminasi emoji neon, gradien berlebihan, dan elemen antarmuka generik demi menjaga wibawa ilmiah karya turats.

---

## 🛠️ Arsitektur Teknologi

* **Frontend:** Next.js 16 (App Router, Turbopack Engine)
* **Bahasa:** TypeScript & Node.js 24
* **Styling:** Tailwind CSS, Custom Turats Color Tokens, CSS Variables
* **AI & Vision Pipeline:**
  - **SumoPod API:** OpenAI-compatible API untuk inferensi cerdas dan penelusuran leksikal.
  - **Google Gemini API:** `gemini-1.5-flash` / Multimodal Vision AI untuk pembacaan citra naskah fisik kitab kuning.
  - **Local In-Memory Vector Store:** Pencarian semantik berkecepatan tinggi dengan skor relevansi dinamis.
* **PDF & Viewer Engine:** PDF.js v4 (distribusi lokal mandiri) & `html2pdf.js` untuk ekspor risalah.
* **Mobile-First Experience:** Mendukung `100dvh`, *overscroll containment*, dan tata letak responsif di ponsel, tablet, maupun layar desktop.

---

## 💻 Panduan Menjalankan di Lokal (Development)

### 1. Klon Repositori & Pasang Dependensi
```bash
git clone https://github.com/RozyBrt/asisten-kaji-kitab.git
cd asisten-kaji-kitab
npm install
```

### 2. Konfigurasi Lingkungan (`.env.local`)
Buat berkas `.env.local` pada direktori root proyek:
```env
# Provider 1: SumoPod (OpenAI-compatible) - Rekomendasi Utama
SUMOPOD_API_KEY=sk-xxxx
SUMOPOD_BASE_URL=https://ai.sumopod.com/v1

# Provider 2: Google Gemini API (Failover & Vision)
GEMINI_API_KEY=AIzaxxxx
```
*(Catatan: Apabila kunci API tidak diisi, sistem otomatis beralih ke simulasi cerdas Mock tanpa menghentikan aplikasi).*

### 3. Uji Coba Kompilasi & Jalankan Server Lokal
```bash
npm run dev
```
Buka peramban di [http://localhost:3000](http://localhost:3000).

Untuk memvalidasi kesiapan produksi:
```bash
npm run build
```

---

## 🌐 Panduan Deployment di Server VPS

Untuk memperbarui aplikasi pada server produksi (Ubuntu/Debian):

```bash
cd /var/www/asisten-kaji-kitab
git pull origin master
npm run build
pm2 restart asisten-kaji-kitab
```

---

## 📂 Berkas Dokumentasi Riset Ilmiah

* [Catatan Penyempurnaan Akhir & Panduan Disclaimer (15 Okt 2026)](docs/catatan_penyempurnaan_akhir_dan_panduan_disclaimer_15_oktober.md) — Rangkuman final modul Panduan, etika AI, harmonisasi desain, dan otentisitas korpus
* [Catatan Pengembangan Final (14 Okt 2026)](docs/catatan_pengembangan_final_14_oktober.md) — Dokumentasi perbaikan JSON unescaping, Vision OCR, dan sanitasi sitasi
* [Profil Lengkap & Inventarisasi Literatur](docs/profil_lengkap_sistem_dan_korpus_rujukan.md) — Dokumen resmi pengenalan sistem & profil naskah dayah
* [Implementasi RAG Nyata](docs/real_rag_implementation.md) — Spesifikasi teknis arsitektur RAG & Vector Store
* [Matriks Fitur & Roadmap](docs/matriks_fitur.md) — Status kelengkapan fitur sistem

---

## 👥 Pengembang & Hak Cipta
Dikembangkan oleh **Tim Riset Karya Ilmiah Dayah Perbatasan Minhajussalam** (Kota Subulussalam, Aceh — 2026).  
Didedikasikan untuk kemajuan literasi turats santri dan dakwah Islamiyah berbasis teknologi beradab.
