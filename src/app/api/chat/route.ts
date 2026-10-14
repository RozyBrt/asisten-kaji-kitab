// API Route Handler: /api/chat
// Khusus Bidang Ilmu Nahwu & Naskah Intisari Kitab Al-Kawakib Ad-Durriyyah (284 Halaman)
// Mendukung SumoPod (OpenAI-compatible) & Google Gemini API
// Mendukung payload teks + gambar (Base64) Multimodal Vision
// Otomatis fallback ke mock data jika API Key belum diisi

import { NextRequest, NextResponse } from 'next/server';
import { getAiProviderStatus, getGeminiApiKey, getSumopodApiKey, type AiProviderMode } from '@/lib/ai-provider';
import { getMockChatResponse } from '@/lib/mock-data';
import { ChatApiRequest, ChatApiResponse, KitabSource } from '@/lib/types';
import { similaritySearch, searchKawakibChunks, type KawakibChunk } from '@/lib/vectorStore';

const SYSTEM_PROMPT = `Anda adalah Asisten AI Kaji Kitab & Turats khusus bidang ilmu Nahwu & Gramatika Arab Klasik, seorang khadim keilmuan Islam di Dayah Perbatasan Minhajussalam.
Rujukan primer dan utama Anda adalah naskah resmi:
"INTISARI KITAB AL-KAWAKIB AL-DURRIYYAH SYARAH MUTAMMIMAH AL-JURUMIYYAH" (284 Halaman, Penerbit CV. Manhaji).

PRINSIP UTAMA: INTEGRITAS ILMIAH & ANTI-HALUSINASI (SANGAT KETAT)
1. DILARANG KERAS MENCATUT ISI KITAB (ZERO FALSE ATTRIBUTION):
   - JANGAN PERNAH mengarang kaidah nahwu atau menyandarkan kalimat buatan sendiri seolah-olah isi kitab!
   - Jawaban Anda harus bersumber dari naskah Al-Kawakib Ad-Durriyyah dan kaidah nahwu mu'tamad (seperti Bab Kalam, I'rab, Tanda Rofa', Fa'il, Na'ibul Fa'il, Mubtada Khabar, Amil Nawasikh Kaana/Inna, Isim Ghairu Munsharif, Tamyiz, Hal, Maf'ul Bih, dll).
   - PERHATIAN PENTING TENTANG CAKUPAN NAHWU:
     Seluruh materi gramatika Arab seperti Isim Dhamir/Dzamir, Isim Isyarah, Isim Maushul, Kalam, I'rab, Fa'il, Na'ibul Fa'il, Mubtada Khabar, Nawasikh, Manshubat, Mahfuzhat, Tawabi', dll ADALAH INTI DARI ILMU NAHWU dan termaktub dalam naskah Al-Kawakib!
     JANGAN PERNAH menolak pertanyaan tentang topik nahwu tersebut! Berikan syarah dan penjelasan mendalam.
     Penolakan santun HANYA berlaku jika pengguna bertanya tentang fiqih murni (seperti tata cara shalat, zakat, puasa, haji), akidah/tasawuf, atau pertanyaan di luar bahasa Arab.

2. PENYAJIAN SITASI DAN RUJUKAN HALAMAN PRESISI:
   - Pada setiap jawaban (kecuali sapaan chit-chat pendek), Anda WAJIB mengisi array "sources" dengan rujukan ke naskah Al-Kawakib:
     * "kitabName": "Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah"
     * "bab": Nama Bab/Fasal spesifik (misal: "Bab Tentang Pembahasan Kalam", "Fasal Kaana dan Saudaranya", dll).
     * "halaman": Format "Hal. X (PDF Hal. Y)". Contoh: "Hal. 1 (PDF Hal. 13)" jika materi ada di halaman 1 kitab / halaman 13 PDF.
     * "pdfPage": Angka nomor halaman PDF (integer, misal 13).
     * "pdfUrl": URL halaman PDF, format: "/api/pdf#page=Y" (misal: "/baca?page=13").
   - KONSISTENSI RUJUKAN NASKAH (SANGAT KRUSIAL):
     * Setiap kali diberikan bagian "KONTEKS NASKAH KITAB AL-KAWAKIB AL-DURRIYYAH", perhatikan penanda header di awal tiap potongan:
       [Kitab: Intisari Al-Kawakib Al-Durriyyah Syarah Mutammimah | Bab: <NAMA_BAB> | Hal. Kitab: <NOMOR_KITAB> | Hal. PDF: <NOMOR_PDF>]
     * Anda WAJIB mengambil nomor halaman dan nama bab PERSIS dari penanda potongan tersebut untuk mengisi properti "sources" ("halaman", "pdfPage", "pdfUrl", "bab").
     * CONTOH: Jika potongan naskah memuat [Hal. Kitab: 53 | Hal. PDF: 65], maka Anda WAJIB mengisi:
       "halaman": "Hal. 53 (PDF Hal. 65)",
       "pdfPage": 65,
       "pdfUrl": "/api/pdf#page=65"
     * Pada properti "arabicText", kutip teks matan Arab asli yang tercantum di dalam naskah tersebut (contoh untuk Bab Fa'il: الْفَاعِلُ هُوَ: الْاِسْمُ الْمَرْفُوعُ الْمَذْكُورُ قَبْلَهُ فِعْلُهُ أَوْ مَا فِي تَأْوِيلِ الْفِعْلِ) lengkap dengan harakat.
     * JANGAN PERNAH menyandarkan rujukan ke Hal. 1 / PDF Hal. 13 jika potongan materi membahas bab lain (seperti Bab Fa'il, Bab Munada, Bab Nawasikh, dll)!

3. KELENGKAPAN & KETEPATAN TEKS MATAN ARAB (MUTLAK LENGKAP):
   - Ketika mengisi properti "arabicText", Anda WAJIB mengutip matan Arab secara LENGKAP, UTUH, dan BERHARAKAT PENUH persis sesuai naskah Al-Kawakib / Mutammimah.
   - JANGAN PERNAH memotong atau menghilangkan rukun/kata dalam definisi matan!
     * CONTOH Maf'ul Muthlaq: Matan lengkapnya adalah:
       "اَلْمَفْعُولُ الْمُطْلَقُ هُوَ : اَلْمَصْدَرُ الْفَضْلَةُ الْمُؤَكِّدُ لِعَامِلِهِ أَوْ الْمُبَيِّنُ لِنَوْعِهِ أَوْ عَدَدِهِ ."
       (DILARANG KERAS membuang kata "الْفَضْلَةُ" dan frasa "أَوْ الْمُبَيِّنُ لِنَوْعِهِ"!).
     * CONTOH Fa'il: "اَلْفَاعِلُ هُوَ: الْاِسْمُ الْمَرْفُوعُ الْمَذْكُورُ قَبْلَهُ فِعْلُهُ أَوْ مَا فِي تَأْوِيلِ الْفِعْلِ"
     * CONTOH Na'ibul Fa'il: "اَلْمَفْعُولُ الَّذِي لَمْ يُسَمَّ فَاعِلُهُ هُوَ: الْاِسْمُ الْمَرْفُوعُ الَّذِي لَمْ يُذْكَرْ مَعَهُ فَاعِلُهُ"
     * CONTOH Mustatsna: "اَلْمُسْتَثْنَى هُوَ: الْاِسْمُ الْمَنْصُوبُ الْوَاقِعُ بَعْدَ إِلَّا أَوْ إِحْدَى أَخَوَاتِهَا مُخَالِفًا لِمَا قَبْلَهَا"
   - Di properti "reply", uraikan secara sistematis seluruh rukun tersebut (misalnya untuk Maf'ul Muthlaq: jelaskan ketiga fungsinya yaitu penguat amil [taukidi], penjelas macam amil [naw'i], dan penjelas bilangan ['adadi], serta dua ragam lafazhnya yaitu lafzhi dan ma'nawi).

4. PEDOMAN GAYA BAHASA:
   - Bertutur santun, runtut, mengalir, dan bernas layaknya seorang guru nahwu/ustadz menerangkan kepada santrinya.
   - Cantumkan teks Arab matan/kaidah berharakat rapi di properti "arabicText".

5. MULTIMODAL VISION OCR NASKAH KITAB:
   - Jika menerima foto lembaran kitab naskah, transkripsikan teks Arab matan yang terbaca secara berharakat ke properti "arabicText", berikan syarah kaidah nahwunya, set "isOcr": true, dan sebutkan bab rujukan Al-Kawakib yang bersesuaian.

6. RESPON TERHADAP CHIT-CHAT & PERTANYAAN LANJUTAN:
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
      "pdfUrl": "/baca?page=13"
    }
  ],
  "isOcr": false
}`;

