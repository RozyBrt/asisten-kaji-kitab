# 📖 Panduan Pengembangan: Asisten AI Kaji Kitab & Turats

Selamat datang di proyek aplikasi *Asisten AI Kaji Kitab & Turats*. Proyek ini dirancang sebagai platform modular. Dokumen ini menggabungkan **spesifikasi awal pembuatan proyek**, **panduan teknis**, dan **catatan kesesuaian implementasi** untuk pengembangan selanjutnya maupun bagi pengguna (dan asisten AI ke depannya).

> Ringkasan demo & arsitektur untuk juri lomba: [`lomba_karya_ilmiah_report.md`](./lomba_karya_ilmiah_report.md)  
> **Status fitur (sudah / belum / rencana):** [`matriks_fitur.md`](./matriks_fitur.md)

---

## 0. Asal usul & brief awal (Google Antigravity)

Proyek pertama kali digenerate dengan prompt berikut. Ini tetap menjadi **acuan fungsional dan UI/UX** resmi prototype.

<details>
<summary><strong>Prompt asli (klik untuk membuka)</strong></summary>

Buatkan project aplikasi web full-stack menggunakan Next.js 14 (App Router), Tailwind CSS, dan TypeScript untuk prototype lomba karya ilmiah bertema "Bot AI Pembantu Kaji Kitab (Turats) & Hafalan Al-Qur'an".

**Detail Kebutuhan Aplikasi & UI/UX:**

1. **Layout & Theme:**
   - Desain antarmuka bersih, modern, islami-akademis, dan responsif (Mobile & Desktop).
   - Skema warna: Emerald Green / Dark Slate dengan nuansa putih/terang yang nyaman dibaca.
   - Header aplikasi mencantumkan Judul: "Asisten AI Kaji Kitab & Turats", dengan badge kecil "Prototype Lomba Karya Ilmiah".
   - Footer/Banner Bawah mencantumkan Disclaimer Etika AI: "Hasil generasi AI bertujuan sebagai asisten penelusuran materi/referensi. Untuk penafsiran hukum/fatwa mutakhir, tetap konfirmasikan kepada Guru/Ustadz Pembimbing."

2. **Struktur Halaman & Fitur Utama:**
   - Navigation Bar / Sidebar ringkas untuk berpindah modul:
     - a) "Kaji Kitab (RAG & Multimodal Bot)"
     - b) "Simulasi Hafalan Al-Qur'an"
     - c) "Panel Unggah Dokumen Kitab"
   - **Halaman Kaji Kitab (Chatbot UI Multimodal):**
     - Area Chat Stream / Bubble Chat yang membedakan pesan User dan Bot AI.
     - Input box: Kirim Teks; Kamera/Lampiran Foto; preview thumbnail di atas input; Quick Prompt (contoh: "Syarat sah wudhu", "Adab menuntut ilmu", "Rukun shalat").
     - Respon AI: syarah (Bahasa Indonesia); OCR/matan Arab (Amiri / Traditional Arabic); kartu sitasi (Nama Kitab, Bab/Pasal, Halaman).
   - **Panel Unggah Dokumen:** simulasi upload PDF/Word/TXT; list dokumen terindeks RAG.
   - **Simulasi Hafalan:** kuis sambung ayat dan cek hafalan.

3. **Backend API Route & Multimodal Integration:**
   - Route Handler `app/api/chat/route.ts` siap integrasi Google Gemini (Text + Image Base64).
   - Fallback/mock terstruktur (mock OCR & syarah) jika API key belum diisi.
   - Struktur komponen modular (Components, Libs, API Routes).

</details>

### Catatan implementasi vs brief awal

| Brief awal | Implementasi saat ini |
|------------|------------------------|
| Next.js 14 | Next.js **16** (App Router), React 19, Tailwind 4 |
| Badge "Prototype Lomba Karya Ilmiah" | Badge **"Prototype Lomba"** di `Header.tsx` (sedikit disingkat) |
| Gemini via `@google/genai` atau env | `GEMINI_API_KEY` + **REST API** di `route.ts` (tanpa paket `@google/genai` di `package.json`) |
| Mock jika tanpa key | `src/lib/mock-data.ts` + `getMockChatResponse()` |
| Tiga modul sidebar | `Sidebar.tsx`, `page.tsx` |
| Quick prompt (3 contoh) | `quickPrompts` di `mock-data.ts` — **3 wajib + 3 tambahan** |
| — (di luar brief) | SumoPod/OpenAI (`SUMOPOD_API_KEY`), `ResearchModal.tsx`, demo 1-klik `sample-kitab.ts`, Web Speech "Baca Lafal" di `ChatUI.tsx` |

