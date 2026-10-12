// API Route Handler: /api/chat
// Mendukung SumoPod (OpenAI-compatible) & Google Gemini API
// Mendukung payload teks + gambar (Base64) Multimodal Vision
// Otomatis fallback ke mock data jika API Key belum diisi

import { NextRequest, NextResponse } from 'next/server';
import { getAiProviderStatus, getGeminiApiKey, getSumopodApiKey, type AiProviderMode } from '@/lib/ai-provider';
import { getMockChatResponse } from '@/lib/mock-data';
import { ChatApiRequest, ChatApiResponse } from '@/lib/types';
import { similaritySearch, listDocuments } from '@/lib/vectorStore';

const SYSTEM_PROMPT = `Anda adalah Asisten AI Kaji Kitab & Turats, seorang khadim keilmuan Islam dan peneliti turats klasik (kitab kuning). Anda mengemban amanah ilmiah: wajib jujur, teliti, dan TIDAK BOLEH MEMALSUKAN atau MENCATUT isi kitab.

PRINSIP UTAMA: INTEGRITAS ILMIAH & ANTI-HALUSINASI (SANGAT KETAT)
1. DILARANG KERAS MENCATUT ISI KITAB (ZERO FALSE ATTRIBUTION):
   - JANGAN PERNAH mengarang kalimat seolah-olah isi kitab tertentu (misal: "Dalam kitab Fathul Mu'in dijelaskan bahwa akal adalah alat memahami syariat..."). Ini adalah KEBOHONGAN ILMIAH yang merusak kredibilitas!
   - Kitab fiqih matan/syarah (seperti Fathul Mu'in, Safinatun Najah, Fathul Qarib) fokus pada teknis hukum (syarat sah, rukun, pembatal), BUKAN uraian esai filsafat atau logika bebas.
   - Jika pengguna bertanya tentang "Kenapa berakal / hikmah / alasan syariat":
     * Jelaskan bahwa "Berakal" adalah SYARAT TAKLIF (beban syariat), berlandaskan hadits Nabi ﷺ: «رُفِعَ الْقَلَمُ عَنْ ثَلَاثٍ: ... وَعَنِ الْمَجْنُونِ حَتَّى يَعْقِلَ» (HR. Abu Dawud, Ahmad, dll).
     * Dalam fiqih ibadah teknis, orang tidak berakal tidak sah wudhunya karena tidak memenuhi syarat TAMYIZ dan tidak sah NIAT-nya.
     * Rujuklah hadits tersebut atau kitab ushul/kaidah fiqih, JANGAN mencatut kitab fiqih praktis dengan narasi buatan sendiri.

2. PENEMPATAN DISIPLIN RUJUKAN SECARA TEPAT:
   - Fiqih Teknis (Rukun, Syarat Sah, Pembatal, Tata Cara): Safinatun Najah (Syaikh Salim bin Sumair), Fathul Qarib (Ibnu Qasim al-Ghazi), Fathul Mu'in (Syaikh Zainuddin al-Malibari), Minhajuth Thalibin (Imam An-Nawawi).
   - Dalil & Hadits Nabi: Riyadhus Shalihin, Bulughul Maram, Shahih Bukhari, Shahih Muslim, Sunan Abi Dawud.
   - Hikmah Ibadah, Adab Hati, & Tasawuf: Ihya' Ulumiddin, Bidayatul Hidayah (Imam Al-Ghazali), Ta'limul Muta'allim (Syaikh Az-Zarnuji).
   - RAG / Dokumen Upload: Jika pertanyaan berkaitan dengan dokumen yang diunggah pengguna ke Knowledge Base, jadikan dokumen tersebut rujukan utama dan sebutkan nama filenya dengan tepat.

3. PEDOMAN GAYA BAHASA:
   - Bertutur santun, mengalir, runtut, dan jelas layaknya seorang ustadz menerangkan kepada santrinya.
   - Bedakan dengan tegas: mana yang merupakan NASH/TEKS KITAB, mana yang merupakan DALIL HADITS, dan mana yang merupakan PENJELASAN HIKMAH UMUM.
   - Tidak perlu menyebutkan nomor halaman (cukup sebutkan Nama Kitab, Pengarang, dan Bab/Fasal/Materi spesifik).
   - Cantumkan teks Arab matan/ayat/hadits berharakat di properti "arabicText".

4. MULTIMODAL VISION OCR NASKAH KITAB (JIKA MENERIMA GAMBAR / FOTO LEMBARAN KITAB):
   - Transkripsikan teks Arab matan/ibarat kitab yang terbaca pada gambar ke properti "arabicText" secara lengkap dan berharakat rapi.
   - Set "isOcr": true pada JSON output.
   - Pada "reply", berikan ulasan komprehensif:
     * Makna & Terjemah ibarat kitab.
     * Syarah & Uraian Fiqih / Nahwu / Adab dari ibarat tersebut.
   - Pada "sources", sebutkan identifikasi nama kitab atau bab materi yang dibahas.

FORMAT OUTPUT JSON (Wajib JSON murni yang valid tanpa teks pembuka/penutup):
{
  "reply": "Penjelasan mendalam, jujur, mengalir, dan bernas. Bedakan antara hukum fiqih, dalil hadits, dan hikmah.",
  "arabicText": "Teks Arab matan/hadits/ayat yang relevan berharakat (kosongkan jika tidak ada)",
  "sources": [
    {
      "kitabName": "Nama Kitab / Kitab Hadits lengkap beserta Penulis/Perawi",
      "bab": "Bab/Fasal pembahasan yang benar-benar memuat materi tersebut"
    }
  ],
  "isOcr": false
}`;

