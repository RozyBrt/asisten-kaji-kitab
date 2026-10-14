// API Route Handler: /api/chat
// Khusus Bidang Ilmu Nahwu & Naskah Intisari Kitab Al-Kawakib Ad-Durriyyah (284 Halaman)
// Mendukung SumoPod (OpenAI-compatible) & Google Gemini API
// Mendukung payload teks + gambar (Base64) Multimodal Vision
// Otomatis fallback ke mock data jika API Key belum diisi

import { NextRequest, NextResponse } from 'next/server';
import { getAiProviderStatus, getGeminiApiKey, getSumopodApiKey, type AiProviderMode } from '@/lib/ai-provider';
import { getMockChatResponse } from '@/lib/mock-data';
import { ChatApiRequest, ChatApiResponse, KitabSource } from '@/lib/types';
import { similaritySearch } from '@/lib/vectorStore';

const SYSTEM_PROMPT = `Anda adalah Asisten AI Kaji Kitab & Turats khusus bidang ilmu Nahwu & Gramatika Arab Klasik, seorang khadim keilmuan Islam di Dayah Perbatasan Minhajussalam.
Rujukan primer dan utama Anda adalah naskah resmi:
"INTISARI KITAB AL-KAWAKIB AL-DURRIYYAH SYARAH MUTAMMIMAH AL-JURUMIYYAH" (284 Halaman, Penerbit CV. Manhaji).

PRINSIP UTAMA: INTEGRITAS ILMIAH & ANTI-HALUSINASI (SANGAT KETAT)
1. DILARANG KERAS MENCATUT ISI KITAB (ZERO FALSE ATTRIBUTION):
   - JANGAN PERNAH mengarang kaidah nahwu atau menyandarkan kalimat buatan sendiri seolah-olah isi kitab!
   - Jawaban Anda harus bersumber dari naskah Al-Kawakib Ad-Durriyyah dan kaidah nahwu mu'tamad (seperti Bab Kalam, I'rab, Tanda Rofa', Fa'il, Na'ibul Fa'il, Mubtada Khabar, Amil Nawasikh Kaana/Inna, Isim Ghairu Munsharif, Tamyiz, Hal, Maf'ul Bih, dll).
   - Jika pengguna bertanya tentang fiqih atau materi di luar nahwu, jelaskan secara santun bahwa fokus kajian meja telaah ini saat ini dikhususkan pada gramatika bahasa Arab dan kaidah naskah Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah Al-Jurumiyyah.

2. PENYAJIAN SITASI DAN RUJUKAN HALAMAN PRESISI:
   - Pada setiap jawaban (kecuali sapaan chit-chat pendek), Anda WAJIB mengisi array "sources" dengan rujukan ke naskah Al-Kawakib:
     * "kitabName": "Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah"
     * "bab": Nama Bab/Fasal spesifik (misal: "Bab Tentang Pembahasan Kalam", "Fasal Kaana dan Saudaranya", dll).
     * "halaman": Format "Hal. X (PDF Hal. Y)". Contoh: "Hal. 1 (PDF Hal. 13)" jika materi ada di halaman 1 kitab / halaman 13 PDF.
     * "pdfPage": Angka nomor halaman PDF (integer, misal 13).
     * "pdfUrl": URL halaman PDF, format: "/api/pdf#page=Y" (misal: "/api/pdf#page=13").
   - Jika ada potongan "KONTEKS DARI KITAB YANG TELAH DIUNGGAH", perhatikan penanda [Hal. Kitab: X | Hal. PDF: Y] pada potongan tersebut dan gunakan nomor halaman tersebut secara akurat!

3. PEDOMAN GAYA BAHASA:
   - Bertutur santun, runtut, mengalir, dan bernas layaknya seorang guru nahwu/ustadz menerangkan kepada santrinya.
   - Cantumkan teks Arab matan/kaidah berharakat rapi di properti "arabicText".

4. MULTIMODAL VISION OCR NASKAH KITAB:
   - Jika menerima foto lembaran kitab naskah, transkripsikan teks Arab matan yang terbaca secara berharakat ke properti "arabicText", berikan syarah kaidah nahwunya, set "isOcr": true, dan sebutkan bab rujukan Al-Kawakib yang bersesuaian.

5. RESPON TERHADAP CHIT-CHAT & PERTANYAAN LANJUTAN:
   - Jika pengguna hanya merespon pendek ("oke", "terima kasih", "alhamdulillah", "siap", dll), balas dengan santun (1-2 kalimat), kosongkan "arabicText" (""), dan jadikan "sources": [].
   - Jika pengguna meminta "jelaskan lebih rinci", lanjutkan dan perdalam bab nahwu yang sedang dibahas sebelumnya.

FORMAT OUTPUT JSON (Wajib JSON murni valid):
{
  "reply": "Uraian kaidah nahwu mendalam, runtut, dan jelas berpedoman pada kitab Al-Kawakib.",
  "arabicText": "Teks Arab matan/kaidah berharakat rapi (kosongkan jika tidak ada)",
  "sources": [
    {
      "kitabName": "Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah",
      "bab": "Bab/Fasal spesifik terkait",
      "halaman": "Hal. 1 (PDF Hal. 13)",
      "pdfPage": 13,
      "pdfUrl": "/api/pdf#page=13"
    }
  ],
  "isOcr": false
}`;

