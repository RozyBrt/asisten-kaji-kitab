# Rekap Pembaruan & Peningkatan Sistem (Sesi Malam, 12–13 Oktober 2026)

**Proyek:** Asisten Kaji Kitab & Turats — Dayah Perbatasan Minhajussalam  
**Tanggal:** 12–13 Oktober 2026  
**Status Implementasi:** Selesai, Teruji, dan Ter-push ke Branch `master` (`commit: d1f97c9`)

---

## 1. Ringkasan Eksekutif Pembaruan Malam Ini

Pada sesi pengembangan malam ini, fokus utama adalah mematangkan alur kerja **Multimodal OCR Naskah Kitab**, fitur pelaporan **Ekspor Seluruh Percakapan (PDF)**, serta menuntaskan masalah **RAG Drift / Halusinasi Melompat Topik** saat pengguna mengirimkan respon singkat (*chit-chat*) atau pertanyaan lanjutan (*follow-up*).

---

## 2. Rincian Pembaruan Teknis

### A. Alur Kerja Multimodal Vision OCR Kitab Turats
* **Dua Model Cerdas Berdasarkan Tipe Input:**
  * **Input Gambar (Foto Naskah Kitab):** Diproses menggunakan model Vision SumoPod berakurasi tinggi (`gemini/gemini-3.7-flash`). Mampu membaca tulisan Arab gundul/pegon, mentranskripsikannya ke teks Arab berharakat rapi di kolom `arabicText`, serta membedah terjemah dan syarah fiqihnya secara mendalam.
  * **Input Teks Murni:** Diproses secara cepat dan hemat menggunakan model `gpt-4o-mini`.
* **Tampilan UI Terstruktur:**
  * Ditampilkan badge *"Hasil OCR Naskah"* dan kotak khusus *"Matan Arab / Teks Nash"* yang terpisah rapi dari uraian syarah fiqih.

---

### B. Fitur Unduh Seluruh Percakapan ke Format PDF
* **Tombol Global di Header Chat:**
  * Disediakan tombol *"Unduh Seluruh Percakapan (PDF)"* di header percakapan.
  * Berbeda dari tombol unduh per-jawaban, fitur ini mengompilasi seluruh riwayat dialog (dari pertanyaan pertama, kiriman foto naskah, hingga tanya-jawab lanjutan) ke dalam satu berkas PDF komprehensif.
* **Perbaikan Format Rendering:**
  * Mengatasi kendala tampilan markdown mentah (`**`, `#`) pada pesan chat dan berkas PDF dengan konversi terstruktur ke elemen HTML dan typography yang bersih.
  * Foto naskah kitab yang dikirim pengguna kini turut tersemat rapi di dalam PDF sebagai bukti autentik telaah naskah.

---

### C. Penyelesaian Tuntas Bug "AI Melompat Topik / Halusinasi RAG"
* **Latar Belakang Masalah:**
  * Ketika pengguna sedang membahas *Bab Tata Cara Mandi Wajib* (dari naskah yang difoto), lalu bertanya *"jelaskan lebih rinci"*, AI tiba-tiba berpindah ke kitab *Safinatun Najah (Rukun Shalat)*.
  * Kemudian saat pengguna hanya merespon *"oke baik"*, AI kembali melompat ke kitab *Ta'limul Muta'allim (Memilih Guru & Teman Belajar)*.
* **Akar Masalah (Root Cause):**
  1. **Pencarian Vektor Tanpa Ambang Batas (*No Similarity Threshold*):** Fungsi `similaritySearch()` pada `src/lib/vectorStore.ts` sebelumnya tidak memiliki batas minimal skor kemiripan. Akibatnya, kata-kata umum seperti *"oke baik"* tetap dipaksakan mengambil 4 cuplikan kitab teratas di database meskipun nilai kemiripannya mendekati 0.
  2. **Injeksi Konteks RAG yang Memaksa AI:** Sistem menyisipkan format `=== KONTEKS DARI KITAB YANG TELAH DIUPLOAD (GUNAKAN INI SEBAGAI RUJUKAN UTAMA) ===` pada setiap pesan, sehingga model AI merasa berkewajiban merangkum kitab tersebut untuk menjawab respon *"oke baik"*.
  3. **Belum Ada Penanganan Pesan Santai (*Chit-chat*) & Pertanyaan Lanjutan (*Follow-up*):** Kalimat konfirmasi dan salam diperlakukan sama seperti pertanyaan ilmiah turats yang berat.
