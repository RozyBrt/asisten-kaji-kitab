/**
 * Vector Store & Hybrid Search Engine untuk Kitab Al-Kawakib Ad-Durriyyah.
 * Mendukung pencarian leksikal cerdas (keyword & istilah nahwu) dan
 * semantic vector search (via SumoPod embedding).
 */

import fs from 'fs';
import path from 'path';

export interface KawakibChunk {
  id: string;
  pdfPage: number;
  bookPage: string;
  bab: string;
  pdfUrl: string;
  text: string;
}

export interface VectorEntry {
  id: string;
  text: string;
  vector?: number[];
  metadata?: Record<string, string>;
}

const STORE_PATH = path.join(process.cwd(), '.vector-store.json');
const KAWAKIB_INDEX_PATH = path.join(process.cwd(), 'src', 'data', 'al-kawakib-index.json');

// Memuat data korpus Al-Kawakib (284 Halaman)
let cachedKawakibChunks: KawakibChunk[] | null = null;

export function loadKawakibIndex(): KawakibChunk[] {
  if (cachedKawakibChunks) return cachedKawakibChunks;
  try {
    if (fs.existsSync(KAWAKIB_INDEX_PATH)) {
      const data = JSON.parse(fs.readFileSync(KAWAKIB_INDEX_PATH, 'utf-8'));
      cachedKawakibChunks = data;
      return data;
    }
  } catch (err) {
    console.error('Error loading al-kawakib-index.json:', err);
  }
  return [];
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
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
  } catch (err) {
    console.error('Error saving vector store:', err);
  }
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
  const apiKey = (process.env.SUMOPOD_API_KEY || '').trim();

  if (!apiKey) {
    throw new Error('SUMOPOD_API_KEY tidak dikonfigurasi.');
  }

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
    throw new Error(`Embedding API error: ${response.status} - ${err}`);
  }

  const json = await response.json();
  return json.data[0].embedding as number[];
}

// Stopwords percakapan bahasa Indonesia agar tidak mendistorsi pencarian istilah nahwu
const NAHWU_STOPWORDS = new Set([
  'tolong', 'jelaskan', 'terangkan', 'uraikan', 'tentang', 'apa', 'itu', 'bagaimana',
  'adalah', 'mohon', 'maksud', 'dari', 'pada', 'yang', 'dalam', 'dan', 'atau', 'seperti',
  'merupakan', 'secara', 'menurut', 'kitab', 'bisa', 'kah', 'apakah', 'pengertian',
  'definisi', 'makna', 'arti', 'hukum', 'kaidah', 'contoh', 'kepada', 'kepadaku', 'ku',
  'saya', 'kami', 'anda', 'dong', 'ya', 'tanya', 'ingin', 'tahu', 'tau', 'mau', 'dia',
  'sih', 'nih', 'kan', 'tuh', 'lah', 'pun', 'coba', 'akan', 'kasih', 'beri'
]);

