import type { NextRequest } from 'next/server';
import { ingestPdf, ingestPageImage, answerWithRag } from '@/lib/ragPipeline';
import { deleteDocument, listDocuments } from '@/lib/vectorStore';

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Kasus 1: Multipart Form (Upload File PDF atau Gambar)
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file') as File | null;

      if (!file) {
        return Response.json({ error: 'Harus mengirim file dokumen atau gambar.' }, { status: 400 });
      }

      // Batasi ukuran file 50 MB
      if (file.size > 50 * 1024 * 1024) {
        return Response.json({ error: 'Ukuran file melebihi batas 50 MB.' }, { status: 413 });
      }

      const docId = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      // A. Jika file adalah Gambar (JPEG/PNG/WEBP)
      if (file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name)) {
        const base64 = buffer.toString('base64');
        const mime = file.type || 'image/jpeg';
        const res = await ingestPageImage(`data:${mime};base64,${base64}`, docId, 1, file.name);

        return Response.json({
          success: true,
          message: `Gambar "${file.name}" berhasil ditranskripsi & di-index (${res.nChunks} chunk).`,
          docId,
          nChunks: res.nChunks,
          needsVision: false,
        });
      }

      // B. Jika file adalah PDF
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const res = await ingestPdf(buffer, docId, file.name);

        if (res.needsVision) {
          return Response.json({
            success: true,
            needsVision: true,
            totalPages: res.totalPages,
            docId,
            docName: file.name,
            message: `PDF terdeteksi scan/gambar (${res.totalPages} halaman). Siap diproses AI Vision.`,
          });
        }

        return Response.json({
          success: true,
          needsVision: false,
          message: `PDF "${file.name}" berhasil di-index (${res.nChunks} chunk).`,
          docId,
          nChunks: res.nChunks,
          totalPages: res.totalPages,
        });
      }

      return Response.json(
        { error: 'Format file tidak didukung. Harap unggah PDF atau Gambar (JPG/PNG).' },
        { status: 400 }
      );
    }

    // Kasus 2: JSON Body
    const body = await request.json();

    // A. Sub-kasus: Ingest halaman hasil render browser via AI Vision
    if (body?.action === 'vision-page') {
      const { docId, docName, pageNumber, imageBase64 } = body;
      if (!docId || !imageBase64) {
        return Response.json({ error: 'docId dan imageBase64 wajib diisi.' }, { status: 400 });
      }

      const result = await ingestPageImage(
        imageBase64,
        docId,
        Number(pageNumber) || 1,
        docName
      );

      return Response.json({
        success: true,
        docId,
        pageNumber,
        nChunks: result.nChunks,
        message: `Halaman ${pageNumber} berhasil di-index (${result.nChunks} chunk).`,
      });
    }

    // B. Sub-kasus: Query RAG
    const query = (body?.query as string)?.trim();
    if (!query) {
      return Response.json({ error: 'Harus mengirim "query" atau "action".' }, { status: 400 });
    }

    const answer = await answerWithRag(query);
    return Response.json({ answer });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[RAG API Error]', message);
    return Response.json({ error: message }, { status: 500 });
  }
}

// GET: Daftar dokumen
export async function GET() {
  try {
    const docs = listDocuments();
    return Response.json({ documents: docs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}

const PROTECTED_DOC_IDS = ['safinatun-najah', 'fathul-qarib', 'talimul-mutaallim', 'al-kawakib-ad-durriyyah'];

// DELETE: Hapus dokumen
export async function DELETE(request: NextRequest) {
  try {
    const { docId } = await request.json();
    if (!docId) {
      return Response.json({ error: 'Harus mengirim "docId".' }, { status: 400 });
    }
    if (PROTECTED_DOC_IDS.some(p => docId === p || docId.startsWith(p + '-'))) {
      return Response.json(
        { error: 'Dokumen ini adalah Kitab Kurikulum Inti Pesantren yang dilindungi dan tidak dapat dihapus.' },
        { status: 403 }
      );
    }
    deleteDocument(docId);
    return Response.json({ success: true, message: `Dokumen "${docId}" dihapus dari index.` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
