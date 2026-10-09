# 📄 Implementasi Real PDF Extraction & RAG

Dokumen ini menjelaskan langkah‑langkah teknis untuk menambahkan **ekstraksi PDF nyata** serta **pipeline Retrieval‑Augmented Generation (RAG)** ke dalam proyek Asisten AI Kaji Kitab & Turats.

---

## 1️⃣ Alur Kerja Umum
1. **Upload PDF** → simpan di penyimpanan (local atau cloud).
2. **Ekstrak teks** menggunakan `pdf-parse` atau `pdfjs-dist`.
3. **Chunking** – pecah teks menjadi potongan ukuran optimum (≈ 500‑800 kata).
4. **Embedding** – konversi tiap chunk menjadi vektor (OpenAI, Cohere, atau model lokal).
5. **Vector Store** – simpan vektor‑chunk di basis vektor (Pinecone, Chroma, Supabase pgvector, dll).
6. **Retrieval** – pada pertanyaan user, cari chunk terdekat.
7. **RAG Prompt** – gabungkan konteks chunk dengan prompt ke LLM (Gemini, OpenAI, dll).
8. **Kembalikan hasil** ke UI Chat.

---

## 2️⃣ Dependensi yang Diperlukan
```bash
# PDF parsing
npm i pdf-parse        # atau pdfjs-dist

# LangChain (chunking, embedding, dll)
npm i langchain@latest

# Vector store (pilihan)
# • Pinecone (cloud)
npm i @pinecone-database/pinecone
# • Chroma (lokal file‑based)
npm i @langchain/chroma
# • Supabase pgvector (SQL)
```
> Catatan: Pastikan API‑key untuk layanan embedding (mis. `OPENAI_API_KEY`) tersimpan di `.env.local`.

---

## 3️⃣ Struktur Berkas Baru
```
src/
├─ app/
│   └─ api/
│       └─ rag/
│           └─ route.ts          # Endpoint API RAG
├─ lib/
│   ├─ pdfExtractor.ts          # Ekstraksi PDF → teks
│   ├─ ragPipeline.ts           # Chunking, embed, store, retrieve
│   └─ vectorStore.ts           # Wrapper untuk Pinecone/Chroma
└─ components/
    └─ UploadRAGUI.tsx          # UI upload & indexing PDF
```

---

## 4️⃣ Implementasi Contoh
### 4.1 `src/lib/pdfExtractor.ts`
```ts
import pdf from 'pdf-parse';

/** Baca file PDF (Buffer) dan kembalikan seluruh teks. */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text; // teks mentah, sudah ter‑normalize line‑breaks
}
```
---
### 4.2 `src/lib/vectorStore.ts` (contoh Pinecone)
```ts
import { PineconeClient } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';

const pinecone = new PineconeClient();
await pinecone.init({
  environment: process.env.PINECONE_ENV!,
  apiKey: process.env.PINECONE_API_KEY!,
});
const index = pinecone.Index(process.env.PINECONE_INDEX!);
const embedder = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });

/** Simpan chunk‑chunk ke Pinecone */
export async function upsertChunks(chunks: { id: string; text: string }[]) {
  const vectors = await Promise.all(
    chunks.map(async ({ id, text }) => ({
      id,
      values: await embedder.embedQuery(text),
      metadata: { text },
    }))
  );
  await index.upsert({ upsertRequest: { vectors } });
}

/** Retrieve top‑k paling mirip */
export async function similaritySearch(query: string, k = 4) {
  const queryVector = await embedder.embedQuery(query);
  const resp = await index.query({
    queryRequest: { vector: queryVector, topK: k, includeMetadata: true },
  });
  return resp.matches?.map(m => (m.metadata?.text as string) ?? '') ?? [];
}
```
---
### 4.3 `src/lib/ragPipeline.ts`
```ts
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { upsertChunks, similaritySearch } from './vectorStore';
import { extractPdfText } from './pdfExtractor';

/** Ingest PDF → chunk → store */
export async function ingestPdf(buffer: Buffer, docId: string) {
  const raw = await extractPdfText(buffer);
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 800, chunkOverlap: 200 });
  const pieces = await splitter.createDocuments([raw]);
  const chunks = pieces.map((doc, i) => ({ id: `${docId}-${i}`, text: doc.pageContent }));
  await upsertChunks(chunks);
}

/** Answer query dengan RAG */
export async function answerWithRag(query: string) {
  const contextChunks = await similaritySearch(query, 4);
  const context = contextChunks.join('\n\n');
  const prompt = `Berikan jawaban berdasarkan konteks berikut:\n\n${context}\n\nPertanyaan: ${query}`;
  // Panggil LLM yang sudah ada (mis. callGeminiApi di route.ts)
  const { callGeminiApi } = await import('../../app/api/chat/route');
  const result = await callGeminiApi(prompt);
  return result;
}
```
---
### 4.4 API Endpoint `src/app/api/rag/route.ts`
```ts
import type { NextRequest } from 'next/server';
import { ingestPdf, answerWithRag } from '@/lib/ragPipeline';

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get('file') as File | null;
  const query = (form.get('query') as string) ?? null;

  // 1️⃣ Upload PDF → index
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const docId = `${Date.now()}-${file.name}`;
    await ingestPdf(buffer, docId);
    return new Response(JSON.stringify({ message: 'PDF berhasil di‑index', docId }));
  }

  // 2️⃣ Query RAG
  if (query) {
    const answer = await answerWithRag(query);
    return new Response(JSON.stringify({ answer }));
  }

  return new Response(JSON.stringify({ error: 'Harus kirim file atau query' }), { status: 400 });
}
```
---
### 4.5 UI `src/components/UploadRAGUI.tsx`
```tsx
import { useState } from 'react';

export default function UploadRAGUI() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    setStatus('Meng‑index PDF…');
    const res = await fetch('/api/rag', { method: 'POST', body: form });
    const data = await res.json();
    setStatus(data.message ?? data.error);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <h3 className="text-lg font-semibold mb-2">Upload Dokumen (RAG Real)</h3>
      <input type="file" accept=".pdf" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={handleUpload} className="ml-2 px-3 py-1 bg-emerald-600 text-white rounded">
        Index PDF
      </button>
      <p className="mt-2 text-sm text-gray-600">{status}</p>
    </div>
  );
}
```
---

