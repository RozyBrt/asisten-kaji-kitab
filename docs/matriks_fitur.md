# Matriks Fitur & Roadmap Pengembangan
    
## 1. Apa yang Sudah Dibuat (Status Saat Ini)
- **Antarmuka Utama (UI/UX):** Layout responsif yang Islami dan akademis menggunakan Next.js (App Router) dan Tailwind CSS.
- **Modul Kaji Kitab:** Antarmuka chatbot multimodal (teks & gambar) dengan tombol OCR/Vision terintegrasi.
- **Modul Simulasi Hafalan:** Tampilan kuis hafalan interaktif (sambung ayat, tebak surah).
- **Modul Unggah Dokumen:** Panel untuk simulasi mengunggah file PDF/DOCX sebagai sumber pengetahuan (RAG).
- **Backend AI (Hybrid):** Sistem pintar yang mendukung pemanggilan API ke SumoPod (OpenAI-compatible) dan Google Gemini secara bergantian, beserta sistem mock fallback jika API Key tidak tersedia.

## 2. Apa yang Belum Dibuat (Batasan Prototipe)
- **Pemrosesan PDF Nyata:** Saat ini, modul unggah dokumen masih sekadar simulasi UI. File PDF yang diunggah belum diekstrak teksnya atau dipotong menjadi vektor ke dalam sebuah database vector nyata.
- **Input Suara Nyata:** Belum ada sistem Speech-to-Text yang benar-benar merekam suara pengguna dan mengubahnya menjadi teks bahasa Arab. Hafalan Al-Qur'an masih berbentuk kuis klik dan teks.
- **Sistem Pengguna & Database:** Belum ada sistem login/register dan penyimpanan data percakapan ke database persisten (riwayat akan hilang bila browser di-refresh).


## 3. Apa yang Akan Dibuat Kedepannya (Roadmap)
- **Integrasi Vector Database:** Membangun pipeline RAG yang berfungsi penuh (misal: Pinecone, ChromaDB, LangChain) untuk mengekstrak isi kitab PDF nyata dan menyimpan embedding-nya.
- **Voice-to-Text (Whisper API):** Mengaktifkan fitur rekam suara terintegrasi AI (Whisper) agar santri bisa menyetorkan hafalan secara lisan.

- **Autentikasi (Auth) & Database Historis:** Menambahkan sistem autentikasi (misal: Firebase, NextAuth) beserta database (PostgreSQL/MongoDB) agar pengguna bisa menyimpan riwayat kajiannya.

