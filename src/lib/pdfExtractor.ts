import { extractText, getDocumentProxy } from 'unpdf';

/**
 * Membaca file PDF (Buffer) dan mengembalikan seluruh teks di dalamnya.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  const uint8 = new Uint8Array(buffer);
  const { text } = await extractText(uint8, { mergePages: true });
  return text || '';
}

/**
 * Mengembalikan metadata PDF (jumlah halaman, info, teks).
 */
export async function extractPdfMetadata(buffer: Buffer): Promise<{
  numpages: number;
  info: Record<string, string>;
  text: string;
}> {
  const uint8 = new Uint8Array(buffer);
  const pdf = await getDocumentProxy(uint8);
  const { text, totalPages } = await extractText(uint8, { mergePages: true });
  return {
    numpages: totalPages || pdf.numPages || 0,
    info: {},
    text: text || '',
  };
}