## 5️⃣ Integrasi ke Chat UI
- Tambahkan pilihan di `ChatUI.tsx` seperti **“Tanya dokumen …”** yang mengirimkan `query` ke endpoint `/api/rag`.
- Respons (`answer`) dapat diproses lewat fungsi `handleChatResponse` yang sudah ada.

## 6️⃣ Penyimpanan PDF (opsional)
- **Local**: Simpan di `public/uploads/` (buat folder dengan `fs.mkdirSync`).
- **Cloud**: Pakai Supabase Storage, AWS S3, atau Cloudinary; upload lewat SDK dan simpan URL ke metadata chunk.

## 7️⃣ Keamanan & Skalabilitas
| Aspek | Rekomendasi |
|------|--------------|
| Rate‑limit LLM | Middleware `@upstash/ratelimit` atau Vercel Edge Functions |
| Batas ukuran file | Batasi `maxFileSize: 5 MB` pada upload UI |
| Indexing async | Gunakan queue (mis. **BullMQ**, **Vercel Queue**) agar tidak memblok request utama |

## 8️⃣ Checklist Implementasi Real RAG
- [ ] Install dependensi (`pdf-parse`, `langchain`, vector‑store SDK).
- [ ] Buat `pdfExtractor.ts`.
- [ ] Buat `vectorStore.ts` (Pinecone/Chroma) + env‑var.
- [ ] Buat `ragPipeline.ts` (chunk‑embed‑store‑search).
- [ ] Tambahkan endpoint API `/api/rag/route.ts`.
- [ ] Buat UI `UploadRAGUI.tsx` dan letakkan di sidebar atau halaman upload.
- [ ] Integrasikan ke `ChatUI.tsx` (opsi “tanya dokumen”).
- [ ] Uji dengan contoh PDF kitab kuning.
- [ ] Perbarui `README.md` dengan cara men‑setup vector store.

---

## 9️⃣ Referensi Tambahan
- **LangChain.js docs** – <https://js.langchain.com/docs/>
- **Pinecone quick‑start** – <https://docs.pinecone.io/docs/quickstart>
- **Chroma DB** – <https://www.trychroma.com/docs>
- **pdf‑parse** – <https://www.npmjs.com/package/pdf-parse>

> Ikuti panduan di atas untuk menambahkan kemampuan RAG yang sesungguhnya. Setelah selesai, aplikasi akan dapat meng‑index PDF asli dan menjawab pertanyaan berdasarkan isi kitab secara dinamis.