* **Solusi & Implementasi:**
  1. **Ambang Batas Skor Kemiripan (`minScore = 0.48`):** Pada `src/lib/vectorStore.ts`, pencarian vektor kini menyaring hasil dengan `scored.filter(s => s.score >= minScore)`. Cuplikan yang tidak relevan tidak akan pernah dimasukkan ke dalam prompt.
  2. **Pendeteksi Respon Singkat & Salam (`isChitChatMessage`):** Pada `src/app/api/chat/route.ts`, frasa seperti *"oke"*, *"oke baik"*, *"terima kasih"*, *"syukron"*, *"alhamdulillah"*, *"siap ustadz"* otomatis mematikan pencarian RAG. AI merespon dengan ramah, santun, dan ringkas (1–2 kalimat) tanpa mengarang kajian kitab baru. Kartu rujukan kitab dan matan Arab otomatis dikosongkan (`[]`).
  3. **Pendeteksi Pertanyaan Lanjutan (`isFollowUpQuery`):** Frasa seperti *"jelaskan lebih rinci"*, *"apa dalilnya"*, *"maksudnya bagaimana"* diinstruksikan untuk memperdalam topik dari percakapan sebelumnya (*conversation history*), menjaga kontinuitas kajian tanpa berpindah ke kitab lain.
  4. **Pembersihan Prompt Injection:** Menghapus injeksi otomatis daftar metadata kitab jika tidak ada cuplikan teks yang benar-benar relevan.

---

## 3. Berkas yang Diperbarui

| Lokasi Berkas | Perubahan Utama |
|---|---|
| `src/lib/vectorStore.ts` | Penambahan parameter `minScore = 0.48` pada `similaritySearch` untuk mencegah *garbage matching*. |
| `src/app/api/chat/route.ts` | Penambahan fungsi `isChitChatMessage` & `isFollowUpQuery`, proteksi injeksi RAG, dan penguatan aturan sistem anti-halusinasi. |
| `src/components/ChatUI.tsx` | Penambahan tombol *"Unduh Seluruh Percakapan (PDF)"*, integrasi PDF riwayat dialog, dan perbaikan rendering teks. |

---

## 4. Status Deployment & Verifikasi
* **Build Test:** `npm run build` sukses 100% tanpa error TypeScript maupun linting.
* **Git Versioning:** Seluruh perubahan telah di-commit dengan pesan `fix(chat): cegah halusinasi RAG pada respon singkat dan pertanyaan lanjutan` dan di-push ke branch `origin master` (`d1f97c9`).
* **Instruksi Deploy VPS:**
  ```bash
  cd ~/asisten-kaji-kitab
  git pull origin master
  npm run build
  pm2 restart asisten-kaji-kitab
  ```

---

## 5. Rencana & Agenda Pengembangan Besok: Modul Muraja'ah Hafalan

Besok pengembangan akan difokuskan pada peningkatan fitur pada halaman **Muraja'ah Hafalan** (`src/components/HafalanUI.tsx`):

1. **Evaluasi Status Saat Ini:**
   * Antarmuka menu Muraja'ah telah memiliki tata letak 3 modul (Sambung Ayat, Tebak Surah, Isi Lanjutan) dan simulasi sesi 5 soal.
   * Sumber soal saat ini masih mengandalkan data tiruan (*mock data*) statis pada `mockHafalanQuestions`.
2. **Target Peningkatan Besok:**
   * **Integrasi AI Generator Soal (SumoPod/Gemini):** Membuat API route khusus `/api/hafalan/generate` agar soal dapat digenerate secara dinamis dan tidak berulang.
   * **Pemilihan Kategori / Target Juz:** Memberikan opsi bagi santri untuk memilih juz tertentu (misal: Juz 30 / Juz 'Amma) atau memilih Muraja'ah Matan Kitab Kuning (misal: Matan Al-Ajurrumiyyah / Safinatun Najah).
   * **Fitur Umpan Balik & Pembahasan Tajwid/Makna:** Menyajikan penjelasan tajwid dan terjemah ketika santri memilih jawaban benar/salah.
   * **Penyempurnaan Skor & Rekap Hasil:** Tampilan hasil muraja'ah dengan badge apresiasi (*Mumtaz*, *Jayyid Jiddan*, *Maqbul*) yang dapat diunduh atau dibagikan.