// Kamus sinonim & variasi ejaan fonetik santri untuk istilah-istilah Nahwu klasik
const NAHWU_VARIANTS: Record<string, string[]> = {
  // Pertanyaan Umum Ilmu Nahwu -> Arahkan ke Bab Kalam / Pembahasan Kaidah Pokok
  'nahwu': ['kalam', 'pembahasan kalam'],
  'ilmu': ['nahwu', 'kalam'],

  // Istitsna' & Mustatsna
  'mustatna': ['mustatsna', 'istitsna'],
  'mustasna': ['mustatsna', 'istitsna'],
  'mustathna': ['mustatsna', 'istitsna'],
  'mustatsna': ['mustatsna', 'istitsna'],
  'istisna': ['istitsna', 'mustatsna'],
  'istitna': ['istitsna', 'mustatsna'],
  'istithna': ['istitsna', 'mustatsna'],
  'istitsna': ['istitsna', 'mustatsna'],

  // Fa'il & Na'ibul Fa'il
  'fail': ['fail', "fa'il"],
  'naib': ['naibul', "na'ibul", 'naibul fail', 'maful yang tidak disebutkan'],
  'naibul': ['naibul', "na'ibul", 'naib fail'],
  'naibal': ['naibul', "na'ibul"],

  // Mutsanna & Tatsniyah
  'mutanna': ['mutsanna', 'tatsniyah'],
  'musanna': ['mutsanna', 'tatsniyah'],
  'mutsanna': ['mutsanna', 'tatsniyah'],
  'tatsniyah': ['tatsniyah', 'mutsanna'],
  'tasniyah': ['tatsniyah', 'mutsanna'],
  'tatniyah': ['tatsniyah', 'mutsanna'],

  // Fi'il & Madhi/Mudhari'/Amar
  'fiil': ['fiil', "fi'il"],
  'madhi': ['madhi', 'madi'],
  'mudhari': ['mudhari', 'mudhori', 'mudhore'],
  'mudhori': ['mudhari', 'mudhori'],
  'mudhore': ['mudhari', 'mudhori'],
  'amar': ['amr', 'amar'],

  // I'rab & Bina'
  'irab': ['irab', "i'rab"],
  'bina': ['bina', 'mabni'],
  'mabni': ['mabni', 'bina'],

  // Tanda I'rab: Rofa', Nashab, Khafadh/Jar, Jazm
  'rofa': ['rofa', 'rafa', 'marfu', 'dhommah'],
  'rafa': ['rofa', 'rafa', 'marfu', 'dhommah'],
  'marfu': ['marfu', 'rofa', 'rafa'],
  'dhommah': ['dhommah', 'dhammah', 'dommah'],
  'dhammah': ['dhommah', 'dommah'],
  'dommah': ['dhommah'],
  'nasab': ['nashab', 'manshub', 'fathah'],
  'nashab': ['nashab', 'manshub', 'fathah'],
  'manshub': ['manshub', 'nashab'],
  'mansub': ['manshub', 'nashab'],
  'khafadh': ['khafadh', 'khafad', 'jar', 'majrur', 'kasrah'],
  'khafad': ['khafadh', 'jar', 'majrur'],
  'jer': ['jar', 'khafadh', 'majrur'],
  'jar': ['jar', 'khafadh', 'majrur'],
  'majrur': ['majrur', 'jar', 'khafadh'],
  'jazm': ['jazm', 'jazam', 'majzum', 'sukun'],
  'jazam': ['jazm', 'majzum'],
  'majzum': ['majzum', 'jazm'],

  // Marfu'atil Asma'
  'mubtada': ['mubtada', "mubtada'"],
  'khabar': ['khabar', 'khobar'],
  'khobar': ['khabar'],
  'nawasikh': ['nawasikh', 'kaana', 'inna', 'zhanna'],
  'kana': ['kaana'],
  'kaana': ['kaana'],

  // Manshubatil Asma'
  'maful': ["maf'ul", 'maful'],
  'bih': ["maf'ul bih", 'bih'],
  'muthlaq': ['muthlaq', 'mashdar'],
  'mutlaq': ['muthlaq', 'mashdar'],
  'fih': ['fih', 'dzaraf'],
  'dzaraf': ['dzaraf', 'zharaf', 'zaraf'],
  'zharaf': ['dzaraf', 'zharaf'],
  'zaraf': ['dzaraf', 'zharaf'],
  'liajlih': ['liajlih', 'li ajlih'],
  'maah': ["ma'ah"],
  'hal': ['hal', 'haal'],
  'haal': ['hal'],
  'tamyiz': ['tamyiz', 'tamyez'],
  'tamyez': ['tamyiz'],
  'munada': ['munada', 'nida'],
  'nida': ['munada', 'nida'],

  // Tawabi'
  'tawabi': ['tawabi', 'naat', 'athaf', 'taukid', 'badal'],
  'naat': ['naat', "na'at", 'sifat'],
  'sifat': ['naat', "na'at", 'sifat'],
  'athaf': ['athaf', "'athaf", 'athof'],
  'athof': ['athaf', "'athaf"],
  'taukid': ['taukid', 'tawkid', 'takid', "ta'kid"],
  'takid': ['taukid', 'tawkid'],
  'badal': ['badal'],

  // Isim Ghairu Munsharif
  'munsharif': ['munsharif', 'munsarif', 'ghairu munsharif'],
  'munsarif': ['munsharif', 'munsarif', 'ghairu munsharif'],
  'ghairu': ['ghairu', 'ghoiru', 'munsharif'],
  'ghoiru': ['ghairu', 'munsharif'],

  // Idhafah
  'idhafah': ['idhafah', 'idhofah', 'mudhaf', 'mudhaf ilaih'],
  'idhofah': ['idhafah', 'mudhaf'],
  'mudhaf': ['mudhaf', 'mudhof', 'idhafah'],
  'mudhof': ['mudhaf', 'idhafah'],

  // Adad
  'adad': ['adad', "'adad", 'bilangan'],

  // Sharaf / Tasrif / Tarkhim / Tashghir
  'tarkhim': ['tarkhim', 'tarkheem'],
  'tashghir': ['tashghir', 'tasghir'],
  'tasghir': ['tashghir'],
  'sharaf': ['sharaf', 'saraf'],
  'saraf': ['sharaf'],
};

