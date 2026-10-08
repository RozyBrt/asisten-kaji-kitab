// Mock data and fallback responses for demonstration without API keys

import { ChatApiResponse, HafalanQuestion, UploadedDocument, KitabSource } from './types';

// ============================================================
// Mock Chat Responses
// ============================================================

const mockTextResponses: Record<string, ChatApiResponse> = {
  'syarat sah wudhu': {
    reply: `**Syarat Sah Wudhu** menurut mayoritas ulama ada 6 perkara:\n\n1. **Islam** — Wudhu tidak sah dari orang kafir.\n2. **Tamyiz** — Mampu membedakan baik dan buruk (mumayyiz).\n3. **Suci dari haid dan nifas** — Bagi wanita.\n4. **Menggunakan air suci dan menyucikan** (thahur) — Air yang belum berubah sifatnya.\n5. **Tidak ada penghalang** sampainya air ke kulit — Seperti cat kuku, lilin, dll.\n6. **Telah masuk waktu** bagi yang berhadas terus-menerus.\n\nDalil utama terdapat dalam **QS. Al-Ma'idah [5]: 6** yang menjelaskan tata cara wudhu secara lengkap.`,
    arabicText: `يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ`,
    sources: [
      { kitabName: 'Fathul Qarib', bab: 'Bab Wudhu', halaman: '12-14' },
      { kitabName: 'Safinatun Najah', bab: 'Syarat Wudhu', halaman: '8' },
      { kitabName: 'Fiqhus Sunnah', bab: 'Kitab Thaharah', halaman: '33-35' },
    ],
  },
  'adab menuntut ilmu': {
    reply: `**Adab Menuntut Ilmu** yang diajarkan para ulama salaf:\n\n1. **Niat ikhlas karena Allah** — Bukan untuk riya' atau mencari kedudukan.\n2. **Memuliakan guru** — Berdiri saat guru datang, tidak mendahuluinya, dan memperhatikan penjelasannya.\n3. **Sabar dan tekun** — Ilmu tidak didapat dalam satu malam.\n4. **Mengamalkan ilmu** — Ilmu tanpa amal bagaikan pohon tanpa buah.\n5. **Tawadhu' (rendah hati)** — Tidak sombong dengan ilmu yang dimiliki.\n6. **Menjaga waktu** — Memanfaatkan waktu sebaik-baiknya untuk belajar.\n7. **Mengulang-ulang pelajaran** (muraja'ah) — Agar ilmu tertancap kuat.\n\nImam Syafi'i rahimahullah berkata:\n*"Ilmu itu bukan yang dihafal, tapi yang memberi manfaat."*`,
    arabicText: `قَالَ الإِمَامُ الشَّافِعِيُّ رَحِمَهُ اللَّهُ: لَيْسَ العِلْمُ مَا حُفِظَ، العِلْمُ مَا نَفَعَ`,
    sources: [
      { kitabName: "Ta'limul Muta'allim", bab: "Bab Adab Thalib 'Ilm", halaman: '5-9' },
      { kitabName: 'Ihya Ulumiddin', bab: "Kitab Al-'Ilm", halaman: '45-48' },
    ],
  },
  'rukun shalat': {
    reply: `**Rukun Shalat** yang wajib dipenuhi ada **13 rukun** menurut mazhab Syafi'i:\n\n1. **Niat** di dalam hati bersamaan dengan takbiratul ihram.\n2. **Berdiri** bagi yang mampu (dalam shalat fardhu).\n3. **Takbiratul Ihram** — mengucapkan "Allahu Akbar".\n4. **Membaca Al-Fatihah** di setiap rakaat.\n5. **Ruku'** dengan thuma'ninah.\n6. **I'tidal** (bangkit dari ruku') dengan thuma'ninah.\n7. **Sujud dua kali** di setiap rakaat dengan thuma'ninah.\n8. **Duduk di antara dua sujud** dengan thuma'ninah.\n9. **Tasyahud akhir** (membaca tahiyyat).\n10. **Duduk saat tasyahud akhir**.\n11. **Membaca shalawat Nabi ﷺ** dalam tasyahud akhir.\n12. **Salam pertama** (Assalamu'alaikum warahmatullah).\n13. **Tertib** — melaksanakan rukun secara berurutan.\n\nMeninggalkan salah satu rukun menyebabkan shalat batal, baik sengaja maupun lupa.`,
    arabicText: `أَرْكَانُ الصَّلَاةِ ثَلَاثَةَ عَشَرَ: النِّيَّةُ وَالْقِيَامُ وَتَكْبِيرَةُ الْإِحْرَامِ`,
    sources: [
      { kitabName: 'Fathul Qarib', bab: 'Bab Arkanish Shalah', halaman: '22-25' },
      { kitabName: 'Safinatun Najah', bab: 'Bab Shalat', halaman: '14-15' },
      { kitabName: 'Minhajut Thalibin', bab: 'Kitab Shalat', halaman: '56' },
    ],
  },
};

