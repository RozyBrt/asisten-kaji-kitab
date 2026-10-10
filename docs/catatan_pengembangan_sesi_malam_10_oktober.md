# Rekap Pembaruan & Peningkatan Sistem (Sesi Malam, 10 Oktober 2026)

Dokumen ini mencatat seluruh implementasi teknis, perbaikan bug, dan penguatan keamanan yang diselesaikan pada sesi malam 10 Oktober 2026 sebagai persiapan Lomba Karya Ilmiah.

---

## 1. Penanaman Korpus Kitab Turats Inti (.vector-store.json)
* **Latar Belakang:** Sebelumnya file `.vector-store.json` masih kosong (`[]`), sehingga saat sistem pertama kali dijalankan, sistem RAG lokal belum memiliki basis pengetahuan fisik.
* **Implementasi:**
  * Dibuatkan seeder data yang menghasilkan **12 chunk teks turats lengkap dengan vektor embedding asli** menggunakan model `text-embedding-3-small` (SumoPod/OpenAI).
  * **Kitab yang Ditanam:**
    1. **Matan Safinatun Najah (6 Fasal):** Rukun Islam/Iman, Tanda Baligh & Istinja, Syarat & Rukun Wudhu, Pembatal Wudhu & Mandi Janabah, Rukun Shalat, serta Syarat & Pembatal Puasa.
    2. **Fathul Qarib al-Mujib (3 Bab):** Pembagian 4 Macam Air Thaharah, 3 Tingkatan Najis & Pensuciannya, serta Syarat Sah Shalat Berjamaah.
    3. **Ta'limul Muta'allim (3 Fasal):** Niat Menuntut Ilmu, Memilih Guru & Sahabat Belajar, serta Tata Cara Mengagungkan Ilmu dan Guru.
  * **Ukuran File Efisien:** Total ukuran file `.vector-store.json` hanya **485 KB** (18.578 baris JSON), sangat ringan untuk dibaca secara lokal tanpa membebani memori laptop.

---

## 2. Penyediaan Berkas PDF Sampel Resmi untuk Demo Live
* **Latar Belakang:** Pengguna belum memiliki file berkas PDF yang siap diunggah saat juri meminta demonstrasi pengunggahan file secara langsung.
* **Implementasi:**
  * Dibuatkan berkas PDF uji coba otentik di direktori: `sample-kitab/Safinatun_Najah_Bab_Puasa.pdf`.
  * Memuat materi Fikih Puasa (5 Syarat Wajib, 10 Pembatal Puasa, serta hukum khusus menelan ludah murni).
  * Siap dipakai kapan saja saat demo pengujian di depan juri.

---

## 3. Perbaikan Bug Kritis Ekstraksi PDF (unpdf Buffer Transfer)
* **Masalah:** Saat mengunggah berkas PDF, pustaka `unpdf` memicu error: `Cannot transfer object of unsupported type` akibat penggunaan shared buffer di lingkungan Node.js.
* **Solusi:**
  * Memperbarui fungsi `toCleanUint8Array` di `src/lib/pdfExtractor.ts` dengan menyalin buffer ke `ArrayBuffer` murni sebelum diekstrak oleh engine PDF.
  * Berkas PDF berhasil diunggah dan terindeks mulus 100% tanpa error 500.

---

## 4. Proteksi Keamanan Dokumen Kurikulum Inti (Role & Data Integrity)
* **Masalah:** Pengguna atau juri berisiko tidak sengaja mengklik tombol tong sampah (Hapus) pada kitab-kitab kurikulum bawaan di menu "Dokumen Terindeks", yang mengakibatkan data vektor terhapus.
* **Solusi Berlapis:**
  1. **Lapis Tampilan Web (`UploadUI.tsx`):**
     * Menghapus tombol tong sampah untuk kitab inti (`safinatun-najah`, `fathul-qarib`, `talimul-mutaallim`).
     * Menampilkan lencana hijau elegan: **`🔒 Kitab Inti`** (*Kurikulum Inti Pesantren — Dilindungi Sistem*).
     * Tombol hapus hanya aktif untuk berkas baru yang diunggah mandiri oleh pengguna.
  2. **Lapis Backend Server (`rag/route.ts` & `vectorStore.ts`):**
     * Memasang penolak otomatis status `403 Forbidden` jika ada upaya penghapusan dokumen inti via API.
     * Mencegah pemanggilan fungsi `deleteDocument` untuk dokumen terlindungi.

---

## 5. Verifikasi & Pengujian Mutu (Quality Assurance)
* **TypeScript Compilation:** Diuji dengan `npx tsc --noEmit` &rarr; **0 Error (Bersih)**.
* **Uji Permintaan API:**
  * Endpoint `POST /api/chat` berhasil merespons hukum najis mughalladhah dari data lokal `Fathul Qarib`.
  * Endpoint `DELETE /api/rag` berhasil menolak penghapusan kitab inti (`HTTP 403`).
* **Status Web:** Berjalan stabil pada `http://localhost:3000` (`HTTP 200 OK`).
