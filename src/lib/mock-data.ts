// Mock data and fallback responses for demonstration without API keys

import { ChatApiResponse, HafalanQuestion, UploadedDocument, KitabSource } from './types';

// ============================================================
// Mock Chat Responses
// ============================================================

const mockTextResponses: Record<string, ChatApiResponse> = {
  'syarat sah wudhu': {
    reply: `**Syarat Sah Wudhu** menurut mayoritas ulama Syafi'iyyah ada 6 perkara:\n\n1. **Islam** - Wudhu tidak sah dari orang non-muslim.\n2. **Tamyiz** - Mampu membedakan baik dan buruk (mumayyiz).\n3. **Suci dari haid dan nifas** - Bagi wanita.\n4. **Menggunakan air suci dan menyucikan** (thahur) - Air mutlak yang belum berubah sifat esensialnya.\n5. **Tidak ada penghalang** sampainya air ke kulit - Seperti getah, cat, lilin, atau minyak tebal.\n6. **Telah masuk waktu & berkesinambungan** bagi yang berhadas terus-menerus (da'imul hadats).\n\nDalil pokok bersumber dari **QS. Al-Ma'idah [5]: 6** yang menerangkan kaidah thaharah secara qath'i.`,
    arabicText: `يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ`,
    sources: [
      { kitabName: 'Safinatun Najah (karya Syaikh Salim bin Sumair)', bab: 'Fashl Syuruthul Wudhu', halaman: '12' },
      { kitabName: 'Fathul Qarib al-Mujib (karya Ibnu Qasim al-Ghazi)', bab: 'Bab Thaharah - Fashl Syuruthush Shalah wal Wudhu', halaman: '18' },
    ],
  },
  'adab menuntut ilmu': {
    reply: `**Adab Menuntut Ilmu** yang ditegaskan para ulama salafus shalih:\n\n1. **Niat ikhlas lillahi ta'ala** - Menghilangkan kebodohan dari diri sendiri dan orang lain, bukan untuk kemegahan duniawi.\n2. **Tazhim terhadap guru (Masyayikh)** - Memuliakan guru, bersikap santun, dan menyimak secara seksama.\n3. **Sabar dan tekun (Ishbar wa Mushabarah)** - Mengarungi proses belajar secara berkesinambungan.\n4. **Mengamalkan ilmu** - Karena ilmu tanpa amal bagai pohon tak berbuah.\n5. **Tawadhu'** - Senantiasa rendah hati dan tidak meremehkan faidah keilmuan sekecil apa pun.\n6. **Menjaga waktu** - Memanfaatkan masa muda dan konsistensi muraja'ah.\n\nImam Syafi'i rahimahullah berpesan:\n*"Ilmu bukanlah yang sekadar dihafal di lisan, melainkan yang memberi manfaat nyata."*`,
    arabicText: `قَالَ الشَّافِعِيُّ رَحِمَهُ اللَّهُ: لَيْسَ الْعِلْمُ مَا حُفِظَ، إِنَّمَا الْعِلْمُ مَا نَفَعَ`,
    sources: [
      { kitabName: "Ta'limul Muta'allim (karya Syaikh Az-Zarnuji)", bab: "Fashl fi Niyyati fi Hali at-Ta'allum", halaman: '8' },
      { kitabName: "Ihya' Ulumiddin (karya Hujjatul Islam Imam Al-Ghazali)", bab: "Kitab Al-'Ilm - Bab Adab al-Muta'allim wal Mu'allim", halaman: '45' },
    ],
  },
  'rukun shalat': {
    reply: `**Rukun Shalat** menurut mazhab Syafi'i berjumlah **13 rukun** (atau 17 rukun bila thuma'ninah dihitung terpisah):\n\n1. **Niat** di dalam hati berbarengan dengan Takbiratul Ihram.\n2. **Berdiri** bagi yang berkemampuan pada shalat fardhu.\n3. **Takbiratul Ihram** (ucapan Allahu Akbar).\n4. **Membaca Surah Al-Fatihah** beserta basmalahnya.\n5. **Ruku'** dengan thuma'ninah.\n6. **I'tidal** dengan thuma'ninah.\n7. **Sujud dua kali** pada tiap rakaat dengan thuma'ninah.\n8. **Duduk di antara dua sujud** dengan thuma'ninah.\n9. **Tasyahud akhir**.\n10. **Duduk pada tasyahud akhir**.\n11. **Membaca shalawat atas Nabi Muhammad SAW** pada tasyahud akhir.\n12. **Salam yang pertama**.\n13. **Tertib** dalam menjalankan urutan rukun-rukun tersebut.`,
    arabicText: `أَرْكَانُ الصَّلَاةِ: النِّيَّةُ، وَالْقِيَامُ مَعَ الْقُدْرَةِ، وَتَكْبِيرَةُ الْإِحْرَامِ، وَقِرَاءَةُ الْفَاتِحَةِ، وَالرُّكُوعُ، وَالطُّمَأْنِينَةُ فِيهِ...`,
    sources: [
      { kitabName: 'Safinatun Najah (karya Syaikh Salim bin Sumair)', bab: 'Fashl Arkanush Shalah', halaman: '20' },
      { kitabName: 'Fathul Qarib al-Mujib (karya Ibnu Qasim al-Ghazi)', bab: 'Fashl fi Bayani Arkanish Shalah', halaman: '28' },
      { kitabName: 'Minhajuth Thalibin (karya Imam An-Nawawi)', bab: 'Kitabush Shalah - Fasl Shifatush Shalah', halaman: '54' },
    ],
  },
  'kaidah kalam & i\'rab': {
    reply: `**Definisi Kalam dan Asas I'rab** dalam gramatika bahasa Arab klasik:\n\nMenurut naskah **Al-Kawakib Ad-Durriyyah Syarah Mutammimah Al-Ajurrumiyyah**, kalam secara terminologi nahwu wajib memenuhi empat kriteria:\n1. **Al-Lafzhu (اللفظ)**: Suara yang mengandung sebagian huruf hijaiyah.\n2. **Al-Murakkab (المركب)**: Tersusun dari dua kata atau lebih secara hakiki maupun taqdiri.\n3. **Al-Mufid (المفيد)**: Memberi faedah sempurna sehingga pendengar tidak lagi menunggu kelanjutan kalimat.\n4. **Bil-Wadh'i (بالوضع)**: Menggunakan kaidah peletakan tata bahasa Arab yang diakui.\n\nAdapun **I'rab** adalah perubahan akhir kalimat karena perbedaan amil yang masuk, baik secara lafzhi maupun taqdiri.`,
    arabicText: `الْكَلَامُ هُوَ اللَّفْظُ الْمُرَكَّبُ الْمُفِيدُ بِالْوَضْعِ، وَأَقْسَامُهُ ثَلَاثَةٌ: اسْمٌ، وَفِعْلٌ، وَحَرْفٌ جَاءَ لِمَعْنًى`,
    sources: [
      { kitabName: 'Al-Kawakib Ad-Durriyyah (karya Syaikh Muhammad az-Zuhri al-Ghamrawi)', bab: 'Bab Al-Kalam wa Aqsamuhu', halaman: '6' },
      { kitabName: 'Mutammimah Al-Ajurrumiyyah (karya Syaikh Syamsuddin Ar-Ra\'ini)', bab: 'Mukaddimah fi Hadil Kalam', halaman: '4' },
    ],
  },
};

