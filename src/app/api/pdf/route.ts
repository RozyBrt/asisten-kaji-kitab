import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(
      process.cwd(),
      'rujukan',
      'INTISARI KITAB AL-KAWAKIB AL-DURRIYYAH SYARAH MUTAMMIMAH AL-JURUMIYYAH.pdf'
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File PDF rujukan belum ditemukan di server.' },
        { status: 404 }
      );
    }

    const isDownload = request.nextUrl.searchParams.get('download') === '1';
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = 'INTISARI-KITAB-AL-KAWAKIB-AL-DURRIYYAH.pdf';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': isDownload
          ? `attachment; filename="${fileName}"`
          : `inline; filename="${fileName}"`,
        'Content-Length': String(fileBuffer.length),
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'digest' in error && (error as { digest: string }).digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw error;
    }
    console.error('Error serving PDF:', error);
    return NextResponse.json(
      { error: 'Gagal memuat file PDF rujukan.' },
      { status: 500 }
    );
  }
}
