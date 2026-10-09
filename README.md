# 📖 Prototype Lomba Karya Ilmiah: Asisten AI Kaji Kitab & Turats

Aplikasi web full-stack prototype karya ilmiah bertema **"Bot AI Pembantu Kaji Kitab (Turats) & Hafalan Al-Qur'an"** dibangun dengan **Next.js 14/16 (App Router)**, **Tailwind CSS**, **TypeScript**, dan **Google Gemini Multimodal API**.

## 🌟 Modul & Fitur Utama

1. **Kaji Kitab (RAG & Multimodal Bot):**
   - Chatbot interaktif dengan bubble chat elegan dan responsif.
   - Dukungan unggah gambar foto halaman kitab fisik (Vision OCR).
   - Tombol **Demo Multimodal 1-Klik** untuk demonstrasi langsung naskah kitab tanpa perlu mencari file gambar.
   - Transkripsi teks Arab (Amiri Font / RTL).
   - Kartu sitasi rujukan kitab (Nama Kitab, Bab, Halaman).
   - Integrasi Web Speech API (Baca Lafal Arab).

2. **Simulasi Hafalan Al-Qur'an:**
   - Kuis interaktif: Sambung Ayat, Tebak Surah, dan Isi Lanjutan.
   - Evaluasi persentase skor, lafal ayat lengkap, dan syarah makna.

3. **Panel Unggah Dokumen (Knowledge Base RAG):**
   - Simulasi drag & drop upload PDF, DOCX, TXT.
   - Daftar korpus kitab terindeks (*Fathul Qarib, Safinatun Najah, Ihya Ulumiddin, Ta'limul Muta'allim*).

4. **Etika AI & Informasi Riset:**
   - Disclaimer etika AI pada banner bawah.
   - Modal informasi riset ilmiah dan bagan alur teknologi AI.

## 🚀 Menjalankan Aplikasi

Aplikasi saat ini telah aktif di:
```bash
http://localhost:3000
```

Untuk menjalankan ulang development server di masa mendatang:
```bash
cd asisten-kaji-kitab
npm run dev
```

## 🔑 Konfigurasi Google Gemini API (Opsional)
Buka file `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*Catatan: Jika dibiarkan kosong, aplikasi tetap berjalan lancar dengan mock simulation pintar.*

## 📋 Status fitur & roadmap

Lihat [`docs/matriks_fitur.md`](docs/matriks_fitur.md) untuk catatan lengkap fitur yang **sudah selesai**, **belum/simulasi**, dan **rencana pengembangan** (termasuk RAG nyata, hafalan lisan, auth).
