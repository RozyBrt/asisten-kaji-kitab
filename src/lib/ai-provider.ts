/** Prioritas provider AI — selaras dengan `src/app/api/chat/route.ts` */

export type AiProviderMode = 'sumopod' | 'gemini' | 'mock';

export interface AiProviderStatus {
  mode: AiProviderMode;
  label: string;
  hint: string;
  source: 'configuration' | 'response';
}

function envKey(name: string): string | undefined {
  const value = process.env[name];
  if (!value || value.trim() === '') return undefined;
  return value.trim();
}

export function getSumopodApiKey(): string | undefined {
  return envKey('SUMOPOD_API_KEY') ?? envKey('OPENAI_API_KEY');
}

export function getGeminiApiKey(): string | undefined {
  return envKey('GEMINI_API_KEY');
}

export function getConfiguredAiProvider(): AiProviderMode {
  if (getSumopodApiKey()) return 'sumopod';
  if (getGeminiApiKey()) return 'gemini';
  return 'mock';
}

export function getAiProviderStatus(
  mode = getConfiguredAiProvider(),
  source: AiProviderStatus['source'] = 'configuration'
): AiProviderStatus {
  switch (mode) {
    case 'sumopod':
      return {
        mode,
        label: source === 'response' ? 'SumoPod (respons terakhir)' : 'SumoPod (key terdeteksi)',
        source,
        hint: source === 'response'
          ? 'Respons terakhir berhasil dibuat melalui SumoPod.'
          : 'Kunci API terdeteksi; koneksi belum diuji dan permintaan dapat beralih ke Mock jika gagal.',
      };
    case 'gemini':
      return {
        mode,
        label: source === 'response' ? 'Google Gemini (respons terakhir)' : 'Google Gemini (key terdeteksi)',
        source,
        hint: source === 'response'
          ? 'Respons terakhir berhasil dibuat melalui Google Gemini.'
          : 'Kunci API terdeteksi; koneksi belum diuji dan permintaan dapat beralih ke Mock jika gagal.',
      };
    default:
      return {
        mode,
        label: source === 'response' ? 'Simulasi (fallback Mock)' : 'Simulasi (Mock)',
        source,
        hint: source === 'response'
          ? 'Provider AI live gagal atau tidak tersedia; respons terakhir dibuat oleh simulasi Mock.'
          : 'Tidak ada kunci API AI; chat menggunakan respons simulasi.',
      };
  }
}
