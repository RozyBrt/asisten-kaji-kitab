# Catatan Pembaruan & Optimalisasi Sistem (13 Oktober 2026)

## Ringkasan Pembaruan

Pada sesi ini, dilakukan serangkaian penyempurnaan menyeluruh mencakup modul gamifikasi Muraja'ah Hafalan, penyesuaian terminologi riset, aset visual OpenGraph sharing, dan perbaikan UX krusial untuk perangkat mobile (smartphone).

---

### 1. Perbaikan UX Header Selalu Tampil (Sticky / Pinned Header di Smartphone)
* **Permasalahan Sebelumnya:** Pada browser smartphone (Chrome, Safari, Brave), saat pengguna melakukan swipe/scroll ke atas pada halaman web, toolbar browser memicu scroll window tingkat dokumen yang menyebabkan `<header>` terdorong keluar layar (menghilang). Pengguna harus menarik layar ke bawah kembali untuk memunculkan header.
* **Penyebab Teknis:** Penggunaan `h-screen` (100vh) yang melebihi tinggi viewport dinamis pada peramban seluler, serta belum adanya penguncian scroll pada elemen `html` dan `body`.
* **Solusi & Implementasi:**
  - **`src/app/layout.tsx`:** Menambahkan konfigurasi `viewport` Next.js dengan `viewportFit: 'cover'`, `initialScale: 1`, `maximumScale: 1`, serta menyematkan kelas `overflow-hidden overscroll-none` pada `html` dan `body`.
  - **`src/app/globals.css`:** Menetapkan tinggi 100% dan `overflow: hidden; overscroll-behavior: none;` pada `html, body` sehingga jendela peramban utama tidak dapat bergeser atau memicu scroll bar dokumen.
  - **`src/app/page.tsx`:** Mengubah wadah utama aplikasi menjadi `fixed inset-0 h-[100dvh] max-h-[100dvh] w-full overflow-hidden flex flex-row`.
  - **`src/components/Header.tsx`:** Memastikan header terkunci kuat di posisi paling atas (`sticky top-0 z-30 w-full flex-shrink-0`).
  - **`src/components/ChatUI.tsx` & Modal:** Menambahkan `overscroll-contain` pada kontainer scroll pesan chat, modul hafalan, dan modal riset agar interaksi scroll pengguna hanya bergulir di area konten masing-masing tanpa mempengaruhi jendela browser.

---

### 2. Modul Muraja'ah Hafalan: Pengacakan Pilihan Jawaban & Pilihan Jumlah Soal
* Mengatasi masalah posisi kunci jawaban yang sebelumnya selalu berada di opsi 'A'.
* Menambahkan algoritma pengacakan Fisher-Yates (`shuffleArray`) pada opsi jawaban (A, B, C, D) saat sesi hafalan dimulai.
* Menambah bank soal dari 8 menjadi 15 soal komprehensif mencakup Matan Jurumiyyah, Fathul Qarib, dan Ta'lim Muta'allim.
* Menyediakan selektor jumlah pertanyaan: **5 Soal** (Uji Kilat), **10 Soal** (Standar), dan **15 Soal** (Lengkap).

---

### 3. Pembaruan Terminologi & Status Fitur
* **Modal Arsitektur & Riset:** Mengubah badge OCR Vision dari yang semula berlabel *"Riset Lanjutan"* menjadi *"Aktif & Terintegrasi"* karena fitur multimodal OCR naskah fisik kitab kuning telah selesai diintegrasikan.
* **Modul Korpus Literatur:** Mengganti label klise *"Kurikulum Terverifikasi"* menjadi istilah pesantren yang lebih otentik dan presisi, yaitu *"Rujukan Mu'tamad"*.

---

### 4. Optimalisasi Tampilan Share Link (OpenGraph & Meta Preview)
* Memperbarui tautan pratinjau media sosial (WhatsApp, Telegram, Facebook, Twitter) agar menampilkan logo resmi pesantren (`/logo-dayah.png`).
* Menghubungkan metadata dinamis pada `src/app/layout.tsx` dan membuat file route `src/app/opengraph-image.png` berbasis `public/logo-dayah.png`.

---

### 5. Panduan Pembaruan pada Server VPS
Untuk menerapkan pembaruan ini di VPS produksi, jalankan:
```bash
cd /var/www/asisten-kaji-kitab
git pull origin master
npm run build
pm2 restart asisten-kaji-kitab
```
