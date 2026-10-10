import { extractText, getDocumentProxy } from 'unpdf';

function toCleanUint8Array(buffer: Buffer): Uint8Array {
  // Salin ke ArrayBuffer baru yang bersih agar tidak memicu "Cannot transfer object of unsupported type"
  const ab = new ArrayBuffer(buffer.byteLength);
  const view = new Uint8Array(ab);
  view.set(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength));
  return view;
}

/**
 * Membaca file PDF (Buffer) dan mengembalikan seluruh teks di dalamnya.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const uint8 = toCleanUint8Array(buffer);
    const { text } = await extractText(uint8, { mergePages: true });
    return text || '';
  } catch (e) {
    console.error('Error extractPdfText:', e);
    return '';
  }
}

/**
 * Mengembalikan metadata PDF (jumlah halaman, info, teks).
 */
export async function extractPdfMetadata(buffer: Buffer): Promise<{
  numpages: number;
  info: Record<string, string>;
  text: string;
}> {
  try {
    const uint8 = toCleanUint8Array(buffer);
    const pdf = await getDocumentProxy(uint8);
    const totalPages = pdf.numPages || 1;
    let text = '';
    try {
      const res = await extractText(uint8, { mergePages: true });
      text = res.text || '';
    } catch {
      // fallback jika extractText bermasalah
    }
    return {
      numpages: totalPages,
      info: {},
      text,
    };
  } catch (e) {
    console.error('Error extractPdfMetadata:', e);
    return {
      numpages: 1,
      info: {},
      text: '',
    };
  }
}