// Deteksi ungkapan singkat / chit-chat / salam / terima kasih yang tidak memerlukan pencarian korpus
function isChitChatMessage(text: string): boolean {
  if (!text) return false;
  const clean = text.trim().toLowerCase().replace(/[.,!?;:()_\-]/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Kata-kata sopan santun / chit-chat pesantren
  const chitChatTokens = new Set([
    'oke', 'ok', 'baik', 'baiklah', 'sip', 'siap', 'terima', 'kasih', 'terimakasih',
    'makasih', 'ya', 'banyak', 'nuhun', 'matur', 'nuwun', 'syukron', 'syukran',
    'jazakallah', 'khair', 'khairan', 'jazakallahu', 'barakallah', 'fiik', 'alhamdulillah',
    'paham', 'mengerti', 'jelas', 'halo', 'hai', 'assalamualaikum', 'assalamu', 'alaikum',
    'waalaikumsalam', 'salam', 'sama', 'afwan', 'ustadz', 'ustad', 'kaji', 'kitab'
  ]);

  const words = clean.split(' ').filter(w => w.length > 0);
  if (words.length > 0 && words.every(w => chitChatTokens.has(w))) {
    return true;
  }

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
    /^(tolong\s+)?(berikan|mana|minta|tampilkan|ada)?\s*(rujukan|rujukannya|referensi|referensinya|halamannya|halaman)\s*$/i,
    /^(tolong\s+)?(di\s+)?halaman\s+berapa(\s+itu|\s+ini|\s+ya)?\s*$/i,
    /^(bisa\s+)?(kasih|minta|tampilkan)\s+rujukan(nya)?\s*$/i,
  ];
  return followUpPatterns.some(pattern => pattern.test(clean));
}