const defaultMockResponse: ChatApiResponse = {
  reply: `Berikut penjelasan berdasarkan rujukan naskah turats yang relevan:\n\nPertanyaan Anda telah dipadankan dengan korpus literatur fikih, adab, dan kaidah gramatika yang terindeks dalam sistem. Para ulama mutaqaddimin dan muta'akhkhirin telah menguraikan kaidah permasalahan ini secara terperinci beserta dalil naqli dan 'aqli.\n\n**Rangkuman Telaah Ilmiah:**\n1. Masalah ini memiliki dasar nash yang kuat dalam kitab-kitab syarah mu'tamad.\n2. Para fuqaha meletakkan batasan syarat, rukun, serta konsekuensi hukum yang jelas.\n3. Dianjurkan menelaah langsung teks matan dan syarah untuk memahami kontekstualisasi masalah secara menyeluruh.`,
  arabicText: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ - الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ`,
  sources: [
    { kitabName: 'Fathul Qarib al-Mujib', bab: 'Bab Terkait', halaman: 'Referensi' },
    { kitabName: 'Safinatun Najah', bab: 'Fashl Terkait', halaman: 'Referensi' },
  ],
};

const mockOcrResponse: ChatApiResponse = {
  reply: `**Hasil Analisis Naskah Kitab (Multimodal OCR & Syarah):**\n\nNaskah yang dianalisis teridentifikasi sebagai bab thaharah dalam literatur fikih mazhab Syafi'i. Berikut transkripsi matan beserta penjelasan syarahnya:\n\n**Ringkasan Fikih:**\nFashl ini menegaskan kewajiban fardhu wudhu yang terdiri atas 6 rukun pokok. Niat wajib dihadirkan berbarengan dengan basuhan pertama pada wajah.\n\n**Uraian Rukun:**\n- Rukun pertama adalah **Niat** di dalam hati.\n- Rukun kedua adalah **Membasuh wajah** dari batas tumbuh rambut hingga dagu.\n- Rukun ketiga adalah **Membasuh kedua tangan hingga siku**.\n- Rukun keempat adalah **Mengusap sebagian kepala**.\n- Rukun kelima adalah **Membasuh kedua kaki hingga mata kaki**.\n- Rukun keenam adalah **Tertib**.\n\n*Catatan: Transkripsi naskah dan telaah syarah dianalisis secara cerdas oleh modul Multimodal Vision OCR.*`,
  arabicText: `فُرُوضُ الْوُضُوءِ سِتَّةٌ: الْأَوَّلُ النِّيَّةُ عِنْدَ غَسْلِ الْوَجْهِ، وَالثَّانِي غَسْلُ الْوَجْهِ، وَالثَّالِثُ غَسْلُ الْيَدَيْنِ مَعَ الْمِرْفَقَيْنِ، وَالرَّابِعُ مَسْحُ بَعْضِ الرَّأْسِ، وَالْخَامِسُ غَسْلُ الرِّجْلَيْنِ مَعَ الْكَعْبَيْنِ، وَالسَّادِسُ التَّرْتِيبُ`,
  sources: [
    { kitabName: 'Fathul Qarib al-Mujib (karya Ibnu Qasim al-Ghazi)', bab: 'Bab Thaharah - Fashl Furudhul Wudhu', halaman: '14' },
    { kitabName: 'Safinatun Najah (karya Syaikh Salim bin Sumair)', bab: 'Fashl Furudhul Wudhu Sittah', halaman: '10' },
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
    questionAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ ...',
    questionId: 'Lanjutkan ayat dari Surah Al-Fatihah berikut:',
    options: ['الرَّحِيمِ', 'الْعَلِيمِ', 'الْكَرِيمِ', 'الْحَكِيمِ'],
    correctAnswer: 'الرَّحِيمِ',
    correctAnswerAr: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    surahName: 'Al-Fatihah',
    ayahRange: 'Ayat 1',
    explanation: 'Basmalah adalah pembuka Surah Al-Fatihah. Ar-Rahman dan Ar-Rahim keduanya berasal dari sifat Rahmah (kasih sayang).',
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
    explanation: 'Surah Al-Ikhlas menegaskan keesaan Allah ta\'ala. Kata "Ahad" bermakna Esa dan Maha Tunggal.',
  },
  {
    id: 'q3',
    type: 'sambung-ayat',
    questionAr: 'إِيَّاكَ نَعْبُدُ ...',
    questionId: 'Lanjutkan ayat dari Surah Al-Fatihah berikut:',
    options: ['وَإِيَّاكَ نَسْتَعِينُ', 'وَإِيَّاكَ نَسْتَغْفِرُ', 'وَإِيَّاكَ نَشْكُرُ', 'وَإِيَّاكَ نَدْعُو'],
    correctAnswer: 'وَإِيَّاكَ نَسْتَعِينُ',
    correctAnswerAr: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    surahName: 'Al-Fatihah',
    ayahRange: 'Ayat 5',
    explanation: 'Ayat ini mengandung tauhid ibadah: hanya kepada Allah semata kita menyembah dan memohon pertolongan.',
  },
  {
    id: 'q4',
    type: 'sambung-ayat',
    questionAr: 'وَالْعَصْرِ ، إِنَّ الْإِنسَانَ لَفِي ...',
    questionId: 'Lanjutkan ayat dari Surah Al-Asr berikut:',
    options: ['خُسْرٍ', 'ضَلَالٍ', 'عَذَابٍ', 'غَفْلَةٍ'],
    correctAnswer: 'خُسْرٍ',
    correctAnswerAr: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
    surahName: 'Al-Asr',
    ayahRange: 'Ayat 1-2',
    explanation: 'Allah bersumpah demi masa bahwa seluruh manusia berada dalam kerugian, kecuali orang-orang yang beriman dan beramal shalih.',
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
    explanation: 'Surah Al-Lahab (Al-Masad) mengabarkan tentang Abu Lahab, paman Nabi SAW yang menentang dakwah risalah tauhid.',
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
    explanation: 'Al-Kautsar bermakna limpahan kebaikan yang sangat agung, termasuk telaga Al-Kautsar kelak di akhirat.',
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
    explanation: 'Al-Falaq bermakna waktu fajar/subuh. Surah ini mengajarkan permohonan perlindungan kepada Allah dari marabahaya.',
  },
  {
    id: 'q8',
    type: 'sambung-ayat',
    questionAr: 'لَمْ يَلِدْ ...',
    questionId: 'Lanjutkan ayat dari Surah Al-Ikhlas berikut:',
    options: ['وَلَمْ يُولَدْ', 'وَلَمْ يَكُنْ', 'وَلَمْ يَشْرَكْ', 'وَلَمْ يَعْلَمْ'],
    correctAnswer: 'وَلَمْ يُولَدْ',
    correctAnswerAr: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
    surahName: 'Al-Ikhlas',
    ayahRange: 'Ayat 3',
    explanation: 'Allah tidak beranak dan tidak pula diperanakkan, menafikan segala keserupaan dengan makhluk.',
  },
  {
    id: 'q9',
    type: 'sambung-ayat',
    questionAr: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ، مَلِكِ ...',
    questionId: 'Lanjutkan ayat kedua dari Surah An-Nas berikut:',
    options: ['النَّاسِ', 'الْفَلَقِ', 'الْخَنَّاسِ', 'الصُّدُورِ'],
    correctAnswer: 'النَّاسِ',
    correctAnswerAr: 'مَلِكِ النَّاسِ ، إِلَٰهِ النَّاسِ',
    surahName: 'An-Nas',
    ayahRange: 'Ayat 2',
    explanation: 'Surah An-Nas menegaskan bahwa Allah adalah Raja dan Penguasa seluruh manusia yang berhak disembah.',
  },
  {
    id: 'q10',
    type: 'sambung-ayat',
    questionAr: 'قُلْ يَا أَيُّهَا الْكَافِرُونَ ، لَا أَعْبُدُ ...',
    questionId: 'Lanjutkan ayat kedua dari Surah Al-Kafirun berikut:',
    options: ['مَا تَعْبُدُونَ', 'مَا عَبَدتُّمْ', 'عَابِدٌ مَّا عَبَدتُّمْ', 'وَلِيَ دِينِ'],
    correctAnswer: 'مَا تَعْبُدُونَ',
    correctAnswerAr: 'لَا أَعْبُدُ مَا تَعْبُدُونَ',
    surahName: 'Al-Kafirun',
    ayahRange: 'Ayat 2',
    explanation: 'Surah Al-Kafirun memuat ketegasan tauhid dan larangan kompromi dalam akidah dan peribadahan.',
  },
  {
    id: 'q11',
    type: 'isi-lanjutan',
    questionAr: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ ...',
    questionId: 'Lengkapi kelanjutan ayat dari Surah An-Nasr berikut:',
    options: ['أَفْوَاجًا', 'أَزْوَاجًا', 'سِرَاعًا', 'جَمِيعًا'],
    correctAnswer: 'أَفْوَاجًا',
    correctAnswerAr: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا',
    surahName: 'An-Nasr',
    ayahRange: 'Ayat 2',
    explanation: 'Afwaja bermakna berbondong-bondong secara massal memasuki agama Islam saat penaklukan kota Makkah.',
  },
  {
    id: 'q12',
    type: 'sambung-ayat',
    questionAr: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ، فَذَٰلِكَ الَّذِي يَدُعُّ ...',
    questionId: 'Lanjutkan ayat kedua dari Surah Al-Maun berikut:',
    options: ['الْيَتِيمَ', 'الْمِسْكِينَ', 'الْمُصَلِّينَ', 'الْمَاعُونَ'],
    correctAnswer: 'الْيَتِيمَ',
    correctAnswerAr: 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ',
    surahName: "Al-Ma'un",
    ayahRange: 'Ayat 2',
    explanation: 'Yadu\'ul yatim bermakna menghardik, menelantarkan, atau memperlakukan anak yatim dengan sewenang-wenang.',
  },
  {
    id: 'q13',
    type: 'sambung-ayat',
    questionAr: 'لِإِيلَافِ قُرَيْشٍ ، إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ ...',
    questionId: 'Lanjutkan ayat kedua dari Surah Quraisy berikut:',
    options: ['وَالصَّيْفِ', 'وَالْفَجْرِ', 'وَالْعَصْرِ', 'وَاللَّيْلِ'],
    correctAnswer: 'وَالصَّيْفِ',
    correctAnswerAr: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ',
    surahName: 'Quraisy',
    ayahRange: 'Ayat 2',
    explanation: 'Rihlatasy-syita-i wash-shayf adalah tradisi perjalanan niaga kaum Quraisy di musim dingin ke Yaman dan musim panas ke Syam.',
  },
  {
    id: 'q14',
    type: 'tebak-surah',
    questionAr: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ',
    questionId: 'Ayat di atas merupakan ayat pertama dari surah apa?',
    options: ['Al-Fil', 'Al-Qari\'ah', 'Al-Adiyat', 'Al-Humazah'],
    correctAnswer: 'Al-Fil',
    surahName: 'Al-Fil',
    ayahRange: 'Ayat 1',
    explanation: 'Surah Al-Fil menceritakan pertolongan Allah menggagalkan tentara bergajah yang dipimpin Abrahah.',
  },
  {
    id: 'q15',
    type: 'sambung-ayat',
    questionAr: 'وَالتِّينِ وَالزَّيْتُونِ ، وَطُورِ ...',
    questionId: 'Lanjutkan ayat kedua dari Surah At-Tin berikut:',
    options: ['سِينِينَ', 'الْبَلَدِ', 'الْأَمِينِ', 'تَقْوِيمٍ'],
    correctAnswer: 'سِينِينَ',
    correctAnswerAr: 'وَطُورِ سِينِينَ ، وَهَٰذَا الْبَلَدِ الْأَمِينِ',
    surahName: 'At-Tin',
    ayahRange: 'Ayat 2',
    explanation: 'Thuri Sinin adalah Bukit Sinai tempat Nabi Musa AS bermunajat menerima wahyu dari Allah SWT.',
  },
];

