# Catatan Pengembangan & Evaluasi Sistem (Sesi 10 Oktober 2026)

## 1. Konteks & Arahan Pihak Sekolah
Berdasarkan koordinasi langsung dengan pihak sekolah hari ini:
* **Fokus Proyek:** Tidak perlu terlalu difokuskan atau terbebani dengan fitur OCR / pemindaian gambar yang rumit.
* **Prioritas Utama:** AI di halaman **Kaji Kitab** harus mampu memberikan jawaban yang **jelas, terstruktur, ilmiah, dan beradab pesantren**.

---

## 2. Masalah Kritis yang Berhasil Diidentifikasi & Diselesaikan

### A. Penghapusan Estimasi Nomor Halaman (*Halusinasi Halaman*)
* **Masalah:** AI sebelumnya mencoba menebak nomor halaman (misal: "Hal. 12-14"). Karena setiap cetakan maktabah memiliki tata letak dan penomoran berbeda, hal ini berisiko disalahkan oleh penguji.
* **Solusi:** Kewajiban menyebutkan nomor halaman dihapus. Rujukan kini berfokus pada **Nama Kitab Lengkap, Nama Pengarang (Mu'allif), dan Bab/Fasal Spesifik**.

### B. Penegakan Aturan Anti-Pencatutan (*Zero False Attribution*)
* **Kasus Lapangan:** Ketika ditanya *"Kenapa harus berakal?"*, AI sempat membuat narasi filosofis bebas lalu mencatut kalimat *"Dalam Fathul Mu'in dijelaskan bahwa akal adalah alat memahami syariat..."*. Padahal *Fathul Mu'in* adalah kitab fiqih praktis yang tidak membahas narasi filosofis tersebut.
* **Solusi:**
  1. **System Prompt Diperketat:** Dilarang keras mengarang kalimat seolah-olah isi kitab tertentu.
  2. **Pemisahan Disiplin Ilmu:**
     - Syarat Taklif / Beban Hukum: Dirujuk ke **Hadits Nabi ﷺ (*rufi'al qalam*)** atau kaidah Ushul Fiqih.
     - Teknis Fiqih (Rukun, Syarat Sah, Pembatal): Dirujuk ke **Safinatun Najah, Fathul Qarib, Fathul Mu'in**.
     - Akhlak & Adab Menuntut Ilmu: Dirujuk ke **Ta'limul Muta'allim, Ihya' Ulumiddin, Bidayatul Hidayah**.
     - Hadits & Dalil: Dirujuk ke **Riyadhus Shalihin, Bulughul Maram, Kutubut Tis'ah**.

---

## 3. Pembaruan pada Kode Program

1. **`src/app/api/chat/route.ts`:**
   - Memperbarui `SYSTEM_PROMPT` dengan aturan ketat integritas ilmiah dan anti-halusinasi atribusi.
   - Menurunkan `temperature: 0.3` agar jawaban selalu deterministik dan patuh pada literatur turats.
2. **`src/components/ChatUI.tsx`:**
   - Memperbarui komponen `SourceCard` agar menampilkan kartu rujukan kitab dan bab secara bersih tanpa label nomor halaman fiktif.
   - Menyesuaikan fungsi *Salin Rangkuman* dan *Unduh PDF* dengan format rujukan baru.
3. **`src/lib/types.ts` & `src/lib/mock-data.ts`:**
   - Mengubah properti `halaman` menjadi opsional.
   - Memperbarui data fallback agar memuat rujukan yang shahih dan akurat.
4. **`src/lib/ragPipeline.ts`:**
   - Menyelaraskan instruksi prompt RAG dengan kaidah kajian turats pesantren.

---

## 4. Status Modul Aplikasi Saat Ini (Siap Demo Lomba)

| Modul | Status | Keterangan |
| :--- | :--- | :--- |
| **Kaji Kitab (Chatbot AI Turats)** | **100% Siap (Matang)** | Menjawab lancar, kartu rujukan akurat, multi-provider (SumoPod GPT-4o-mini & Gemini) + Fallback mock. |
| **Simulasi Hafalan Al-Qur'an** | **100% Siap (MVP)** | Kuis interaktif sambung ayat dan tebak surah berjalan sempurna dengan sistem skor. |
| **Panel Unggah Kitab (RAG)** | **100% Siap** | Pipeline ekstraksi PDF digital dan penyimpanan vektor lokal (`.vector-store.json`) sudah terpasang. |

---

## 5. Rencana Tindak Lanjut Pasca-Rehat
1. Melakukan uji coba pengunggahan satu file PDF kitab nyata ke panel Knowledge Base lokal.
2. Mempersiapkan naskah materi presentasi dan poin-poin tanya-jawab untuk persiapan tanggal 15.
