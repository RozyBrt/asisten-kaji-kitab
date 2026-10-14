# Profil Lengkap Sistem, Korpus Rujukan, & Inventarisasi Fitur
## Platform "Asisten Kaji Kitab & Turats" — Meja Telaah Turats & Penelusuran Sanad
**Dayah Perbatasan Minhajussalam — Kota Subulussalam, Aceh**
*Dokumen Resmi Pengenalan Sistem, Inventarisasi Literatur, & Bahan Pemaparan Pesantren / Lomba Karya Ilmiah*

---

## 1. Pendahuluan & Filosofi Dasar Sistem

### 1.1 Latar Belakang & Urgensi
Kitab Turats (literatur klasik Islam atau *kitab kuning*) merupakan pilar utama transmisi keilmuan Islam di dunia pesantren. Namun, dalam konteks santri pemula dan generasi digital, terdapat sejumlah tantangan besar dalam menelaah naskah klasik:
1. **Aksara Arab Gundul & Dialektika Klasik:** Teks tanpa harakat dan susunan gramatika nahwu-sharaf yang padat.
2. **Keterbatasan Waktu & Silang Rujukan (*Cross-Referencing*):** Kesulitan menelusuri kaitan antara satu matan hukum dengan syarah di kitab-kitab lain secara cepat dan akurat.
3. **Bahaya Halusinasi AI Generik:** Chatbot AI komersial umum (seperti ChatGPT mentah) sering kali berhalusinasi, mengarang hukum, atau mencatut nama ulama dan nama kitab secara serampangan (*false attribution*).

Platform **Asisten Kaji Kitab & Turats** dibangun sebagai prototipe karya ilmiah yang memadukan khazanah keilmuan salaf dengan teknologi **Ethical Grounded AI & Hybrid RAG (Retrieval-Augmented Generation)**.

### 1.2 Prinsip Etika: AI Sebagai *Khadim*, Bukan *Mufti*
Sistem ini memegang teguh adab keilmuan Islam:
* **Kedudukan AI:** AI murni diposisikan sebagai **Khadim / Asisten Penelusuran** (alat bantu penelusuran ibarat naskah dan perbandingan teks).
* **Bukan Pembuat Fatwa:** AI **bukanlah Mufti** yang berwenang menetapkan hukum syariat secara independen.
* **Otoritas Sanad:** Keputusan hukum, fatwa, dan bimbingan ruhaniyah mutlak berada pada bimbingan **Masyaikh, Dewan Guru, dan Asatidzah** yang memiliki sanad keilmuan bersambung (*muttashil*).

---

## 2. Tiga Modul Utama yang Terkandung di Dalam Web

Aplikasi web ini terbagi ke dalam 3 ruang kerja terpadu:

### 2.1 Modul 1: Meja Telaah Kitab & Turats (Chatbot AI Interaktif)
Ruang kerja utama tempat santri atau pengkaji berdiskusi dan menelaah naskah.
* **Tanya-Jawab Terstruktur:** Jawaban AI disajikan dengan susunan:
  1. *Uraian Syarah & Penjelasan Konseptual* (bahasa Indonesia yang lugas dan berbobot).
  2. *Teks Matan Arab Berharakat* (ditampilkan dengan tipografi naskah klasik *Amiri font*).
  3. *Kartu Sitasi Kitab Rujukan* (menyebutkan nama kitab, pengarang, bab/fasal, dan referensi naskah).
* **Multi-Provider AI Cerdas:**
  - **SumoPod (OpenAI-compatible):** Model LLM berkecepatan tinggi untuk penalaran teks dan embedding vektor.
  - **Google Gemini API:** Mesin pemrosesan teks dan multimodal vision.
  - **Simulasi / Fallback Mock:** Jika kunci API habis atau koneksi terputus, sistem tetap dapat mendemonstrasikan jawaban kurasi ilmiah tanpa error.
* **Multimodal Vision OCR Kitab Kuning:**
  - Fitur mutakhir untuk memotret/mengunggah langsung lembaran fisik kitab kuning.
  - AI membaca aksara Arab naskah fisik, mentranskripsikannya ke teks digital, dan menjabarkan syarah pembahasannya.
  - Tersedia tombol uji cepat **"Ambil Foto / Unggah Naskah"** dan demo citra bab Wudhu untuk pengujian instan.