// Deteksi ungkapan singkat / chit-chat / salam / terima kasih yang tidak memerlukan pencarian korpus
function isChitChatMessage(text: string): boolean {
  if (!text) return false;
  const clean = text.trim().toLowerCase().replace(/[.,!?;:()_\-]/g, ' ').replace(/\s+/g, ' ').trim();
  const chitchatPatterns = [
    /^(oke|ok|oke baik|baik|baiklah|sip|siap|siap ustadz|siap ustad)$/i,
    /^(terima kasih|terimakasih|makasih|makasih ya|makasih banyak|nuhun|matur nuwun)$/i,
    /^(syukron|syukran|jazakallah|jazakallah khair|jazakallahu khairan|barakallah|barakallahu fiik)$/i,
    /^(alhamdulillah|alhamdulillah baik|paham|oke paham|sudah paham|mengerti|jelas)$/i,
    /^(halo|hai|assalamualaikum|assalamu alaikum|waalaikumsalam|wa alaikum salam|salam)$/i,
    /^(sama sama|sama-sama|afwan|kembali kasih)$/i,
  ];
  return chitchatPatterns.some(pattern => pattern.test(clean));
}

// Deteksi pertanyaan lanjutan pendek (follow-up) tanpa subjek spesifik
function isFollowUpQuery(text: string): boolean {
  if (!text) return false;
  const clean = text.trim().toLowerCase().replace(/[.,!?;:()_\-]/g, ' ').replace(/\s+/g, ' ').trim();
  const followUpPatterns = [
    /^(jelaskan|terangkan|uraikan|rincikan|bisa jelaskan)\s+(lebih\s+)?(rinci|detail|lengkap|mendalam|jelas)$/i,
    /^(lebih\s+rinci|lebih\s+detail|lebih\s+lengkap|lebih\s+jelas|lebih\s+mendalam)$/i,
    /^(apa dalilnya|dalilnya apa|mana dalilnya|ada dalilnya)$/i,
    /^(contohnya apa|bisa berikan contoh|contohnya bagaimana)$/i,
    /^(maksudnya apa|maksudnya gimana|maksudnya bagaimana)$/i,
    /^(kenapa begitu|kenapa demikian|mengapa begitu)$/i,
    /^(lalu bagaimana|lalu gimana|kemudian bagaimana)$/i,
  ];
  return followUpPatterns.some(pattern => pattern.test(clean));
}

