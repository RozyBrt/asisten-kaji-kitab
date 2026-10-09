import { getGeminiApiKey, getSumopodApiKey } from './ai-provider';

const OCR_SYSTEM_PROMPT =
  'Anda adalah pakar filologi dan pembaca naskah kitab turats (klasik Islam). ' +
  'Tugas Anda adalah membaca dan mentranskripsikan seluruh teks Arab dari gambar halaman kitab yang diberikan dengan akurasi maksimal.\n\n' +
  'Aturan Transkripsi:\n' +
  '1. Ketikkan ulang seluruh teks Arab matan dan syarah ke dalam teks Arab digital standar (UTF-8).\n' +
  '2. Pertahankan keaslian harakat, waqaf, dan tanda baca jika terlihat pada gambar.\n' +
  '3. Jika ada teks matan (utama) dan syarah/catatan pinggir (hamisy), tuliskan keduanya secara runtut.\n' +
  '4. JANGAN menerjemahkan, JANGAN meringkas, dan JANGAN menambahkan opini pribadi.\n' +
  '5. Kembalikan HANYA teks Arab hasil transkripsi dan judul fasal/bab jika ada.';

export async function transcribeKitabImage(
  imageBase64: string,
  pageNumber?: number
): Promise<string> {
  const sumopodApiKey = getSumopodApiKey();
  const geminiApiKey = getGeminiApiKey();

  const base64Url = imageBase64.startsWith('data:')
    ? imageBase64
    : 'data:image/jpeg;base64,' + imageBase64;

  const userPrompt = pageNumber
    ? 'Berikut adalah foto/scan halaman ' + pageNumber + ' dari kitab. Tolong transkripsikan seluruh teks Arab-nya dengan lengkap.'
    : 'Berikut adalah foto/scan halaman kitab. Tolong transkripsikan seluruh teks Arab-nya dengan lengkap.';

  // 1. Coba SumoPod (OpenAI-compatible Vision)
  if (sumopodApiKey) {
    try {
      const rawBaseUrl = process.env.SUMOPOD_BASE_URL || 'https://ai.sumopod.com';
      let endpoint = rawBaseUrl.replace(/\/+$/, '');
      if (!endpoint.endsWith('/chat/completions')) {
        endpoint = endpoint.endsWith('/v1') ? endpoint + '/chat/completions' : endpoint + '/v1/chat/completions';
      }
      const model = process.env.SUMOPOD_MODEL || 'gpt-4o-mini';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + sumopodApiKey.trim(),
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: OCR_SYSTEM_PROMPT },
            {
              role: 'user',
              content: [
                { type: 'text', text: userPrompt },
                { type: 'image_url', image_url: { url: base64Url } },
              ],
            },
          ],
          temperature: 0.2,
          max_tokens: 3000,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const text = json.choices?.[0]?.message?.content?.trim();
        if (text) return text;
      } else {
        const err = await res.text();
        console.error('[Vision OCR] SumoPod Vision error:', err);
      }
    } catch (e) {
      console.error('[Vision OCR] Error calling SumoPod vision:', e);
    }
  }

  // 2. Coba Gemini Vision jika tersedia
  if (geminiApiKey) {
    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + geminiApiKey.trim();

      const res = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: OCR_SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: 'user',
              parts: [
                { text: userPrompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 3000,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return text;
      }
    } catch (e) {
      console.error('[Vision OCR] Error calling Gemini vision:', e);
    }
  }

  throw new Error('Gagal melakukan OCR Vision: Tidak ada API key yang valid atau API mengembalikan error.');
}