export async function POST(request: NextRequest) {
  try {
    const body: ChatApiRequest = await request.json();
    const { message, image, conversationHistory } = body;

    if (!message && !image) {
      return NextResponse.json(
        { error: 'Pesan atau gambar diperlukan.' },
        { status: 400 }
      );
    }

    const sumopodApiKey = getSumopodApiKey();
    const geminiApiKey = getGeminiApiKey();

    // Dapatkan daftar dokumen yang sudah diunggah ke Knowledge Base
    let uploadedDocsInfo = "Daftar dokumen di Knowledge Base saat ini: Kosong.";
    try {
      const docs = listDocuments();
      if (docs.length > 0) {
        uploadedDocsInfo = "Daftar dokumen di Knowledge Base saat ini: " + docs.map(d => `"${d.docName}" (${d.chunkCount} chunk)`).join(', ') + ".";
      }
    } catch (e) {
      console.error("Gagal meload daftar dokumen", e);
    }

    // Ambil konteks relevan dari Knowledge Base RAG (jika ada)
    let ragContext = '\n\n=== INFORMASI KNOWLEDGE BASE ===\n' + uploadedDocsInfo + '\n';
    if (message && message.trim().length > 3) {
      try {
        const ragChunks = await similaritySearch(message, 4);
        if (ragChunks.length > 0) {
          ragContext += '\n=== KONTEKS DARI KITAB YANG TELAH DIUPLOAD (GUNAKAN INI SEBAGAI RUJUKAN UTAMA JIKA RELEVAN) ===\n' +
            ragChunks.join('\n\n---\n\n') +
            '\n=== AKHIR KONTEKS KITAB ===\n';
        }
      } catch {
        // Jika RAG gagal, tetap lanjut
      }
    }

    // 1. Prioritaskan SumoPod jika API Key SumoPod tersedia
    if (sumopodApiKey) {
      try {
        const response = await callSumoPodApi(sumopodApiKey, message, image, conversationHistory, ragContext);
        return withProviderStatus(response, 'sumopod');
      } catch (sumoError) {
        console.error('SumoPod API error, mencoba fallback:', sumoError);
      }
    }

    // 2. Gunakan Google Gemini jika GEMINI_API_KEY tersedia
    if (geminiApiKey && geminiApiKey.trim() !== '') {
      try {
        const response = await callGeminiApi(geminiApiKey, message, image, conversationHistory, ragContext);
        return withProviderStatus(response, 'gemini');
      } catch (geminiError) {
        console.error('Gemini API error, mencoba fallback:', geminiError);
      }
    }

    // 3. Mock Fallback (Jika API key belum diisi atau kedua API gagal)
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));
    const mockResponse = getMockChatResponse(message || '', !!image);
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
  ragContext = ''
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
    for (const item of conversationHistory.slice(-4)) {
      messages.push({
        role: item.role === 'assistant' ? 'assistant' : 'user',
        content: item.content
      });
    }
  }

  if (image) {
    const ocrInstruction = message && message.trim()
      ? `Instruksi pengguna: "${message}"\nTolong transkripsikan teks Arab pada foto naskah kitab ini secara akurat (lengkap dengan harakat pada arabicText), berikan terjemahan dan syarah penjelasannya secara mendalam, serta sebutkan rujukan kitab atau bab pembahasannya.`
      : 'Tolong transkripsikan teks Arab pada foto naskah kitab ini secara akurat (lengkap dengan harakat pada arabicText), berikan terjemahan dan syarah penjelasannya secara mendalam, serta sebutkan rujukan kitab atau bab pembahasannya.';

    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: ocrInstruction },
        { type: 'image_url', image_url: { url: image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}` } }
      ]
    });
  } else {
    const enrichedMessage = ragContext
      ? (ragContext + '\n\nPertanyaan pengguna: ' + (message || 'Mohon penjelasan materi kitab turats terkait.'))
      : (message || 'Mohon penjelasan materi kitab turats terkait.');
    messages.push({
      role: 'user',
      content: enrichedMessage
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
  ragContext = ''
): Promise<ChatApiResponse> {
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  if (conversationHistory && conversationHistory.length > 0) {
    const contextText = conversationHistory
      .slice(-4)
      .map(m => `${m.role === 'user' ? 'Pengguna' : 'Asisten'}: ${m.content}`)
      .join('\n');
    parts.push({ text: `Konteks percakapan sebelumnya:\n${contextText}\n\n` });
  }

  const enrichedGemMessage = ragContext
    ? (ragContext + '\n\nPertanyaan pengguna: ' + (message || 'Tolong analisis dan transkripsi gambar halaman kitab ini.'))
    : (message || 'Tolong analisis dan transkripsi gambar halaman kitab ini.');
  parts.push({ text: enrichedGemMessage });

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
