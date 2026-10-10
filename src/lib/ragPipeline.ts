import { extractPdfMetadata, extractPdfText } from './pdfExtractor';
import { similaritySearch, upsertChunks } from './vectorStore';
import { transcribeKitabImage } from './visionOcr';

const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 150;

export function splitIntoChunks(
  text: string,
  chunkSize = CHUNK_SIZE,
  overlap = CHUNK_OVERLAP
): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.slice(start, end).trim();
    if (chunk.length > 30) {
      chunks.push(chunk);
    }
    start += chunkSize - overlap;
  }
  return chunks;
}

/** Ingest teks PDF biasa (digital text) */
export async function ingestPdf(
  buffer: Buffer,
  docId: string,
  docName?: string
): Promise<{ nChunks: number; totalPages: number; needsVision: boolean; text?: string }> {
  const metadata = await extractPdfMetadata(buffer);
  const totalPages = metadata.numpages || 1;

  if (totalPages > 100) {
    throw new Error(
      `File PDF memiliki ${totalPages} halaman (melebihi batas maksimal 100 lembar).`
    );
  }

  const rawText = await extractPdfText(buffer);

  // Jika teks digital ditemukan dan mencukupi (> 100 karakter)
  if (rawText && rawText.trim().length > 100) {
    const textChunks = splitIntoChunks(rawText);
    const chunks = textChunks.map((text, i) => ({
      id: `${docId}-chunk-${i}`,
      text,
      metadata: {
        docId,
        docName: docName || docId,
        chunkIndex: String(i),
      },
    }));
    await upsertChunks(chunks);
    return { nChunks: chunks.length, totalPages, needsVision: false, text: rawText };
  }

  // Jika teks kosong / sangat minim (scanned PDF), perlu AI Vision per halaman
  return { nChunks: 0, totalPages, needsVision: true };
}

/** Ingest satu halaman gambar (hasil scan/foto) dengan AI Vision */
export async function ingestPageImage(
  imageBase64: string,
  docId: string,
  pageNumber: number,
  docName?: string
): Promise<{ text: string; nChunks: number }> {
  const text = await transcribeKitabImage(imageBase64, pageNumber);
  const textChunks = splitIntoChunks(text);
  const chunks = textChunks.map((chunkText, i) => ({
    id: `${docId}-p${pageNumber}-c${i}`,
    text: chunkText,
    metadata: {
      docId,
      docName: docName || docId,
      page: String(pageNumber),
      chunkIndex: String(i),
    },
  }));

  if (chunks.length > 0) {
    await upsertChunks(chunks);
  }

  return { text, nChunks: chunks.length };
}

/** Jawab pertanyaan dengan RAG context */
export async function answerWithRag(query: string): Promise<string> {
  const contextChunks = await similaritySearch(query, 4);

  if (contextChunks.length === 0) {
    return 'Maaf, belum ada dokumen yang di-index. Silakan unggah PDF kitab terlebih dahulu melalui Panel Unggah Dokumen.';
  }

  const SEP = '\n\n---\n\n';
  const context = contextChunks.join(SEP);

  const systemPrompt =
    'Kamu adalah asisten AI ahli kajian kitab kuning (turats) dan keilmuan Islam. ' +
    'Jelaskan materi dengan gaya tutur yang santun, mengalir, runtut, dan mudah dipahami layaknya seorang ustadz menerangkan kepada santrinya. ' +
    'Rujuklah konteks dokumen kitab yang diberikan secara akurat. Sebutkan nama kitab dan bab pembahasannya secara tepat tanpa perlu mereka-reka nomor halaman. ' +
    'Jika konteks tidak cukup, jelaskan dari khazanah turats yang valid dan sampaikan dengan jujur.';

  const userPrompt =
    'Konteks dari kitab (hasil RAG):\n\n' + context + '\n\n---\n\nPertanyaan: ' + query + '\n\nJawaban:';

  const baseUrl = (process.env.SUMOPOD_BASE_URL || 'https://ai.sumopod.com/v1').trim();
  const apiKey  = (process.env.SUMOPOD_API_KEY  || '').trim();
  const model   = (process.env.SUMOPOD_MODEL    || 'gpt-4o-mini').trim();

  const response = await fetch(baseUrl + '/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + apiKey,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error('LLM API error: ' + response.status + ' - ' + err);
  }

  const json = await response.json();
  return json.choices?.[0]?.message?.content ?? 'Tidak ada jawaban dari model.';
}