// ============================================================
// Mock Documents (Knowledge Base)
// ============================================================

export const mockDocuments: UploadedDocument[] = [
  {
    id: 'doc-1',
    name: 'Al-Kawakib Ad-Durriyyah (Syarah Mutammimah Al-Ajurrumiyyah).pdf',
    type: 'pdf',
    size: '14.8 MB',
    uploadedAt: new Date('2026-10-10'),
    status: 'indexed',
    pages: 412,
    category: 'Nahwu & Bahasa',
  },
  {
    id: 'doc-2',
    name: 'Fathul Qarib al-Mujib (Ibnu Qasim al-Ghazi).pdf',
    type: 'pdf',
    size: '4.2 MB',
    uploadedAt: new Date('2026-09-15'),
    status: 'indexed',
    pages: 156,
    category: 'Fiqih',
  },
  {
    id: 'doc-3',
    name: 'Safinatun Najah (Syaikh Salim bin Sumair).pdf',
    type: 'pdf',
    size: '1.8 MB',
    uploadedAt: new Date('2026-09-18'),
    status: 'indexed',
    pages: 48,
    category: 'Fiqih',
  },
  {
    id: 'doc-4',
    name: 'Minhajuth Thalibin (Imam An-Nawawi).pdf',
    type: 'pdf',
    size: '8.1 MB',
    uploadedAt: new Date('2026-09-25'),
    status: 'indexed',
    pages: 342,
    category: 'Fiqih',
  },
  {
    id: 'doc-5',
    name: "Ta'limul Muta'allim (Syaikh Az-Zarnuji).pdf",
    type: 'pdf',
    size: '2.5 MB',
    uploadedAt: new Date('2026-09-20'),
    status: 'indexed',
    pages: 89,
    category: 'Adab & Akhlaq',
  },
];

// ============================================================
// Quick Prompts (Bebas dari AI-Slop & Berbasis Kategori Nyata)
// ============================================================

export interface QuickPrompt {
  label: string;
  category: string;
}

export const quickPrompts: QuickPrompt[] = [
  { label: 'Syarat sah wudhu', category: 'Fikih' },
  { label: 'Adab menuntut ilmu', category: 'Adab' },
  { label: 'Rukun shalat', category: 'Fikih' },
  { label: 'Kaidah kalam & i\'rab', category: 'Nahwu' },
  { label: 'Hukum puasa Senin-Kamis', category: 'Fikih' },
  { label: 'Doa setelah shalat', category: 'Adab' },
];