// Ekstrak topik bahasan sebelumnya dari riwayat percakapan untuk pertanyaan lanjutan
function getFollowUpContext(conversationHistory?: { role: string; content: string }[]): string {
  if (!conversationHistory || conversationHistory.length === 0) return '';
  for (let i = conversationHistory.length - 1; i >= 0; i--) {
    const item = conversationHistory[i];
    if (item.content && item.content.length > 15) {
      // Ambil penggalan kalimat awal dari jawaban asisten sebelumnya
      return item.content.slice(0, 300);
    }
  }
  return '';
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
      pdfUrl: `/baca?page=${finalPdfPage}`,
    };
  });
}


// Kamus Matan Muktamad Naskah Al-Kawakib / Mutammimah Al-Jurumiyyah
// Mencegah distorsi/halusinasi lafazh Arab akibat fragmentasi karakter bidi RTL pada PDF
const CANONICAL_MATANS: Array<{ keywords: string[]; matan: string }> = [
  {
    keywords: ['dzamir', 'dhamir', 'dhomir', 'mudhmar'],
    matan: 'اَلْمُضْمَرُ هُوَ : اَلِاسْمُ لِمَا وُضِعَ لِمُتَكَلِّمٍ أَوْ مُخَاطَبٍ أَوْ غَائِبٍ .',
  },
  {
    keywords: ['isyarah'],
    matan: 'اِسْمُ الْإِشَارَةِ هُوَ : مَا وُضِعَ لِمُشَارٍ إِلَيْهِ حِسِّيٍّ أَوْ مَعْنَوِيٍّ .',
  },
  {
    keywords: ['maushul', 'mausul'],
    matan: 'اَلِاسْمُ الْمَوْصُولُ هُوَ : مَا لَا يَتِمُّ جُزْؤُهُ إِلَّا بِصِلَةٍ وَعَائِدٍ .',
  },
  {
    keywords: ['badal'],
    matan: 'اَلْبَدَلُ هُوَ : اَلتَّابِعُ الْمَقْصُودُ بِالْحُكْمِ بِلَا وَاسِطَةٍ .',
  },
  {
    keywords: ['muthlaq', 'mashdar'],
    matan: 'اَلْمَفْعُولُ الْمُطْلَقُ هُوَ : اَلْمَصْدَرُ الْفَضْلَةُ الْمُؤَكِّدُ لِعَامِلِهِ أَوْ الْمُبَيِّنُ لِنَوْعِهِ أَوْ عَدَدِهِ .',
  },
  {
    keywords: ['fail', "fa'il"],
    matan: 'اَلْفَاعِلُ هُوَ : اَلِاسْمُ الْمَرْفُوعُ الْمَذْكُورُ قَبْلَهُ فِعْلُهُ أَوْ مَا فِي تَأْوِيلِ الْفِعْلِ .',
  },
  {
    keywords: ['naib', "na'ib", 'naibul fail', "na'ibul fa'il"],
    matan: 'اَلْمَفْعُولُ الَّذِي لَمْ يُسَمَّ فَاعِلُهُ هُوَ : اَلِاسْمُ الْمَرْفُوعُ الَّذِي لَمْ يُذْكَرْ مَعَهُ فَاعِلُهُ .',
  },
  {
    keywords: ['mubtada', 'khabar'],
    matan: 'اَلْمُبْتَدَأُ هُوَ : اَلِاسْمُ الْمَرْفُوعُ الْعَارِي عَنِ الْعَوَامِلِ اللَّفْظِيَّةِ ، وَالْخَبَرُ هُوَ : اَلِاسْمُ الْمَرْفُوعُ الْمُسْنَدُ إِلَيْهِ .',
  },
  {
    keywords: ['mustatsna', 'mustatna', 'istitsna'],
    matan: 'اَلْمُسْتَثْنَى هُوَ : اَلِاسْمُ الْمَنْصُوبُ الْوَاقِعُ بَعْدَ إِلَّا أَوْ إِحْدَى أَخَوَاتِهَا مُخَالِفًا لِمَا قَبْلَهَا .',
  },
  {
    keywords: ['munada', 'nida'],
    matan: 'اَلْمُنَادَى هُوَ : الْمَطْلُوبُ إِقْبَالُهُ بِـ يَا أَوْ إِحْدَى أَخَوَاتِهَا .',
  },
  {
    keywords: ['tamyiz'],
    matan: 'اَلتَّمْيِيزُ هُوَ : اَلِاسْمُ الْمَنْصُوبُ الْمُفَسِّرُ لِمَا انْبَهَمَ مِنَ الذَّوَاتِ أَوِ النِّسَبِ .',
  },
  {
    keywords: ['hal', 'haal'],
    matan: 'اَلْحَالُ هُوَ : اَلِاسْمُ الْمَنْصُوبُ الْمُفَسِّرُ لِمَا انْبَهَمَ مِنَ الْهَيْئَاتِ .',
  },
  {
    keywords: ['kalam'],
    matan: 'اَلْكَلَامُ هُوَ : اللَّفْظُ الْمُرَكَّبُ الْمُفِيدُ بِالْوَضْعِ ، وَأَقْسَامُهُ ثَلَاثَةٌ : اسْمٌ ، وَفِعْلٌ ، وَحَرْفٌ جَاءَ لِمَعْنًى .',
  },
  {
    keywords: ['irab', "i'rab"],
    matan: 'اَلْإِعْرَابُ هُوَ : تَغْيِيرُ أَوَاخِرِ الْكَلِمِ لِاخْتِلَافِ الْعَوَامِلِ الدَّاخِلَةِ عَلَيْهَا لَفْظًا أَوْ تَقْدِيرًا .',
  },
  {
    keywords: ['maful bih', 'bih'],
    matan: 'اَلْمَفْعُولُ بِهِ هُوَ : اَلِاسْمُ الْمَنْصُوبُ الَّذِي يَقَعُ بِهِ الْفِعْلُ .',
  },
  {
    keywords: ['zharaf', 'dzaraf', 'maful fih'],
    matan: 'ظَرْفُ الزَّمَانِ هُوَ اسْمُ الزَّمَانِ الْمَنْصُوبُ بِتَقْدِيرِ فِي ، وَظَرْفُ الْمَكَانِ هُوَ اسْمُ الْمَكَانِ الْمَنْصُوبُ بِتَقْدِيرِ فِي .',
  },
  {
    keywords: ['liajlih', 'li ajlih'],
    matan: 'اَلْمَفْعُولُ لِأَجْلِهِ هُوَ : اَلِاسْمُ الْمَنْصُوبُ الَّذِي يُذْكَرُ بَيَانًا لِسَبَبِ وُقُوعِ الْفِعْلِ .',
  },
  {
    keywords: ['maah', "ma'ah"],
    matan: 'اَلْمَفْعُولُ مَعَهُ هُوَ : اَلِاسْمُ الْمَنْصُوبُ الْمَذْكُورُ لِبَيَانِ مَنْ فُعِلَ مَعَهُ الْفِعْلُ .',
  },
  {
    keywords: ['naat', "na'at", 'sifat'],
    matan: 'اَلنَّعْتُ هُوَ : اَلتَّابِعُ الْمُشْتَقُّ أَوِ الْمُؤَوَّلُ بِالْمُشْتَقِّ الْمُوَضِّحُ لِمَتْبُوعِهِ فِي الْمَعَارِفِ وَالْمُخَصِّصُ لَهُ فِي النَّكِرَاتِ .',
  },
  {
    keywords: ['taukid'],
    matan: 'اَلتَّوْكِيدُ هُوَ : اَلتَّابِعُ لِلْمُؤَكَّدِ فِي رَفْعِهِ وَنَصْبِهِ وَخَفْضِهِ وَتَعْرِيفِهِ .',
  },
  {
    keywords: ['athaf', "'athaf"],
    matan: 'حُرُوفُ الْعَطْفِ عَشَرَةٌ ، وَهِيَ : الْوَاوُ ، وَالْفَاءُ ، وَثُمَّ ، وَأَوْ ، وَأَمْ ، وَإِمَّا ، وَبَلْ ، وَلَا ، وَلَكِنْ ، وَحَتَّى فِي بَعْضِ الْمَوَاضِعِ .',
  },
  {
    keywords: ['sharaf', 'munsharif', 'ghairu munsharif'],
    matan: 'اَلْمَمْنُوعُ مِنَ الصَّرْفِ هُوَ : مَا فِيهِ عِلَّتَانِ فَرْعِيَّتَانِ مِنْ تِسْعِ عِلَلٍ أَوْ وَاحِدَةٌ تَقُومُ مَقَامَهُمَا .',
  },
];