* **Ekspor Risalah Kajian Lengkap ke Dokumen PDF:**
  - Tombol **"Unduh Seluruh Percakapan (PDF)"** yang otomatis memformat seluruh dialog tanya-jawab menjadi risalah resmi pesantren ber-kop Dayah Minhajussalam yang rapi, bernomor halaman, dan siap dicetak/diarsipkan.
* **Topik Penelusuran Populer (Quick Prompts Nahwu):**
  - Tombol kilat untuk materi gramatika inti: *Kaidah Kalam & Syaratnya*, *Tanda I'rab Rofa'*, *Amil Kaana & Saudaranya*, *Hukum Fa'il & Na'ibul Fa'il*, *Amalan Inna wa Akhwatuha*, dan *Isim Ghairu Munsharif*.

### 2.2 Modul 2: Muraja'ah Hafalan Al-Qur'an (Gamifikasi Santri)
Modul interaktif untuk membantu santri menguji ingatan ayat dan matan secara mandiri.
* **Bank Soal:** Terdiri dari 15 soal uji sambung ayat pilihan (Surah-surah Juz 'Amma).
* **Pengacakan Pilihan Otomatis (Fisher-Yates):** Posisi opsi jawaban (A, B, C, D) diacak secara acak pada setiap sesi baru agar melatih ketelitian santri.
* **Pilihan Jumlah Soal Fleksibel:** Santri dapat memilih durasi latihan:
  - **5 Soal** (Uji Kilat / Sela-sela Waktu)
  - **10 Soal** (Sesi Standar)
  - **15 Soal** (Uji Komprehensif Lengkap)
* **Evaluasi & Refleksi:** Menampilkan skor nilai persentase, ulasan kunci jawaban yang benar, serta catatan tadabbur makna ayat.

### 2.3 Modul 3: Korpus Literatur Kitab (Knowledge Base RAG)
Repositori literatur digital yang menjadi landasan pengetahuan (*grounding*) bagi AI.
* **Katalog Kitab Rujukan Mu'tamad:** Menampilkan status kitab-kitab kurikulum inti pesantren yang telah terindeks.
* **Pusat Unggah & Ingest Dokumen:** Fasilitas bagi asatidzah untuk mengunggah berkas kitab baru (PDF, DOCX, TXT, Gambar).
* **Proses Otomatis RAG:** File yang diunggah akan diekstrak teksnya, dibagi menjadi potongan *chunk* (800 token overlap 150), lalu dibuatkan representasi vektor matematis (*embedding*) agar dapat dicari secara semantik oleh mesin AI.
* **Proteksi Kitab Inti:** Kitab-kitab kurikulum pokok terkunci aman dari penghapusan tidak sengaja.

---

## 3. Naskah Kurikulum Inti yang Menjadi Rujukan Tunggal (Fokus Pesantren)

Berdasarkan kesepakatan dan evaluasi bersama asatidzah/manajemen Dayah, sistem difokuskan secara mendalam pada naskah kurikulum resmi mereka:

### 📖 **INTISARI KITAB AL-KAWAKIB AL-DURRIYYAH SYARAH MUTAMMIMAH AL-JURUMIYYAH**
* **Pengarang / Pensyarah:** Syaikh Muhammad az-Zuhri al-Ghamrawi (Syarah atas *Mutammimah Al-Ajurrumiyyah* karya Syaikh Syamsuddin Muhammad bin Muhammad ar-Ra'ini Al-Haththab).
* **Disiplin Ilmu:** Gramatika Bahasa Arab Tingkat Lanjutan (Nahwu, I'rab, & Kaidah Tarkib Kalimat).
* **Data Berkas Naskah Fisik/Digital:**
  - File PDF: `rujukan/INTISARI KITAB AL-KAWAKIB AL-DURRIYYAH SYARAH MUTAMMIMAH AL-JURUMIYYAH.pdf`
  - Jumlah Halaman File: **284 Halaman** (Halaman 1–12 mukaddimah & daftar isi naskah; Halaman 13–284 isi materi kitab).
  - Penomoran Halaman Asli Kitab: **272 Halaman** ($Halaman\_PDF = Halaman\_Kitab + 12$).
  - Indeksasi Digital: **558 segmen/bab** terindeks secara granular dalam basis data semantik (`src/data/al-kawakib-index.json`).
* **Fitur Sitasi & Penampil PDF Terintegrasi:**
  - Setiap jawaban AI menampilkan kartu sitasi yang memuat: Nama Kitab, Bab/Fasal, Halaman Naskah Kitab, dan Halaman Berkas PDF.
  - Tombol **[Buka Halaman Rujukan]**: Langsung membuka penampil dokumen PDF pada peramban dan melompat tepat ke halaman naskah (`/api/pdf#page=X`).
  - Tombol **[Unduh PDF]**: Memfasilitasi santri dan ustadz mengunduh naskah utuh (`/api/pdf?download=1`).
* **Karakteristik Teks Bilingual & Presisi Hermeneutika:**
  - Naskah Arab berharakat (*syakl/tasykil*) disajikan otentik mendampingi syarah terjemahan bahasa Indonesia.
  - Menghilangkan pencampuran materi fardhu wudhu/fiqih di luar kurikulum nahwu yang sebelumnya ada pada prototipe awal, sehingga jawaban AI terbukti 100% relevan dengan kajian gramatika nahwu pesantren.

---

## 4. Kitab-Kitab yang Belum Dimasukkan (Roadmap Pengembangan Selanjutnya)

Untuk pengembangan tahap berikutnya bersama masyaikh Dayah, berikut adalah daftar literatur yang diusulkan untuk ditambahkan ke dalam basis data:

1. **Bidang Ushul Fiqih & Qawa'id Fiqhiyyah:**
   - *Matan Al-Waraqat fi Ushulil Fiqh* (Imam Al-Haramain Al-Juwaini)
   - *Latha'iful Isyarat* (Syaikh Abdul Hamid Kudus)
   - *Al-Asybah wan Nazha'ir* (Imam Jalaluddin As-Suyuthi) — kaidah fiqih universal (*Al-Qawa'id Al-Khamsah*).
2. **Bidang Fiqih Mazhab Syafi'i Lanjutan:**
   - *Fathul Mu'in bi Syarhi Qurratil 'Ain* (Syaikh Zainuddin Al-Malibari) — rujukan kitab kuning tingkat atas di pesantren Nusantara.
   - *Kifayatul Akhyar fi Halli Ghayatil Ikhtishar* (Imam Taqiyuddin Al-Hishni).
3. **Bidang Sastra & Balaghah:**
   - *Al-Jauharul Maknun fi Ats-Tsalatsati Funun* (Syaikh Abdurrahman Al-Akhdhari) — Ma'ani, Bayan, dan Badi'.
4. **Bidang Aqidah & Ilmu Tauhid:**
   - *Tijanud Darari* (Syaikh Nawawi Al-Bantani).
   - *Kifayatul 'Awam* (Syaikh Muhammad Al-Fadhali).
   - *Aqidatul 'Awam* (Syaikh Ahmad Al-Marzuqi).
5. **Bidang Ulumul Qur'an & Tajwid:**
   - *Tuhfatul Athfal* (Syaikh Sulaiman Al-Jamzuri) & *Hidayatush Shibyan*.
   - *At-Tibyan fi Adabi Hamalatil Qur'an* (Imam An-Nawawi).

---

## 5. Keunggulan & Nilai Lebih Sistem Ini

1. **Integritas Ilmiah Ketat (Anti-Halusinasi & Anti-Pencatutan):**
   Model diprogram dengan larangan keras mengarang (*fabricating*) ibarat kitab. Jika ada pembahasan yang tidak termaktub dalam kitab fiqih teknis (misal alasan hikmah filosofis), sistem akan merujuknya ke hadits atau adab, bukan memalsukan teks fiqih.
2. **Multimodal Vision OCR Terintegrasi:**
   Mampu menjembatani naskah fisik cetakan kitab kuning di meja santri dengan dunia digital secara instan.
3. **Dokumen Hasil Kajian Siap Cetak (Export PDF Berstandar Dayah):**
   Tidak sekadar chat di layar, tetapi menghasilkan risalah tertulis resmi yang memuat kop pesantren dan catatan etika keilmuan.
4. **Desain Visual "Anti-Slop" yang Elegan & Islami:**
   Nuansa emerald khas pesantren, kaligrafi ornamen, tipografi Arab berharakat yang proporsional, serta bebas dari tampilan template murahan.
5. **UX Smartphone yang Terkunci Permanen:**
   Header tidak hilang saat layar digulir di HP, dialog modal responsif, dan konsumsi memori ringan.

---

## 6. Keterbatasan & Ruang Evaluasi Saat Ini (Apa yang Masih Kurang?)

Sebagai prototipe karya ilmiah yang jujur dan transparan, sistem saat ini memiliki beberapa ruang yang masih dapat disempurnakan:

1. **Skalabilitas Penyimpanan Vektor (*Vector DB Persistence*):**
   * *Kondisi saat ini:* Vektor embedding dokumen tersimpan dalam format berkas terstruktur lokal (`.vector-store.json`). Sangat stabil untuk puluhan dokumen prototipe lomba.
   * *Rencana masa depan:* Untuk mengindeks ratusan jilid kitab berukuran gigabyte, arsitektur dapat ditingkatkan ke basis data vektor terdistribusi (seperti *Supabase pgvector*, *Pinecone*, atau *Qdrant*).
2. **Kemampuan OCR Terhadap Naskah Tulisan Tangan Kuno (*Makhtuthat/Pegon*):**
   * *Kondisi saat ini:* Vision OCR sangat tajam dan akurat pada naskah cetak (*mathbu'*) kitab kuning berharakat maupun gundul.
   * *Keterbatasan:* Belum dilatih secara khusus untuk naskah manuskrip tulisan tangan kuno abad pertengahan yang pudar atau aksara Pegon Melayu/Jawa kuno.
3. **Modul Hafalan Belum Menggunakan Suara (*Voice Recognition*):**
   * *Kondisi saat ini:* Gamifikasi hafalan menggunakan kuis interaktif sambung teks Arab dan tafsir.
   * *Rencana masa depan:* Penambahan deteksi suara (*Audio/Speech-to-Text*) agar santri bisa melantunkan bacaan secara lisan langsung di depan mikrofon HP.
4. **Ketergantungan Kuota / Kunci API Eksternal:**
   * Untuk menjalankan penelusuran tingkat tinggi (*deep reasoning*), sistem memerlukan koneksi API AI (SumoPod atau Google Gemini). Jika kuota API habis, sistem otomatis berpindah ke mode simulasi cerdas (*Mock dataset*).

---

## 7. Panduan Pemaparan ke Pihak Pesantren (Pimpinan, Masyaikh, & Dewan Guru)

Jika Anda memaparkan platform ini di hadapan Pimpinan Dayah atau Dewan Guru, berikut poin-poin penyampaian yang dianjurkan:

> **Poin Inti yang Ditekankan:**
> 1. *"Platform ini bukan untuk menggantikan peran Ustadz atau memfatwakan hukum sendiri, melainkan sebagai 'Khadim Kitab'—alat bantu digital untuk mempermudah santri mencari rujukan matan, melatih hafalan juz 'amma, dan mendokumentasikan risalah belajar."*
> 2. *"Kitab rujukan yang dimasukkan adalah kitab-kitab mu'tamad yang dipelajari santri sehari-hari, seperti Fathul Qarib, Safinatun Najah, Al-Kawakib Ad-Durriyyah, dan Ta'lim Muta'allim."*
> 3. *"Sistem ini dirancang khusus agar tidak berhalusinasi atau mengada-ngada. Setiap jawaban wajib mencantumkan matan Arab dan rujukan kitabnya secara jelas."*
> 4. *"Fitur ekspor PDF memungkinkan hasil telaah langsung dicetak dan disetorkan kepada Ustadz pembimbing untuk diverifikasi kebenarannya."*

---

## 8. Panduan Teknis Pembaruan & Deployment di Server VPS

Untuk memastikan seluruh data dan fitur terbaru ini berjalan lancar di server produksi:

```bash
# 1. Masuk ke direktori web di server VPS
cd /var/www/asisten-kaji-kitab

# 2. Tarik commit terbaru dari GitHub
git pull origin master

# 3. Build bundle produksi Next.js
npm run build

# 4. Muat ulang service aplikasi
pm2 restart asisten-turats
```

---
*Dokumen ini disusun sebagai bagian dari Dokumentasi Ilmiah & Teknis Proyek Asisten Kaji Kitab & Turats — Dayah Perbatasan Minhajussalam (2026).*