const defaultMockResponse: ChatApiResponse = {
  reply: `Terima kasih atas pertanyaannya. Berikut penjelasan berdasarkan rujukan kitab-kitab turats yang relevan:\n\nPertanyaan Anda berkaitan dengan topik penting dalam kajian keislaman. Dalam kitab-kitab klasik, para ulama telah membahas topik ini secara mendalam dengan berbagai perspektif mazhab.\n\n**Poin-poin utama:**\n1. Topik ini dibahas dalam beberapa kitab induk fikih klasik.\n2. Para ulama sepakat tentang prinsip dasarnya, namun berbeda dalam detail penerapannya.\n3. Penting untuk merujuk langsung pada teks asli untuk pemahaman yang lebih komprehensif.\n\n*Catatan: Ini adalah respons demonstrasi (mock). Hubungkan dengan Google Gemini API untuk mendapatkan jawaban berbasis AI yang lebih kontekstual.*`,
  arabicText: `بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ - اَلْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ`,
  sources: [
    { kitabName: 'Fathul Qarib', bab: 'Bab Terkait', halaman: '—' },
    { kitabName: 'Ihya Ulumiddin', bab: 'Kitab Terkait', halaman: '—' },
  ],
};

const mockOcrResponse: ChatApiResponse = {
  reply: `**Hasil Analisis Halaman Kitab (OCR + AI):**\n\nGambar yang Anda unggah terdeteksi sebagai halaman dari kitab fiqih klasik. Berikut hasil transkripsi dan penjelasannya:\n\n**Ringkasan Isi:**\nHalaman ini membahas tentang bab thaharah (bersuci), khususnya mengenai syarat-syarat dan tata cara wudhu menurut pendapat mazhab Syafi'i. Teks matan menyebutkan bahwa wudhu memiliki enam fardhu (rukun) yang wajib dipenuhi.\n\n**Penjelasan (Syarah):**\n- Fardhu pertama adalah **niat** yang tempatnya di hati, bersamaan dengan membasuh wajah.\n- Fardhu kedua adalah **membasuh wajah** dari batas tumbuhnya rambut hingga bawah dagu, dan dari telinga ke telinga.\n- Fardhu ketiga adalah **membasuh kedua tangan hingga siku**.\n\n*Catatan: Hasil OCR ini merupakan mock/simulasi. Integrasikan Google Gemini Vision API untuk analisis gambar yang sesungguhnya.*`,
  arabicText: `فُرُوضُ الوُضُوءِ سِتَّةٌ: النِّيَّةُ عِنْدَ غَسْلِ الوَجْهِ، وَغَسْلُ الوَجْهِ، وَغَسْلُ اليَدَيْنِ مَعَ المِرْفَقَيْنِ، وَمَسْحُ بَعْضِ الرَّأْسِ، وَغَسْلُ الرِّجْلَيْنِ مَعَ الكَعْبَيْنِ، وَالتَّرْتِيبُ`,
  sources: [
    { kitabName: 'Fathul Qarib al-Mujib', bab: 'Bab Fardhu Wudhu', halaman: '10-11' },
    { kitabName: 'Safinatun Najah', bab: 'Fasal fi Furu\'dhil Wudhu\'', halaman: '7' },
  ],
  isOcr: true,
};

