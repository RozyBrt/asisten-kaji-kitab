// API Route Handler: /api/chat
// Supports text + multimodal image (Base64) payloads
// Falls back to mock responses when GEMINI_API_KEY is not set

import { NextRequest, NextResponse } from 'next/server';
import { getMockChatResponse } from '@/lib/mock-data';
import { ChatApiRequest, ChatApiResponse } from '@/lib/types';

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

    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is available, use Gemini
    if (apiKey) {
      try {
        const response = await callGeminiApi(apiKey, message, image, conversationHistory);
        return NextResponse.json(response);
      } catch (apiError) {
        console.error('Gemini API error, falling back to mock:', apiError);
        // Fall through to mock response
      }
    }

    // Mock / fallback response with simulated streaming delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    const mockResponse = getMockChatResponse(message || '', !!image);
    return NextResponse.json(mockResponse);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server. Silakan coba lagi.' },
      { status: 500 }
    );
  }
}

async function callGeminiApi(
  apiKey: string,
  message: string,
  image?: string,
  conversationHistory?: { role: string; content: string }[]
): Promise<ChatApiResponse> {
  const systemPrompt = `Anda adalah Asisten AI Kaji Kitab & Turats, sebuah asisten AI yang membantu mengkaji kitab-kitab turats (klasik Islam). 

Tugas Anda:
1. Menjawab pertanyaan tentang fiqih, aqidah, tasawuf, hadits, dan ilmu keislaman lainnya berdasarkan kitab-kitab turats.
2. Jika ada gambar halaman kitab yang diunggah, lakukan OCR/transkripsi teks Arab, lalu berikan penjelasan/syarah dalam Bahasa Indonesia.
3. Selalu sertakan rujukan sumber dari kitab yang relevan (nama kitab, bab, halaman jika tersedia).
4. Jawab dalam Bahasa Indonesia yang baik dan mudah dipahami.
5. Jika ada teks Arab, tampilkan dalam format yang jelas.

Format respons JSON:
{
  "reply": "Jawaban utama dalam Bahasa Indonesia (mendukung markdown)",
  "arabicText": "Teks Arab yang relevan (opsional)",
  "sources": [{"kitabName": "Nama Kitab", "bab": "Bab/Pasal", "halaman": "Nomor Halaman"}],
  "isOcr": false
}`;

  // Build the content parts
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];

  // Add conversation context
  if (conversationHistory && conversationHistory.length > 0) {
    const contextText = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(m => `${m.role === 'user' ? 'Pengguna' : 'Asisten'}: ${m.content}`)
      .join('\n');
    parts.push({ text: `Konteks percakapan sebelumnya:\n${contextText}\n\n` });
  }

  parts.push({ text: message || 'Tolong analisis dan transkripsi gambar halaman kitab ini.' });

  // Add image if present
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
    contents: [{
      parts,
    }],
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  };

  const modelName = image ? 'gemini-2.0-flash' : 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

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
    // If JSON parsing fails, return as plain text response
    return {
      reply: rawText,
      sources: [],
    };
  }
}