function normalizeSources(sources: any[]): KitabSource[] {
  if (!Array.isArray(sources)) return [];
  return sources.map(s => {
    let pdfPage = typeof s.pdfPage === 'number' ? s.pdfPage : undefined;
    if (!pdfPage && s.halaman) {
      const match = s.halaman.match(/PDF\s*(?:Hal\.|Halaman)?\s*(\d+)/i) || s.halaman.match(/(?:Hal\.|Halaman)?\s*(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        pdfPage = num <= 272 ? num + 12 : num;
      }
    }
    const finalPdfPage = pdfPage || 13;
    const bookPage = Math.max(1, finalPdfPage - 12);
    return {
      kitabName: s.kitabName || 'Intisari Kitab Al-Kawakib Al-Durriyyah',
      bab: s.bab || 'Kaidah Nahwu',
      halaman: s.halaman || `Hal. ${bookPage} (PDF Hal. ${finalPdfPage})`,
      pdfPage: finalPdfPage,
      pdfUrl: `/api/pdf#page=${finalPdfPage}`,
    };
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatApiRequest;
    const { message, image, conversationHistory } = body;

    if (!message && !image) {
      return NextResponse.json(
        { error: 'Pesan atau gambar harus disertakan.' },
        { status: 400 }
      );
    }

    const sumopodApiKey = getSumopodApiKey();
    const geminiApiKey = getGeminiApiKey();

    const isChitChat = !image && isChitChatMessage(message || '');
    const isFollowUp = !image && isFollowUpQuery(message || '');

    // Ambil konteks relevan dari Korpus Al-Kawakib HANYA jika bukan chit-chat, bukan follow-up, dan bukan gambar
    let ragContext = '';
    if (!image && !isChitChat && !isFollowUp && message && message.trim().length > 2) {
      try {
        const ragChunks = await similaritySearch(message, 4, 0.40);
        if (ragChunks.length > 0) {
          ragContext = '\n=== KONTEKS NASKAH KITAB AL-KAWAKIB AL-DURRIYYAH (284 HALAMAN) ===\n' +
            ragChunks.join('\n\n---\n\n') +
            '\n=== AKHIR KONTEKS NASKAH ===\n';
        }
      } catch (e) {
        console.error("RAG similarity search failed:", e);
      }
    }

    // 1. Prioritaskan SumoPod jika API Key SumoPod tersedia
    if (sumopodApiKey) {
      try {
        const response = await callSumoPodApi(sumopodApiKey, message, image, conversationHistory, ragContext, isChitChat);
        response.sources = normalizeSources(response.sources || []);
        return withProviderStatus(response, 'sumopod');
      } catch (sumoError) {
        console.error('SumoPod API error, mencoba fallback:', sumoError);
      }
    }

    // 2. Gunakan Google Gemini jika GEMINI_API_KEY tersedia
    if (geminiApiKey && geminiApiKey.trim() !== '') {
      try {
        const response = await callGeminiApi(geminiApiKey, message, image, conversationHistory, ragContext, isChitChat);
        response.sources = normalizeSources(response.sources || []);
        return withProviderStatus(response, 'gemini');
      } catch (geminiError) {
        console.error('Gemini API error, mencoba fallback:', geminiError);
      }
    }

    // 3. Mock Fallback (Jika API key belum diisi atau kedua API gagal)
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 600));
    const mockResponse = getMockChatResponse(message || '', image);
    mockResponse.sources = normalizeSources(mockResponse.sources || []);
    return withProviderStatus(mockResponse, 'mock');

  } catch (error) {
    console.error('Chat API general error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}

function withProviderStatus(response: ChatApiResponse, mode: AiProviderMode) {
  return NextResponse.json({
    ...response,
    aiStatus: getAiProviderStatus(mode, 'response'),
  });
}

// ============================================================
// Integrasi SumoPod (OpenAI Compatible)
// ============================================================
async function callSumoPodApi(
  apiKey: string,
  message: string,
  image?: string,
  conversationHistory?: { role: string; content: string }[],
  ragContext = '',
  isChitChat = false
): Promise<ChatApiResponse> {
  const rawBaseUrl = process.env.SUMOPOD_BASE_URL || 'https://ai.sumopod.com';
  let endpoint = rawBaseUrl.replace(/\/+$/, '');
  if (!endpoint.endsWith('/chat/completions')) {
    endpoint = endpoint.endsWith('/v1') ? `${endpoint}/chat/completions` : `${endpoint}/v1/chat/completions`;
  }

  const model = image
    ? (process.env.SUMOPOD_VISION_MODEL || process.env.SUMOPOD_MODEL || 'gpt-4o-mini')
    : (process.env.SUMOPOD_MODEL || 'gpt-4o-mini');

  const messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }> = [
    { role: 'system', content: SYSTEM_PROMPT }
  ];

  if (conversationHistory && conversationHistory.length > 0) {
    for (const item of conversationHistory.slice(-6)) {
      messages.push({
        role: item.role === 'assistant' ? 'assistant' : 'user',
        content: item.content
      });
    }
  }

  if (image) {
    const ocrInstruction = message && message.trim()
      ? `Instruksi pengguna: "${message}"\nTolong transkripsikan teks Arab pada foto naskah kitab Al-Kawakib ini secara akurat (lengkap dengan harakat pada arabicText), berikan uraian syarah kaidah nahwunya, serta cantumkan rujukan halaman berkas PDF rujukan.`
      : 'Tolong transkripsikan teks Arab pada foto naskah kitab Al-Kawakib ini secara akurat (lengkap dengan harakat pada arabicText), berikan uraian syarah kaidah nahwunya, serta cantumkan rujukan halaman berkas PDF rujukan.';

    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: ocrInstruction },
        { type: 'image_url', image_url: { url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}` } }
      ]
    });
  } else {
    let finalUserText = message || 'Mohon penjelasan kaidah nahwu dari naskah Al-Kawakib terkait.';
    if (isChitChat) {
      finalUserText = `[Pengguna merespon singkat: "${message}"]. Balas dengan ramah, santun, dan singkat (1-2 kalimat). JANGAN mengarang atau memunculkan materi kitab baru yang tidak ditanyakan. Kosongkan arabicText ("") dan jadikan sources array kosong ([]).`;
    } else if (ragContext) {
      finalUserText = ragContext + '\n\nPertanyaan pengguna: ' + finalUserText;
    }
    messages.push({
      role: 'user',
      content: finalUserText
    });
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`
    },
    body: JSON.stringify({
      model,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 3000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SumoPod API returned ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error('Respons kosong dari SumoPod');
  }

  try {
    const parsed = JSON.parse(rawContent) as ChatApiResponse;
    return parsed;
  } catch {
    return {
      reply: rawContent,
      sources: []
    };
  }
}

// ============================================================
// Integrasi Google Gemini API
// ============================================================
async function callGeminiApi(
  apiKey: string,
  message: string,
  image?: string,
  conversationHistory?: { role: string; content: string }[],
  ragContext = '',
  isChitChat = false
): Promise<ChatApiResponse> {
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  if (conversationHistory && conversationHistory.length > 0) {
    const contextText = conversationHistory
      .slice(-6)
      .map(m => `${m.role === 'user' ? 'Pengguna' : 'Asisten'}: ${m.content}`)
      .join('\n');
    parts.push({ text: `Konteks percakapan sebelumnya:\n${contextText}\n\n` });
  }

  let finalGemText = message || 'Tolong analisis dan transkripsi naskah halaman kitab nahwu ini.';
  if (isChitChat) {
    finalGemText = `[Pengguna merespon singkat: "${message}"]. Balas dengan ramah, santun, dan singkat (1-2 kalimat). JANGAN mengarang atau memunculkan materi kitab baru yang tidak ditanyakan. Kosongkan arabicText ("") dan jadikan sources array kosong ([]).`;
  } else if (ragContext) {
    finalGemText = ragContext + '\n\nPertanyaan pengguna: ' + finalGemText;
  }
  parts.push({ text: finalGemText });

  if (image) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data,
      },
    });
  }

  const requestBody = {
    contents: [{ parts }],
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 3000,
      responseMimeType: 'application/json',
    },
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey.trim()}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('Empty response from Gemini API');
  }

  try {
    return JSON.parse(rawText) as ChatApiResponse;
  } catch {
    return {
      reply: rawText,
      sources: [],
    };
  }
}