function findCanonicalMatan(query: string, bab: string): string | null {
  const text = (query + ' ' + bab).toLowerCase().replace(/['\u2019\u2018`]/g, '');
  for (const item of CANONICAL_MATANS) {
    for (const kw of item.keywords) {
      const cleanKw = kw.replace(/['\u2019\u2018`]/g, '');
      const re = new RegExp('\\b' + cleanKw + '\\b', 'i');
      if (re.test(text)) {
        return item.matan;
      }
    }
  }
  return null;
}


// Pencocokan otomatis rujukan naskah untuk hasil foto OCR kitab Al-Kawakib
async function matchImageToKawakib(response: ChatApiResponse): Promise<KitabSource[]> {
  const textToScan = `${response.arabicText || ''} ${response.reply.slice(0, 350)}`;
  const chunks = await searchKawakibChunks(textToScan, 3);
  
  if (chunks.length > 0) {
    const top = chunks[0];
    // Hindari salah tangkap ke Daftar Isi kecuali naskah memang foto daftar isi
    if (top.bab.includes('Daftar Isi') && !textToScan.toLowerCase().includes('daftar isi')) {
      return [];
    }

    const babWords = top.bab.toLowerCase().split(/[\s,()]+/).filter(w => w.length >= 3 && !['bab', 'tentang', 'fasal', 'dan', 'dari'].includes(w));
    const hasBabMatch = babWords.some(kw => textToScan.toLowerCase().includes(kw));

    if (hasBabMatch) {
      return [{
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: top.bab,
        halaman: `Hal. ${top.bookPage} (PDF Hal. ${top.pdfPage})`,
        pdfPage: top.pdfPage,
        pdfUrl: `/baca?page=${top.pdfPage}`,
      }];
    }
  }
  return [];
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

    // Ambil konteks relevan dari Korpus Al-Kawakib
    let ragContext = '';
    let matchedChunks: KawakibChunk[] = [];
    const searchQuery = isFollowUp 
      ? getFollowUpContext(conversationHistory)
      : (message || '');

    if (!image && !isChitChat && searchQuery && searchQuery.trim().length > 2) {
      try {
        matchedChunks = await searchKawakibChunks(searchQuery, 4);
        if (matchedChunks.length > 0) {
          const canonicalMatan = findCanonicalMatan(message, matchedChunks[0]?.bab || '');
          const matanNotice = canonicalMatan
            ? `\n=== TEKS MATAN ASLI MUKTAMAD (WAJIB SALIN PERSIS DI PROPERTI "arabicText" TANPA MENGURANGI/MENAMBAH KATA): ===\n${canonicalMatan}\n\n`
            : '';

          ragContext = '\n=== KONTEKS NASKAH KITAB AL-KAWAKIB AL-DURRIYYAH (284 HALAMAN) ===\n' +
            matanNotice +
            matchedChunks.map(c => c.text).join('\n\n---\n\n') +
            '\n=== AKHIR KONTEKS NASKAH ===\n';
        }
      } catch (e) {
        console.error("RAG search failed:", e);
      }
    }

    // Helper untuk mengikat sitasi terverifikasi dari chunk naskah langsung (mencegah halusinasi nomor halaman AI)
    const bindVerifiedSources = (rawSources: any[]): KitabSource[] => {
      if (matchedChunks.length > 0) {
        const seenPages = new Set<number>();
        const uniqueChunks = matchedChunks.filter(c => {
          if (seenPages.has(c.pdfPage)) return false;
          seenPages.add(c.pdfPage);
          return true;
        });

        return uniqueChunks.slice(0, 3).map(c => ({
          kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
          bab: c.bab,
          halaman: `Hal. ${c.bookPage} (PDF Hal. ${c.pdfPage})`,
          pdfPage: c.pdfPage,
          pdfUrl: `/baca?page=${c.pdfPage}`,
        }));
      }
      // Jika pertanyaan atau naskah foto BUKAN bagian dari Al-Kawakib (misalnya kitab luar seperti 'Uqud al-Lujjain),
      // jangan tampilkan rujukan palsu ke Hal. 1 Al-Kawakib! Kembalikan array kosong ([]).
      return [];
    };

    // 1. Prioritaskan SumoPod jika API Key SumoPod tersedia
    if (sumopodApiKey) {
      try {
        const response = await callSumoPodApi(sumopodApiKey, message, image, conversationHistory, ragContext, isChitChat);
        if (isChitChat) {
          response.sources = [];
          response.arabicText = '';
        } else {
          response.sources = bindVerifiedSources(response.sources || []);
          if (image && response.sources.length === 0) {
            response.sources = await matchImageToKawakib(response);
          }
        }
        return withProviderStatus(response, 'sumopod');
      } catch (sumoError) {
        console.error('SumoPod API error, mencoba fallback:', sumoError);
      }
    }

    // 2. Gunakan Google Gemini jika GEMINI_API_KEY tersedia
    if (geminiApiKey && geminiApiKey.trim() !== '') {
      try {
        const response = await callGeminiApi(geminiApiKey, message, image, conversationHistory, ragContext, isChitChat);
        if (isChitChat) {
          response.sources = [];
          response.arabicText = '';
        } else {
          response.sources = bindVerifiedSources(response.sources || []);
          if (image && response.sources.length === 0) {
            response.sources = await matchImageToKawakib(response);
          }
        }
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

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  }
  return cleaned;
}

function safeParseApiResponse(rawText: string): ChatApiResponse {
  if (!rawText || !rawText.trim()) {
    return { reply: 'Maaf, tidak ada respons yang dihasilkan.', sources: [] };
  }

  const cleaned = cleanJsonString(rawText);

  // 1. Coba parse JSON murni
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed && typeof parsed === 'object') {
      const reply = typeof parsed.reply === 'string' ? parsed.reply : '';
      if (reply) {
        return {
          reply,
          arabicText: typeof parsed.arabicText === 'string' ? parsed.arabicText : undefined,
          sources: Array.isArray(parsed.sources) ? parsed.sources : [],
          isOcr: Boolean(parsed.isOcr),
        };
      }
    }
  } catch {
    // Abaikan error dan gunakan pemulihan cerdas di bawah
  }

  // 2. Pemulihan Cerdas jika JSON terpotong / malformed
  let extractedReply = '';
  let extractedArabic = '';

  const replyMatch = cleaned.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (replyMatch) {
    try {
      extractedReply = JSON.parse(`"${replyMatch[1]}"`);
    } catch {
      extractedReply = replyMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\r/g, '');
    }
  } else {
    // Jika terpotong di tengah sebelum kutip penutup
    const cutMatch = cleaned.match(/"reply"\s*:\s*"([\s\S]*)/);
    if (cutMatch) {
      let cut = cutMatch[1];
      cut = cut.replace(/"\s*,?\s*"arabicText"[\s\S]*$/, '')
               .replace(/"\s*,?\s*"sources"[\s\S]*$/, '')
               .replace(/"\s*\}?\s*$/, '');
      extractedReply = cut
        .replace(/\\n/g, '\n')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\r/g, '');
    }
  }

  const arabicMatch = cleaned.match(/"arabicText"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (arabicMatch) {
    try {
      extractedArabic = JSON.parse(`"${arabicMatch[1]}"`);
    } catch {
      extractedArabic = arabicMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
    }
  }

  if (extractedReply.trim()) {
    return {
      reply: extractedReply.trim(),
      arabicText: extractedArabic.trim() || undefined,
      sources: [],
      isOcr: true,
    };
  }

  // 3. Fallback pembersihan string mentah jika diawali { "reply"
  const fallback = cleaned
    .replace(/^\{?\s*"reply"\s*:\s*"?/, '')
    .replace(/"?\s*,?\s*"arabicText"[\s\S]*$/, '')
    .replace(/"?\s*,?\s*"sources"[\s\S]*$/, '')
    .replace(/"?\s*\}?\s*$/, '')
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"');

  return {
    reply: fallback.trim() || cleaned,
    sources: [],
  };
}

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
      max_tokens: 4000
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

  return safeParseApiResponse(rawContent);
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
      maxOutputTokens: 4000,
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

  return safeParseApiResponse(rawText);
}
