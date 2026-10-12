/**
 * Vector Store sederhana berbasis in-memory (JSON file persisted).
 * Embedding menggunakan OpenAI-compatible API (SumoPod).
 *
 * Untuk produksi, ganti dengan Pinecone, Chroma, atau Supabase pgvector.
 */

import fs from 'fs';
import path from 'path';

const STORE_PATH = path.join(process.cwd(), '.vector-store.json');

export interface VectorEntry {
  id: string;
  text: string;
  vector: number[];
  metadata?: Record<string, string>;
}

// Load store dari disk
function loadStore(): VectorEntry[] {
  try {
    if (fs.existsSync(STORE_PATH)) {
      return JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8'));
    }
  } catch {
    // ignore parse error, start fresh
  }
  return [];
}

// Simpan store ke disk
function saveStore(store: VectorEntry[]) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

// Hitung cosine similarity antara dua vektor
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const normB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return normA === 0 || normB === 0 ? 0 : dot / (normA * normB);
}

// Buat embedding via SumoPod (OpenAI-compatible)
async function embedText(text: string): Promise<number[]> {
  const baseUrl = process.env.SUMOPOD_BASE_URL || 'https://ai.sumopod.com/v1';
  const apiKey  = (process.env.SUMOPOD_API_KEY  || '').trim();

  const response = await fetch(`${baseUrl}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Embedding API error: ${response.status} – ${err}`);
  }

  const json = await response.json();
  return json.data[0].embedding as number[];
}

/** Simpan chunk-chunk teks ke vector store */
export async function upsertChunks(
  chunks: { id: string; text: string; metadata?: Record<string, string> }[]
) {
  const store = loadStore();

  for (const chunk of chunks) {
    const vector = await embedText(chunk.text);
    const existing = store.findIndex((e) => e.id === chunk.id);
    const entry: VectorEntry = { id: chunk.id, text: chunk.text, vector, metadata: chunk.metadata };
    if (existing >= 0) {
      store[existing] = entry;
    } else {
      store.push(entry);
    }
  }

  saveStore(store);
}

/** Cari top-k chunk paling mirip dengan query */
export async function similaritySearch(query: string, k = 4): Promise<string[]> {
  const store = loadStore();
  if (store.length === 0) return [];

  const queryVector = await embedText(query);

  const scored = store.map((entry) => ({
    text: entry.text,
    score: cosineSimilarity(queryVector, entry.vector),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((s) => s.text);
}

/** Hapus semua entri yang berasal dari dokumen tertentu */
const PROTECTED_DOC_IDS = ['safinatun-najah', 'fathul-qarib', 'talimul-mutaallim', 'al-kawakib-ad-durriyyah'];

export function isProtectedDocument(docId: string): boolean {
  return PROTECTED_DOC_IDS.some(p => docId === p || docId.startsWith(p + '-'));
}

export function deleteDocument(docId: string) {
  if (isProtectedDocument(docId)) {
    console.warn(`[Security] Percobaan menghapus kitab kurikulum inti ditolak: ${docId}`);
    return;
  }
  const store = loadStore().filter((e) => {
    // Cek dari metadata jika ada (lebih akurat)
    if (e.metadata?.docId) return e.metadata.docId !== docId;
    // Fallback: cek apakah chunk id dimulai dengan docId
    return !e.id.startsWith(docId);
  });
  saveStore(store);
}

export interface DocSummary {
  docId: string;
  docName: string;
  chunkCount: number;
}

/** Kembalikan daftar dokumen yang sudah di-index beserta metadata ringkas */
export function listDocuments(): DocSummary[] {
  const store = loadStore();
  const map = new Map<string, DocSummary>();

  for (const e of store) {
    // Ambil docId dari metadata jika ada, fallback ke parsing id
    const docId = e.metadata?.docId ?? e.id.split('-chunk-')[0];
    const docName = e.metadata?.docName ?? docId.replace(/^\d+-/, '');

    if (map.has(docId)) {
      map.get(docId)!.chunkCount += 1;
    } else {
      map.set(docId, { docId, docName, chunkCount: 1 });
    }
  }

  return Array.from(map.values());
}
