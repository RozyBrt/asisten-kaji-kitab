# Catatan Pengembangan & Penyempurnaan Final (14 Oktober 2026)

## Pengantar & Status Rilis Final
Dokumen ini merangkum seluruh pembaruan, perbaikan kritis, dan inovasi arsitektur tahap akhir yang diselesaikan pada tanggal **14 Oktober 2026**, menjelang pengiriman tautan dan penilaian resmi oleh Dewan Juri Lomba Karya Ilmiah.

Fokus utama pada pembaruan pamungkas ini adalah **penyempurnaan pembuktian ilmiah naskah rujukan (Digital Turats Verification)**, yaitu menghadirkan verifikasi halaman naskah fisik secara presisi, mandiri (*self-hosted*), serta responsif di semua perangkat (Desktop, Laptop, Tablet, dan Smartphone).

---

## 1. Penyempurnaan Korpus Naskah Lengkap Al-Kawakib Al-Durriyyah
* **Latar Belakang:** Sebelumnya, rujukan hanya mengandalkan sampel bab dasar dan kutipan AI rentan terhadap ketidaktepatan nomor halaman fisik.
* **Implementasi:**
  - Seluruh naskah naskah kitab **Intisari Al-Kawakib Al-Durriyyah Syarah Mutammimah Al-Jurumiyyah** (terbitan Dayah Perbatasan Minhajussalam, tebal 284 halaman PDF / 272 halaman buku) telah diekstrak dan diindeks secara komprehensif ke dalam file basis data:
    `src/data/al-kawakib-index.json` (754 KB, memuat **558 potongan naskah/chunks**).
  - Setiap potongan naskah diikat dengan metadata otentik:
    * `id`: ID unik segmen (misal `kawakib-p75-c1`).
    * `pdfPage`: Nomor halaman fisik file PDF (contoh: 75).
    * `bookPage`: Nomor halaman kitab fisik (contoh: Hal. 63).
    * `bab`: Nama bab spesifik (contoh: *Bab Mubtada' dan Khabar*).
    * `pdfUrl`: Tautan langsung pembaca naskah (`/baca?page=75`).
    * `text`: Teks matan Arab asli berharakat lengkap beserta uraian syarah kaidah nahwunya.
  - Mesin pencari naskah pada `src/lib/vectorStore.ts` menggunakan pencarian *hybrid* berkecepatan tinggi (< 0,1 detik) yang mencakup istilah nahwu spesifik dan teks Arab-Latin.

---

## 2. Inovasi "Verified Source Binding" (Eliminasi Halusinasi AI)
* **Permasalahan Ilmiah:** Model Bahasa Alami (LLM) umumnya memiliki kelemahan halusinasi (*citation hallucination*) ketika diminta menyebutkan nomor halaman buku fisik spesifik.
* **Solusi Arsitektur (`bindVerifiedSources`):**
  - Pada `src/app/api/chat/route.ts`, sistem tidak lagi membiarkan AI menebak atau mengarang nomor halaman.
  - Ketika mesin RAG menemukan potongan naskah yang relevan, server **secara otomatis mengunci (*bind*)** nomor halaman kitab asli (`bookPage`) dan halaman PDF (`pdfPage`) dari data fisik naskah tersebut.
  - Kartu rujukan yang ditampilkan ke pengguna memiliki tautan valid `Hal. X (PDF Hal. Y)` yang 100% bersumber dari naskah fisik, bukan hasil tebakan AI.

---

## 3. Pengembangan Pembaca Naskah Mandiri (*Dedicated Interactive Reader* `/baca?page=X`)
* **Permasalahan Sebelumnya:** 
  Pada browser smartphone (Google Chrome Mobile, Brave Mobile), tautan standar `#page=X` pada file PDF selalu diabaikan oleh PDF viewer bawaan browser HP, sehingga pengguna selalu terlempar ke halaman sampul (halaman 1).
* **Solusi & Implementasi:**
  - Membuat route mandiri berbasis web Next.js App Router: `src/app/baca/page.tsx`.
  - Mengintegrasikan mesin render **Mozilla PDF.js v3.11.174** yang di-host secara lokal (*self-hosted*) di folder `public/pdfjs/` tanpa bergantung pada CDN pihak ketiga (sehingga kebal dari pemblokiran Brave Shields / AdBlock).
  - Menghubungkan parameter URL `?page=X` dengan mesin render Canvas HTML5, sehingga begitu kartu rujukan diklik, halaman yang dimaksud langsung terbuka seketika.
  - Menambahkan dukungan navigasi gestur sentuh seluler (*touch swipe gesture*): geser layar ke kiri untuk halaman berikutnya dan ke kanan untuk halaman sebelumnya.

---

## 4. Optimalisasi Tampilan Responsif Desktop/Laptop (Fit-Height & HiDPI Sharpness)
* **Permasalahan Tampilan Awal:**
  Karena naskah kitab berukuran rasio cetak A5 (lebar ~420pt, tinggi ~595pt), penskalaan lebar 900px di layar laptop menyebabkan tinggi kanvas membengkak hingga 1.488px. Pengguna harus melakukan scroll vertikal 2 layar penuh untuk membaca 1 halaman, dan tampilan baru terasa nyaman ketika pengguna mengecilkan zoom browser secara manual ke 50%.
* **Penyempurnaan Tampilan:**
  - **Mode Otomatis Cerdas:**
    * **Laptop/Desktop (Layar $\ge 768px$):** Default otomatis menggunakan mode **"Pas Layar" (`fit-height`)**, di mana tinggi kanvas disesuaikan dengan tinggi layar (`window.innerHeight - navbar`). Satu halaman kitab tampil utuh dan proporsional di tengah layar tanpa perlu scroll vertikal.
    * **Smartphone (Layar $< 768px$):** Default otomatis menggunakan mode **"Pas Lebar" (`fit-width`)**, agar huruf Arab dan terjemahan memenuhi lebar layar ponsel dan nyaman dibaca.
  - **Tombol Toggle "Pas Layar" / "Pas Lebar":** Disediakan tombol pengalih di topbar serta shortcut keyboard tombol `F` untuk fleksibilitas membaca.
  - **Kontrol Zoom Reaktif & Tajam:**
    * Tombol zoom (`-`, `+`, dan klik persentase untuk reset `100%`) kini langsung merender ulang kanvas seketika (*instant reactive render*).
    * Menggunakan resolusi buffer internal berbasis `window.devicePixelRatio` (dukungan layar Retina/HiDPI), sehingga huruf Arab dan catatan kaki tetap tajam tanpa blur/pecah.
  - **Fitur Lompat Halaman Cepat (*Quick Jump*):** Pengguna dapat mengklik teks nomor halaman untuk langsung mengetik nomor halaman yang dituju.
  - **Dukungan Pintasan Keyboard:** `←` / `→` untuk membalik halaman, `F` untuk toggle pas layar, `+` / `-` untuk zoom, dan `0` untuk reset zoom.

---

### 4.4 Sanitasi Kartu Rujukan Percakapan & Chit-Chat (Zero-Citation on Greetings)
- **Problem:** Ketika santri/pengguna mengucapkan salam santun atau ucapan terima kasih lanjutan (misal: *"oke baik. Terimakasih"*), sistem sempat menampilkan rujukan Bab Kalam (Hal. 1-3).
- **Penyebab:** Evaluasi regex pola tunggal belum mencakup variasi kombinasi kata santun majemuk, serta mekanisme *fallback* pencarian vektor sempat memilih chunk pertama saat skor relevansi bernilai 0.
- **Solusi Ilmiah & Arsitektur:**
  1. *Token-Based Courtesy Filter:* Menerapkan filter berbasis *Set of Courtesy Tokens* yang secara cerdas mendeteksi segala kombinasi kata santun pesantren (terima kasih, jazakallah, syukran, alhamdulillah, siap ustadz, dll).
  2. *Strict Zero-Source Guarantee:* Pada respon chit-chat/ungkapan terima kasih, `sources` dipaksa kosong (`[]`) dan `arabicText` dikosongkan (`''`), sehingga jawaban tampil murni sebagai respon dialog yang hangat tanpa memaksakan rujukan kitab.
  3. *Zero-Score Vector Guard:* Pada `vectorStore.ts`, jika tidak ada kandidat bab dengan relevansi > 0.1, sistem mengembalikan array kosong (`[]`) daripada memaksakan bab acak/halaman pertama.

---

## 5. Ringkasan Kesiapan Akhir untuk Dewan Juri Lomba
Aplikasi web **Asisten Kaji Kitab & Turats** (`asisten-kajian.online`) kini telah berada pada kondisi prima (*production-ready*) dengan keunggulan ilmiah:

1. **Orisinalitas Turats Digital:** Berfokus pada naskah otentik *Intisari Al-Kawakib Al-Durriyyah Syarah Mutammimah Al-Jurumiyyah* karya ulama Dayah Perbatasan Minhajussalam.
2. **Kredibilitas Rujukan:** Setiap jawaban kaidah nahwu disertai dalil matan Arab berharakat utuh dan tombol verifikasi lembar naskah fisik yang akurat.
3. **Aksesibilitas Multi-Platform:** Bekerja optimal baik saat diakses oleh dewan juri melalui komputer desktop, laptop, maupun smartphone seluler.
4. **Keamanan & Kemandirian:** Seluruh dependensi PDF.js dan korpus naskah tersimpan di server sendiri (*self-contained*), cepat, dan stabil.