export function getMockChatResponse(message: string, hasImage: boolean): ChatApiResponse {
  if (hasImage) {
    return mockOcrResponse;
  }

  const lowerMessage = message.toLowerCase().trim();
  
  for (const [key, response] of Object.entries(mockTextResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  return defaultMockResponse;
}

// ============================================================
// Mock Hafalan Data
// ============================================================

export const mockHafalanQuestions: HafalanQuestion[] = [
  {
    id: 'q1',
    type: 'sambung-ayat',
    questionAr: 'بِسْمِ اللَّهِ الرَّحْمَنِ ...',
    questionId: 'Lanjutkan ayat dari Surah Al-Fatihah berikut:',
    options: ['الرَّحِيمِ', 'الْعَظِيمِ', 'الْكَرِيمِ', 'الْحَكِيمِ'],
    correctAnswer: 'الرَّحِيمِ',
    correctAnswerAr: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    surahName: 'Al-Fatihah',
    ayahRange: 'Ayat 1',
    explanation: 'Basmalah adalah pembuka Surah Al-Fatihah. Ar-Rahman dan Ar-Rahim keduanya berasal dari kata Rahmah (kasih sayang).',
  },
  {
    id: 'q2',
    type: 'sambung-ayat',
    questionAr: 'قُلْ هُوَ اللَّهُ ...',
    questionId: 'Lanjutkan ayat dari Surah Al-Ikhlas berikut:',
    options: ['أَحَدٌ', 'وَاحِدٌ', 'صَمَدٌ', 'كَبِيرٌ'],
    correctAnswer: 'أَحَدٌ',
    correctAnswerAr: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    surahName: 'Al-Ikhlas',
    ayahRange: 'Ayat 1',
    explanation: 'Surah Al-Ikhlas menegaskan keesaan Allah. Kata "Ahad" bermakna Esa, Yang Maha Tunggal.',
  },
  {
    id: 'q3',
    type: 'sambung-ayat',
    questionAr: 'إِيَّاكَ نَعْبُدُ ...',
    questionId: 'Lanjutkan ayat dari Surah Al-Fatihah berikut:',
    options: ['وَإِيَّاكَ نَسْتَعِينُ', 'وَإِيَّاكَ نَسْتَغْفِرُ', 'وَإِيَّاكَ نَشْكُرُ', 'وَإِيَّاكَ نَرْجُو'],
    correctAnswer: 'وَإِيَّاكَ نَسْتَعِينُ',
    correctAnswerAr: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    surahName: 'Al-Fatihah',
    ayahRange: 'Ayat 5',
    explanation: 'Ayat ini mengandung makna tauhid ibadah: hanya kepada Allah kita menyembah dan hanya kepada-Nya kita memohon pertolongan.',
  },
  {
    id: 'q4',
    type: 'sambung-ayat',
    questionAr: 'وَالْعَصْرِ ﴿١﴾ إِنَّ الْإِنسَانَ لَفِي ...',
    questionId: 'Lanjutkan ayat dari Surah Al-Asr berikut:',
    options: ['خُسْرٍ', 'ضَلَالٍ', 'عَذَابٍ', 'غَفْلَةٍ'],
    correctAnswer: 'خُسْرٍ',
    correctAnswerAr: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
    surahName: 'Al-Asr',
    ayahRange: 'Ayat 1-2',
    explanation: 'Allah bersumpah demi waktu, bahwa manusia berada dalam kerugian, kecuali orang-orang yang beriman dan beramal salih.',
  },
  {
    id: 'q5',
    type: 'tebak-surah',
    questionAr: 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ',
    questionId: 'Ayat di atas merupakan ayat pertama dari surah apa?',
    options: ['Al-Lahab (Al-Masad)', 'Al-Kafirun', 'An-Nasr', 'Al-Humazah'],
    correctAnswer: 'Al-Lahab (Al-Masad)',
    surahName: 'Al-Lahab',
    ayahRange: 'Ayat 1',
    explanation: 'Surah Al-Lahab (juga disebut Al-Masad) turun berkaitan dengan Abu Lahab, paman Nabi ﷺ, yang menentang dakwah Islam.',
  },
  {
    id: 'q6',
    type: 'sambung-ayat',
    questionAr: 'إِنَّا أَعْطَيْنَاكَ ...',
    questionId: 'Lanjutkan ayat dari Surah Al-Kautsar berikut:',
    options: ['الْكَوْثَرَ', 'الْخَيْرَ', 'الْفَضْلَ', 'الْحِكْمَةَ'],
    correctAnswer: 'الْكَوْثَرَ',
    correctAnswerAr: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ',
    surahName: 'Al-Kautsar',
    ayahRange: 'Ayat 1',
    explanation: 'Al-Kautsar bermakna kebaikan yang banyak, termasuk telaga Al-Kautsar di surga yang dijanjikan untuk Nabi Muhammad ﷺ.',
  },
  {
    id: 'q7',
    type: 'isi-lanjutan',
    questionAr: 'قُلْ أَعُوذُ بِرَبِّ ...',
    questionId: 'Lanjutkan ayat pertama Surah Al-Falaq:',
    options: ['الْفَلَقِ', 'النَّاسِ', 'الْعَرْشِ', 'السَّمَاءِ'],
    correctAnswer: 'الْفَلَقِ',
    correctAnswerAr: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
    surahName: 'Al-Falaq',
    ayahRange: 'Ayat 1',
    explanation: 'Al-Falaq bermakna "waktu subuh" atau "yang membelah (gelap menjadi terang)". Surah ini mengajarkan kita berlindung kepada Allah dari segala kejahatan.',
  },
  {
    id: 'q8',
    type: 'sambung-ayat',
    questionAr: 'لَمْ يَلِدْ ...',
    questionId: 'Lanjutkan ayat dari Surah Al-Ikhlas berikut:',
    options: ['وَلَمْ يُولَدْ', 'وَلَمْ يَكُنْ', 'وَلَمْ يُشْرِكْ', 'وَلَمْ يَعْلَمْ'],
    correctAnswer: 'وَلَمْ يُولَدْ',
    correctAnswerAr: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    surahName: 'Al-Ikhlas',
    ayahRange: 'Ayat 3',
    explanation: 'Allah tidak beranak dan tidak pula diperanakkan. Ini menegaskan perbedaan mendasar antara Allah dengan makhluk-Nya.',
  },
];

// ============================================================
// Mock Documents (Knowledge Base)
// ============================================================

export const mockDocuments: UploadedDocument[] = [
  {
    id: 'doc-1',
    name: 'Fathul Qarib al-Mujib.pdf',
    type: 'pdf',
    size: '4.2 MB',
    uploadedAt: new Date('2026-09-15'),
    status: 'indexed',
    pages: 156,
    category: 'Fiqih',
  },
  {
    id: 'doc-2',
    name: 'Safinatun Najah.pdf',
    type: 'pdf',
    size: '1.8 MB',
    uploadedAt: new Date('2026-09-18'),
    status: 'indexed',
    pages: 48,
    category: 'Fiqih',
  },
  {
    id: 'doc-3',
    name: "Ta'limul Muta'allim.pdf",
    type: 'pdf',
    size: '2.5 MB',
    uploadedAt: new Date('2026-09-20'),
    status: 'indexed',
    pages: 89,
    category: 'Akhlaq',
  },
  {
    id: 'doc-4',
    name: 'Minhajut Thalibin.pdf',
    type: 'pdf',
    size: '8.1 MB',
    uploadedAt: new Date('2026-09-25'),
    status: 'indexed',
    pages: 342,
    category: 'Fiqih',
  },
  {
    id: 'doc-5',
    name: 'Ihya Ulumiddin - Jilid 1.pdf',
    type: 'pdf',
    size: '12.3 MB',
    uploadedAt: new Date('2026-10-01'),
    status: 'indexing',
    pages: 520,
    category: 'Tasawuf',
  },
];

// ============================================================
// Quick Prompts
// ============================================================

export const quickPrompts = [
  { label: 'Syarat sah wudhu', icon: '💧' },
  { label: 'Adab menuntut ilmu', icon: '📖' },
  { label: 'Rukun shalat', icon: '🕌' },
  { label: 'Keutamaan shalawat', icon: '🌙' },
  { label: 'Hukum puasa Senin-Kamis', icon: '☀️' },
  { label: 'Doa setelah shalat', icon: '🤲' },
];
