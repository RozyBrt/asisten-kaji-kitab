# Rencana Implementasi & Spesifikasi Teknis: Fokus Tunggal Kitab Al-Kawakib Ad-Durriyyah

## 1. Latar Belakang & Hasil Musyawarah Dayah

Berdasarkan hasil musyawarah dan pengujian langsung bersama pihak pimpinan dan asatidzah Dayah Perbatasan Minhajussalam, disepakati beberapa arahan strategis untuk menyempurnakan platform **Asisten Kaji Kitab & Turats**:

1. **Fokus Tunggal Kurikulum Nahwu Dayah:**
   * Pengujian awal menunjukkan bahwa saat santri/guru menanyakan kaidah nahwu, jawaban AI terkadang kurang spesifik atau terdistraksi materi fiqih umum.
   * Dayah menghendaki materi difokuskan **100% pada naskah buku/kitab pegangan resmi santri**, yaitu:  
     **"INTISARI KITAB AL-KAWAKIB AL-DURRIYYAH SYARAH MUTAMMIMAH AL-JURUMIYYAH"**  
     *(Penyusun: Iswandi El-Nisamy, Editor: Tgk. Dr. Safriadi, MA, Penerbit: CV. Manhaji Medan, 2020)*.
2. **Pembersihan Materi Fiktif / Luar Kurikulum:**
   * Materi mock awal seperti *Matan Safinatun Najah (Fiqih Ibadah)*, *Fathul Qarib al-Mujib (Fiqih Syafi'i)*, dan *Ta'limul Muta'allim (Adab)* dihapus sepenuhnya dari korpus agar sistem tidak bias.
3. **Verifikasi Transparan Melalui Unduh & Rujukan Halaman PDF:**
   * Jawaban AI wajib menyertakan informasi nomor halaman buku dan nomor halaman file PDF.
   * Pada setiap jawaban AI di web, disediakan tombol interaktif untuk **membuka halaman spesifik** dan **mengunduh file PDF rujukan** agar santri dan dewan guru dapat langsung memverifikasi keabsahan ibarat kitab.

---

## 2. Profil & Verifikasi File Rujukan

File PDF telah diverifikasi di dalam direktori proyek: `rujukan/INTISARI KITAB AL-KAWAKIB AL-DURRIYYAH SYARAH MUTAMMIMAH AL-JURUMIYYAH.pdf`.

### Karakteristik Naskah:
* **Ukuran Berkas:** 1.770.893 bytes (~1,77 MB).
* **Total Halaman PDF:** **284 Halaman**.
* **Total Halaman Pokok Kitab:** **272 Halaman**.
* **Pemetaan Nomor Halaman (Offset):**
  - **Halaman PDF 1 s.d. 12:** Memuat halaman romawi (`~ i ~` s.d. `~ xii ~`) yang berisi Cover Judul, Redaksi Penerbit, Kata Pengantar Editor, Sambutan Ulama Dayah, dan Daftar Isi Lengkap.
  - **Halaman PDF 13 s.d. 284:** Memuat halaman isi naskah utama (`~ 1 ~` s.d. `~ 272 ~`) dimulai dari Bab Al-Kalam hingga Bab Idhafah dan kaidah gramatika penutup.
* **Kualitas Ekstraksi Teks:**  
  Naskah merupakan dokumen digital asli (*searchable digital text*) dengan **440.381 karakter teks** yang sangat bersih, memuat aksara Arab matan berharakat, kaidah nahwu, skema i'rab, serta uraian terjemah syarah dalam bahasa Indonesia.

---

## 3. Fitur Baru: Navigasi & Download PDF Interaktif

Pada kartu sitasi jawaban AI di ruang chat, akan ditambahkan fitur verifikasi langsung:

1. **Penyajian Metadata Presisi:**
   > **Kitab:** Intisari Al-Kawakib Al-Durriyyah  
   > **Bab:** Bab Al-Kalam wa Aqsamuhu  
   > **Halaman Kitab:** Halaman 3 (File PDF: Halaman 15)  
2. **Aksi Interaktif:**
   * Tombol **"Buka Halaman [X] di PDF"**: Membuka berkas PDF langsung meloncat ke halaman yang dirujuk menggunakan parameter browser URL (`#page=15`).
   * Tombol **"Unduh Kitab PDF Lengkap"**: Memungkinkan santri mengunduh berkas PDF utuh ke perangkat komputer atau smartphone.

---

## 4. Tahapan Rencana Kerja (Implementation Plan)

Berikut 6 langkah eksekusi bertahap yang akan dijalankan setelah rencana ini disetujui:

### Tahap 1: Pembuatan Endpoint Akses PDF
* Menyediakan route file statis/API Next.js (misal `/api/pdf/al-kawakib`) agar browser dapat membaca dan menampilkan file PDF dari folder `rujukan/`.
* Mendukung fitur penelusuran peramban modern dengan URL hash: `/api/pdf/al-kawakib#page=15`.

### Tahap 2: Ekstraksi Teks & Indexing Vektor 284 Halaman
* Membuat skrip otomatis (`scripts/index_al_kawakib.ts`) untuk membaca 284 halaman PDF menggunakan `unpdf`.
* Mengekstrak setiap halaman beserta penanda nomor halamannya:
  - `pdfPage`: 1 - 284
  - `bookPage`: 1 - 272 (atau romawi untuk pendahuluan)
  - `babTitle`: Mengidentifikasi judul bab/fasal berdasarkan heading naskah.
* Membagi naskah menjadi potongan *chunk* semantik (500–800 karakter) dengan overlap 100 karakter.
* Menyimpan representasi teks dan vektor ke dalam `.vector-store.json` lokal yang diprioritaskan untuk modul RAG.

### Tahap 3: Pembersihan & Restrukturisasi Data Korpus
* **`src/lib/mock-data.ts`:**
  - Menghapus mock responses untuk materi fiqih (*Safinatun Najah*, *Fathul Qarib*) dan adab (*Ta'limul Muta'allim*).
  - Mengubah `mockDocuments` agar menampilkan **Intisari Kitab Al-Kawakib Al-Durriyyah (284 Halaman)** sebagai rujukan tunggal mu'tamad Dayah.
  - Mengubah **Quick Prompts** menjadi 6 topik inti Nahwu:
    1. *Kaidah Kalam & Syaratnya*
    2. *Tanda I'rab Rofa' (Dhommah, Wawu, Alif, Nun)*
    3. *Amil Nawasikh: Kaana & Inna*
    4. *Perbedaan Fa'il & Na'ibul Fa'il*
    5. *Tawabi': Na'at, 'Athaf, Taukid, Badal*
    6. *Isim-Isim yang Dimanshubkan*

### Tahap 4: Pembaruan System Prompt AI (`src/app/api/chat/route.ts`)
* Menginstruksikan LLM (SumoPod / Gemini) bahwa otoritas keilmuan sistem **khusus dan terfokus pada Kitab Al-Kawakib Ad-Durriyyah Syarah Mutammimah Al-Jurumiyyah**.
* Setiap jawaban wajib menyertakan:
  1. Uraian kaidah nahwu sesuai penjelasan kitab.
  2. Matan Arab berharakat dari naskah Al-Kawakib.
  3. Nomor Halaman Kitab dan Nomor Halaman PDF.
  4. URL tautan PDF rujukan.

### Tahap 5: Pembaruan Antarmuka Pengguna (`ChatUI.tsx` & `UploadUI.tsx`)
* Memperbarui komponen `SourceCard` di `ChatUI.tsx` agar menampilkan tombol aksi:
  - 📖 **Buka Halaman [X]** (membuka modal / tab PDF pada halaman naskah).
  - 📥 **Unduh Naskah PDF**.
* Memperbarui halaman Korpus (`UploadUI.tsx`) untuk menampilkan status pengindeksan 284 halaman Al-Kawakib.

### Tahap 6: Evaluasi Modul Muraja'ah Hafalan (`HafalanUI.tsx`)
* Meminta konfirmasi pihak Dayah: Apakah kuis hafalan ingin disesuaikan dengan hafalan **Matan Al-Jurumiyyah / Nadhom Imrithi** (nahwu), atau tetap hafalan **Surah Al-Qur'an (Juz 'Amma)** sebagai fitur pendamping.

---

## 5. Ringkasan Dampak & Hasil Akhir
Dengan implementasi ini:
* **Akurasi Jawaban Nahwu:** Meningkat drastis karena bersumber langsung dari 440.000+ karakter naskah asli buku pegangan santri.
* **Transparansi Ilmiah:** Santri dan Ustadz dapat mengklik halaman rujukan dan melihat langsung lembaran naskahnya di layar.
* **Kerapian Aplikasi:** Tidak ada lagi materi fiktif yang tumpang tindih; web menjadi aplikasi telaah nahwu resmi Dayah Minhajussalam yang kredibel.