---

## 1. Struktur & Alur Kerja Utama

- **Backend AI (`src/app/api/chat/route.ts`):** Inilah jantung sistem. Ia sudah mendukung 3 skema:
  - **SumoPod (OpenAI-compatible):** Gunakan `SUMOPOD_API_KEY` (atau `OPENAI_API_KEY`).
  - **Google Gemini:** Gunakan `GEMINI_API_KEY`.
  - **Mock Fallback:** Jika tidak ada API Key yang dikonfigurasi, bot akan mengambil respons dari `src/lib/mock-data.ts`.
- **Prioritas pemanggilan:** SumoPod → Gemini → Mock.
- **Integrasi Baru:** Jika Anda (atau AI) ingin menambahkan model lain, cukup modifikasi `callSumoPodApi` atau `callGeminiApi` di dalam file `route.ts`.

**Peta file utama (selaras brief modular):**

```
src/app/page.tsx              # Orkestrasi modul
src/app/api/chat/route.ts     # Chat multimodal + AI
src/components/ChatUI.tsx     # Kaji kitab
src/components/HafalanUI.tsx  # Hafalan
src/components/UploadUI.tsx   # Upload RAG (simulasi)
src/lib/mock-data.ts          # Mock chat, hafalan, dokumen, quick prompts
src/lib/types.ts              # Tipe TypeScript
src/lib/sample-kitab.ts       # Sampel demo multimodal
```

---

## 2. Cara Mengaktifkan AI Live

- Buka file `.env.local` pada akar proyek (contoh: `D:\Documents\asisten-kaji-kitab`).
- Isi salah satu:
  ```env
  SUMOPOD_API_KEY=...
  # atau
  GEMINI_API_KEY=...
  ```
- Server akan mendeteksi *environment variable* secara otomatis dan beralih dari mode **Mock** ke mode **Live AI**.

---

## 3. Status Proyek & Peta Jalan

Detail per fitur (✅ / 🟡 / 🟠 / ❌), diagram alur RAG, dan **prioritas fase 1–4** ada di **[`matriks_fitur.md`](./matriks_fitur.md)**. Ringkasan:

### Sudah selesai (scope prototype lomba)

- Shell aplikasi: 3 modul, tema islami-akademis, disclaimer etika, modal riset.
- **Kaji Kitab:** chat multimodal, quick prompt, sitasi, matan Arab, mock atau AI live (Gemini/SumoPod), demo sampel naskah, baca lafal.
- **Hafalan:** kuis 5 soal (sambung ayat, tebak surah, isi lanjutan) dari bank mock.
- **Upload:** UI drag & drop + daftar terindeks **simulasi**.
- **Backend:** `/api/chat` dengan fallback mock tanpa API key.

### Belum / masih simulasi

- **RAG nyata:** ekstrak PDF, embedding, vector DB, retrieval ke chat.
- **Upload persisten** dan korpus terhubung ke jawaban bot.
- **Hafalan lisan** (STT), bank ayat skala besar, auth, riwayat di database.
- **Ekspor PDF**, test otomatis, hardening produksi.

### Seharusnya dibuat ke depan (urutan disarankan)

1. **Fase 1** — polish prototype (badge brief, status AI jujur, OCR badge, validasi upload, copy hafalan).
2. **Fase 2** — RAG MVP (storage → chunk → vector → retrieval → sitasi dari chunk).
3. **Fase 3** — hafalan lanjutan (dataset ayat, Whisper, mode muraja'ah).
4. **Fase 4** — auth, DB historis, ekspor PDF, rate limit, CI/test.

Lihat tabel lengkap dan checklist verifikasi di [`matriks_fitur.md`](./matriks_fitur.md).

---

## 4. Cara Menjalankan Proyek

Dari direktori akar proyek:

```bash
npm run dev
```

Server lokal: `http://localhost:3000`.

Perintah lain: `npm run build`, `npm run start`, `npm run lint`.

---

*Dokumen ini menggabungkan brief awal Antigravity dengan panduan teknis agar sesi pengembangan berikutnya punya satu sumber acuan.*
