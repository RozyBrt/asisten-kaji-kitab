import { connection, NextResponse } from 'next/server';
import { getAiProviderStatus } from '@/lib/ai-provider';

export async function GET() {
  await connection();

  return NextResponse.json(getAiProviderStatus(), {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
