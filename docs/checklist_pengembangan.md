# ?? Checklist Progres Pengembangan: Asisten AI Kaji Kitab & Turats

Dokumen ini berfungsi sebagai panduan bagi pengembang (dan asisten AI di masa depan) untuk mengetahui secara persis apa saja yang sudah diimplementasikan dan apa yang masih menjadi tunggakan pekerjaan (backlog).

### ? APA YANG SUDAH DIBUAT (Status: Selesai)
- [x] **Desain Antarmuka (UI/UX) Tematik:** Tampilan responsif bernuansa Islami-Akademis menggunakan warna Emerald Green dan font Arab Amiri.
- [x] **Navigasi Modular (Sidebar):** Pemisahan 3 modul utama: Kaji Kitab, Simulasi Hafalan, dan Panel RAG.
- [x] **Bot Multimodal (Teks & Gambar):** Fitur input teks dan "Paperclip" untuk mengirim foto fisik kitab kuning (dilengkapi visual thumbnail).
- [x] **Visualisasi Kartu Sitasi:** Menampilkan rujukan referensi RAG (Nama kitab, bab, halaman).
- [x] **Fitur Pelafalan Audio:** Tombol "Baca Lafal" menggunakan *Web Speech Synthesis* untuk membaca transkripsi Arab (Text-to-Speech).
- [x] **Sistem Hybrid AI Backend:** Server fleksibel yang mendukung Google Gemini, SumoPod, dan sistem simulasi pintar (mock fallback) apabila tidak ada internet/API Key.
- [x] **Kuis Interaktif Hafalan:** Fitur tebak surah dan sambung ayat dengan skor akhir.
- [x] **Fitur Ekspor Kajian:** Tombol "Unduh PDF" untuk menyimpan rangkuman diskusi bot dan sitasinya dengan layout dokumen yang profesional.

---

### ? APA YANG BELUM DIBUAT (Peta Jalan / Roadmap Lanjutan)
- [ ] **Perekam Suara Lisan (Speech-to-Text):** Menambahkan mikrofon agar sistem bisa mendengarkan dan mengoreksi hafalan pengguna secara langsung menggunakan suara (Misal: API Whisper).
- [x] **Ekstraksi PDF Nyata (Real RAG & Vision OCR):** Panel "Unggah Dokumen" kini sepenuhnya fungsional. Mampu mengekstrak teks PDF digital (via unpdf) dan mentranskripsikan PDF Scan / Gambar kitab secara otomatis (via Vision OCR SumoPod/Gemini), lalu mengindeksnya ke Vector Database in-memory (.vector-store.json).
- [ ] **Sistem Registrasi & Akun:** Fitur login untuk pengguna (Misal: Firebase / NextAuth).
- [ ] **Database Riwayat Persisten:** Menyimpan sesi riwayat percakapan (history) agar tidak hilang saat pengguna memuat ulang (refresh) halaman peramban (Misal: PostgreSQL / MongoDB).