// Normalisasi teks gramatika Arab/Indonesia (menghilangkan apostrof seperti fa'il -> fail)
function normalizeNahwuText(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/['’‘`]/g, '') // fa'il -> fail, na'ibul -> naibul, i'rab -> irab
    .replace(/[^a-z0-9\u0600-\u06FF\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Hitung skor relevansi leksikal berbobot tinggi untuk naskah Al-Kawakib */
function wordBoundaryMatch(target: string, token: string): boolean {
  if (!target || !token) return false;
  // Gunakan word boundary regex agar kata pendek 'tau' TIDAK PERNAH mencocokkan 'taukid'
  const re = new RegExp('\\b' + token + '\\b', 'i');
  return re.test(target);
}

function calculateLexicalScore(query: string, chunk: KawakibChunk): number {
  const normQuery = normalizeNahwuText(query);
  const rawTokens = normQuery.split(/\s+/).filter(t => t.length >= 2);
  if (rawTokens.length === 0) return 0;

  // Filter stopwords, gunakan rawTokens jika semuanya adalah stopwords
  const meaningfulTokens = rawTokens.filter(t => !NAHWU_STOPWORDS.has(t));
  const baseTokens = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;

  // Ekspansi sinonim dan variasi ejaan fonetik
  const expandedTokens = new Set<string>();
  for (const t of baseTokens) {
    expandedTokens.add(t);
    if (NAHWU_VARIANTS[t]) {
      NAHWU_VARIANTS[t].forEach(v => expandedTokens.add(v));
    }
  }
  const tokens = Array.from(expandedTokens);

  const babNorm = normalizeNahwuText(chunk.bab);
  const textNorm = normalizeNahwuText(chunk.text);

  let score = 0;

  for (const token of tokens) {
    // 1. Bobot sangat tinggi jika kata kunci ada dalam nama Bab/Fasal (DENGAN BATAS KATA)
    if (wordBoundaryMatch(babNorm, token)) {
      score += 30;
      // Bonus jika diawali 'bab [token]' atau 'fasal [token]'
      if (babNorm.includes('bab ' + token) || babNorm.includes('fasal ' + token)) {
        score += 20;
      }
    }

    // 2. Bobot kemunculan dalam isi teks naskah (DENGAN BATAS KATA)
    if (wordBoundaryMatch(textNorm, token)) {
      score += 3;
      // Hitung frekuensi kemunculan (dibatasi agar tidak bias)
      const count = (textNorm.match(new RegExp('\\b' + token + '\\b', 'gi')) || []).length;
      score += Math.min(count * 0.8, 12);
    }
  }

  // 3. Bonus prioritas jika chunk memuat pembuka bab/definisi utama
  if (chunk.text.includes('بَاب') || chunk.text.includes('Bab Tentang') || chunk.text.includes('Definisi') || chunk.text.includes('Pengertian')) {
    score += 10;
  }

  return score;
}

/** Pencarian khusus pada korpus Al-Kawakib yang mengembalikan metadata lengkap */
export async function searchKawakibChunks(query: string, k = 4): Promise<KawakibChunk[]> {
  const chunks = loadKawakibIndex();
  if (chunks.length === 0) return [];

  // Hitung skor leksikal untuk semua chunk
  const scored = chunks.map(chunk => ({
    chunk,
    score: calculateLexicalScore(query, chunk),
  }));

  scored.sort((a, b) => b.score - a.score);

  // Ambil top-k yang memiliki skor relevan (> 0.1)
  const results = scored
    .filter(s => s.score > 0.1)
    .slice(0, k)
    .map(s => s.chunk);

  return results.length > 0 ? results : scored.slice(0, 1).map(s => s.chunk);
}

/** Simpan chunk-chunk teks tambahan ke vector store */
export async function upsertChunks(
  chunks: { id: string; text: string; metadata?: Record<string, string> }[]
) {
  const store = loadStore();

  for (const chunk of chunks) {
    let vector: number[] | undefined;
    try {
      vector = await embedText(chunk.text);
    } catch {
      // jika offline/tidak ada API key, simpan tanpa vektor
    }

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

/** Cari top-k chunk paling mirip dengan query (Hybrid RAG) */
export async function similaritySearch(query: string, k = 4, minScore = 0.48): Promise<string[]> {
  const kawakibChunks = loadKawakibIndex();

  // 1. Coba pencarian semantik vektor jika API Key SumoPod tersedia
  const apiKey = (process.env.SUMOPOD_API_KEY || '').trim();
  const store = loadStore();

  if (apiKey && store.length > 0) {
    try {
      const queryVector = await embedText(query);
      const scored = store
        .filter(entry => entry.vector && entry.vector.length > 0)
        .map((entry) => ({
          text: entry.text,
          score: cosineSimilarity(queryVector, entry.vector!),
        }));

      scored.sort((a, b) => b.score - a.score);
      const semResults = scored
        .filter((s) => s.score >= minScore)
        .slice(0, k)
        .map((s) => s.text);

      if (semResults.length > 0) return semResults;
    } catch (err) {
      console.warn('Vector embedding similarity search fallback to lexical:', err);
    }
  }

  // 2. Pencarian Leksikal Berbobot pada Korpus 284 Halaman Al-Kawakib
  const lexResults = await searchKawakibChunks(query, k);
  return lexResults.map(c => c.text);
}

/** Proteksi Kitab Kurikulum Inti */
const PROTECTED_DOC_IDS = ['al-kawakib-ad-durriyyah'];

export function isProtectedDocument(docId: string): boolean {
  return PROTECTED_DOC_IDS.some(p => docId === p || docId.startsWith(p + '-'));
}

export function deleteDocument(docId: string) {
  if (isProtectedDocument(docId)) {
    console.warn(`[Security] Percobaan menghapus kitab kurikulum inti ditolak: ${docId}`);
    return;
  }
  const store = loadStore().filter((e) => {
    if (e.metadata?.docId) return e.metadata.docId !== docId;
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
  const kawakibChunks = loadKawakibIndex();
  const list: DocSummary[] = [
    {
      docId: 'al-kawakib-ad-durriyyah',
      docName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah Al-Jurumiyyah (284 Halaman)',
      chunkCount: kawakibChunks.length || 558,
    },
  ];

  const store = loadStore();
  const map = new Map<string, DocSummary>();

  for (const e of store) {
    const docId = e.metadata?.docId ?? e.id.split('-chunk-')[0];
    if (docId === 'al-kawakib-ad-durriyyah') continue;
    const docName = e.metadata?.docName ?? docId.replace(/^\d+-/, '');

    if (map.has(docId)) {
      map.get(docId)!.chunkCount += 1;
    } else {
      map.set(docId, { docId, docName, chunkCount: 1 });
    }
  }

  return [...list, ...Array.from(map.values())];
}
