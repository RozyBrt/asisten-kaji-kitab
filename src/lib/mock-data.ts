// Mock data and response generator khusus Kitab Al-Kawakib Ad-Durriyyah
// Terfokus 100% pada rujukan naskah nahwu kurikulum Dayah Minhajussalam

import { ChatApiResponse, UploadedDocument, HafalanQuestion } from './types';

// Response kurasi khusus naskah Al-Kawakib Ad-Durriyyah
const kawakibMockResponses: Record<string, ChatApiResponse> = {
  'kalam': {
    reply: `**Definisi Kalam dan Ketentuannya** menurut naskah **Al-Kawakib Ad-Durriyyah Syarah Mutammimah Al-Jurumiyyah**:\n\nSecara terminologi ulama nahwu, kalam adalah ucapan yang tersusun dan menghasilkan faedah sempurna dengan adanya qashad (disengaja/peletakan bahasa Arab).\n\n**Empat Ketentuan Kalam:**\n1. **Al-Lafzhu (اللفظ):** Suara yang memuat sebagian huruf hijaiyah yang diawali alif dan diakhiri ya'.\n2. **Al-Murakkab (المركب):** Tersusun dari dua kata atau lebih, baik susunan hakiki maupun taqdiri (seperti fi'il amar yang menyimpan dhommir antā).\n3. **Al-Mufid (المفيد):** Memberi faedah sempurna sehingga pendengar dan pembicara merasa cukup dan tidak lagi menunggu kelanjutan kalimat.\n4. **Bil-Wadh'i (بالوضع):** Menggunakan kaidah peletakan tata bahasa Arab yang diakui ahli bahasa.\n\nAdapun pembagian kalimat di dalam kalam terbagi menjadi tiga: **Isim**, **Fi'il**, dan **Huruf** yang memiliki arti.`,
    arabicText: `الْكَلَامُ هُوَ اللَّفْظُ الْمُرَكَّبُ الْمُفِيدُ بِالْوَضْعِ، وَأَقْسَامُهُ ثَلَاثَةٌ: اسْمٌ، وَفِعْلٌ، وَحَرْفٌ جَاءَ لِمَعْنًى`,
    sources: [
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: 'Bab Tentang Pembahasan Kalam',
        halaman: 'Hal. 1 (PDF Hal. 13)',
        pdfPage: 13,
        pdfUrl: '/api/pdf#page=13',
      },
    ],
  },
  'rofa': {
    reply: `**Tanda-Tanda I'rab Rofa'** menurut naskah **Al-Kawakib Ad-Durriyyah**:\n\nI'rab Rofa' memiliki **4 tanda pokok**:\n1. **Dhommah (الضمة):** Tanda asal/utama. Masuk pada 4 tempat:\n   - Isim Mufrad (contoh: جَاءَ زَيْدٌ)\n   - Jamak Taksir (contoh: جَاءَ الزُّيُودُ)\n   - Jamak Muannats Salim (contoh: جَاءَتِ الْهِنْدَاتُ)\n   - Fi'il Mudhari' yang tidak bersambung ujungnya dengan sesuatu (contoh: يَضْرِبُ).\n2. **Wawu (الواو):** Tanda pengganti dhommah pada:\n   - Jamak Mudzakkar Salim (contoh: جَاءَ الزَّيْدُونَ)\n   - Isim-isim yang enam / Asma'ul Khamsah (contoh: جَاءَ أَبُوكَ وَأَخُوكَ).\n3. **Alif (الألف):** Tanda pengganti dhommah khusus pada:\n   - Isim Tatsniyah / Mutsanna (contoh: جَاءَ الزَّيْدَانِ).\n4. **Nun / Tsubutun Nun (النون):** Khusus pada Af'alul Khamsah (contoh: يَفْعَلَانِ، تَفْعَلَانِ، يَفْعَلُونَ، تَفْعَلُونَ، تَفْعَلِينَ).`,
    arabicText: `لِلرَّفْعِ أَرْبَعُ عَلَامَاتٍ: الضَّمَّةُ، وَالْوَاوُ، وَالْأَلِفُ، وَالنُّونُ. فَأَمَّا الضَّمَّةُ فَتَكُونُ عَلَامَةً لِلرَّفْعِ فِي أَرْبَعَةِ مَوَاضِعَ...`,
    sources: [
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: 'Bab Mengenal Tanda-Tanda I\'rab',
        halaman: 'Hal. 12 (PDF Hal. 24)',
        pdfPage: 24,
        pdfUrl: '/api/pdf#page=24',
      },
    ],
  },
  'fail': {
    reply: `**Hukum dan Kaidah Fa'il** dalam naskah **Al-Kawakib Ad-Durriyyah**:\n\n**Definisi:** Fa'il adalah isim marfu' yang disebutkan fi'il (kata kerja) sebelumnya.\n\n**Pembagian Fa'il:**\n1. **Fa'il Zhahir (الظاهر):** Kata benda yang tampak jelas secara lafadz (contoh: قَامَ زَيْدٌ - Zaid telah berdiri).\n2. **Fa'il Mudhmar (المضمر):** Berupa kata ganti (dhamir), berjumlah 12 bentuk (contoh: ضَرَبْتُ، ضَرَبْنَا، ضَرَبْتَ...).\n\n**Kaidah Pokok Fa'il:**\n- Fa'il wajib marfu' secara lafzhi atau taqdiri.\n- Fi'il wajib didahulukan sebelum Fa'il.\n- Jika Fa'il berbentuk mutsanna atau jamak, fi'ilnya tetap dalam bentuk mufrad (contoh: قَامَ الزَّيْدَانِ dan قَامَ الزَّيْدُونَ, bukan قَامَا atau قَامُوا menurut lughah fusha).`,
    arabicText: `الْفَاعِلُ هُوَ الِاسْمُ الْمَرْفُوعُ الْمَذْكُورُ قَبْلَهُ فِعْلُهُ، وَهُوَ عَلَى قِسْمَيْنِ: ظَاهِرٍ وَمُضْمَرٍ`,
    sources: [
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: 'Bab Tentang Fa\'il',
        halaman: 'Hal. 53 (PDF Hal. 65)',
        pdfPage: 65,
        pdfUrl: '/api/pdf#page=65',
      },
    ],
  },
  'naibul fail': {
    reply: `**Na'ibul Fa'il (Pengganti Fa'il)** dalam naskah **Al-Kawakib Ad-Durriyyah**:\n\nDisebut juga sebagai *Al-Maf'ul alladzi lam yusamma fa'iluhu* (Maf'ul yang tidak disebutkan fa'ilnya bersama fi'ilnya).\n\n**Perubahan Bentuk Fi'il (Mabni Majhul):**\n1. **Fi'il Madhi:** Didhommahkan huruf pertamanya dan dikasrahkan huruf sebelum akhirnya (contoh: ضُرِبَ زَيْدٌ).\n2. **Fi'il Mudhari':** Didhommahkan huruf pertamanya dan difathahkan huruf sebelum akhirnya (contoh: يُضْرَبُ زَيْدٌ).\n\nKedudukan Na'ibul Fa'il yang asalnya berstatus maf'ul bih manshub, berubah menjadi marfu' karena menggantikan posisi fa'il yang dibuang.`,
    arabicText: `بَابُ الْمَفْعُولِ الَّذِي لَمْ يُسَمَّ فَاعِلُهُ، وَهُوَ الِاسْمُ الْمَرْفُوعُ الَّذِي لَمْ يُذْكَرْ مَعَهُ فَاعِلُهُ`,
    sources: [
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: 'Bab Tentang Naibu Fa\'il',
        halaman: 'Hal. 58 (PDF Hal. 70)',
        pdfPage: 70,
        pdfUrl: '/api/pdf#page=70',
      },
    ],
  },
  'kaana': {
    reply: `**Amil Nawasikh: Kaana dan Saudaranya** dalam **Al-Kawakib Ad-Durriyyah**:\n\nKaana dan saudaranya masuk ke susunan Mubtada' dan Khabar dengan amalan:\n👉 **Merofa'kan Isim (Mubtada') dan Menashabkan Khabar**.\n\n**Saudara-Saudara Kaana:**\n1. **كَانَ** (menunjukkan waktu lampau / sifat terus-menerus)\n2. **أَمْسَى** (masuk waktu sore)\n3. **أَصْبَحَ** (masuk waktu pagi)\n4. **أَضْحَى** (masuk waktu dhuha)\n5. **ظَلَّ** (masuk waktu siang)\n6. **بَاتَ** (masuk waktu malam)\n7. **صَارَ** (menunjukkan perpindahan/perubahan keadaan)\n8. **لَيْسَ** (menafikan)\n9. Kelompok yang mensyaratkan nafi/syibhu nafi: **مَا زَالَ، مَا انْفَكَّ، مَا فَتِئَ، مَا بَرِحَ**\n10. Kelompok yang mensyaratkan maa mashdariyyah zharfiyyah: **مَا دَامَ**.`,
    arabicText: `فَأَمَّا كَانَ وَأَخَوَاتُهَا فَإِنَّهَا تَرْفَعُ الِاسْمَ وَتَنْصِبُ الْخَبَرَ، وَهِيَ: كَانَ، وَأَمْسَى، وَأَصْبَحَ، وَأَضْحَى، وَظَلَّ، وَبَاتَ، وَصَارَ، وَلَيْسَ...`,
    sources: [
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: 'Bab \'Awamil: Fasal Kaana dan Saudaranya',
        halaman: 'Hal. 73 (PDF Hal. 85)',
        pdfPage: 85,
        pdfUrl: '/api/pdf#page=85',
      },
    ],
  },
  'inna': {
    reply: `**Amil Nawasikh: Inna dan Saudaranya** dalam **Al-Kawakib Ad-Durriyyah**:\n\nInna dan saudaranya beramal kebalikan dari Kaana, yaitu:\n👉 **Menashabkan Isim dan Merofa'kan Khabar**.\n\n**Rincian dan Faedah Maknanya:**\n1. **إِنَّ dan أَنَّ:** Berfaedah *At-Taukid* (menguatkan/menegaskan nisbah kalimat).\n2. **لَكِنَّ:** Berfaedah *Al-Istidrak* (menyusul/mencegah kesalahpahaman kalimat sebelumnya).\n3. **كَأَنَّ:** Berfaedah *At-Tasybih* (penyerupaan) atau asy-syak (keraguan).\n4. **لَيْتَ:** Berfaedah *At-Tamanni* (mengharapkan sesuatu yang mustahil atau sangat sulit terwujud).\n5. **لَعَلَّ:** Berfaedah *At-Tarajji* (mengharapkan hal yang disenangi dan mungkin terwujud) atau *Al-Isyfaq* (mengkhawatirkan hal yang dibenci).`,
    arabicText: `وَأَمَّا إِنَّ وَأَخَوَاتُهَا فَإِنَّهَا تَنْصِبُ الِاسْمَ وَتَرْفَعُ الْخَبَرَ، وَهِيَ: إِنَّ، وَأَنَّ، وَلَكِنَّ، وَكَأَنَّ، وَلَيْتَ، وَلَعَلَّ`,
    sources: [
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: 'Fasal Inna dan Saudaranya',
        halaman: 'Hal. 85 (PDF Hal. 97)',
        pdfPage: 97,
        pdfUrl: '/api/pdf#page=97',
      },
    ],
  },
  'badal': {
    reply: `**Definisi dan Ketentuan Badal** menurut naskah **Al-Kawakib Ad-Durriyyah Syarah Mutammimah Al-Jurumiyyah**:\n\nSecara bahasa, badal bermakna *'iwadh* (pengganti). Sedangkan secara istilah ulama nahwu, badal adalah:\n\n> *Tabi' (kata pengikut) yang dimaksudkan dengan pensandaran hukum secara langsung/pokok tanpa adanya perantaraan huruf antara badal dan mathbu'nya.*\n\n**Empat Macam Pembagian Badal (Hal. 243-247):**\n1. **Badal Kull min Kull / Badal Syai' min Syai' (بَدَلُ الْكُلِّ مِنَ الْكُلِّ):** Badal yang sama persis dengan madlul mathbu'nya. Contoh: جَاءَ زَيْدٌ أَخُوكَ (Zaid telah datang, yaitu saudaramu).\n2. **Badal Ba'dh min Kull (بَدَلُ الْبَعْضِ مِنَ الْكُلِّ):** Badal yang merupakan bagian/pecahan dari mathbu'nya (wajib memiliki dhamir yang kembali kepada mathbu'). Contoh: أَكَلْتُ الرَّغِيفَ ثُلُثَهُ (Aku memakan roti itu sepertiganya).\n3. **Badal Isytimal (بَدَلُ الِاشْتِمَالِ):** Badal yang memiliki keterkaitan makna dengan mathbu'nya namun bukan merupakan juz/bagian fisiknya (juga wajib ber-dhamir). Contoh: نَفَعَنِي زَيْدٌ عِلْمُهُ (Zaid memberi manfaat kepadaku, yaitu ilmunya).\n4. **Badal Ghalath (بَدَلُ الْغَلَطِ / الْبَدَاءِ / النِّسْيَانِ):** Penggantian karena salah ucap yang segera diralat. Contoh: رَأَيْتُ زَيْدًا الْفَرَسَ (Aku melihat Zaid, eh kudanya).`,
    arabicText: `اَلْبَدَلُ هُوَ : اَلتَّابِعُ الْمَقْصُودُ بِالْحُكْمِ بِلَا وَاسِطَةٍ .`,
    sources: [
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: "Bab Badal (Badal Kull min Kull, Ba'dh min Kull, Isytimal, Ghalath)",
        halaman: 'Hal. 242 (PDF Hal. 254)',
        pdfPage: 254,
        pdfUrl: '/api/pdf#page=254',
      },
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: "Bab Badal (Badal Kull min Kull, Ba'dh min Kull, Isytimal, Ghalath)",
        halaman: 'Hal. 243 (PDF Hal. 255)',
        pdfPage: 255,
        pdfUrl: '/api/pdf#page=255',
      },
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: "Bab Badal (Badal Kull min Kull, Ba'dh min Kull, Isytimal, Ghalath)",
        halaman: 'Hal. 244 (PDF Hal. 256)',
        pdfPage: 256,
        pdfUrl: '/api/pdf#page=256',
      },
    ],
  },
  'muthlaq': {
    reply: `**Definisi dan Ketentuan Maf'ul Muthlaq (Al-Mashdar)** menurut naskah **Al-Kawakib Ad-Durriyyah Syarah Mutammimah Al-Jurumiyyah**:\n\nMaf'ul Muthlaq adalah mashdar yang berstatus fadh-lah (pelengkap yang bukan penopang pokok kalimat seperti musnad-musnad ilaih) yang berfungsi untuk menguatkan amilnya, menerangkan jenisnya (macam amil), atau menerangkan bilangannya.\n\n**Tiga Fungsi Pokok Maf'ul Muthlaq:**\n1. **Al-Mu'akkid li 'Amilihi (Penguat Amil / Taukidi):** Contoh: ضَرَبْتُ ضَرْبًا (Aku benar-benar memukul).\n2. **Al-Mubayyin li Nau'ihi (Penjelas Macam Amil / Naw'i):** Contoh: جَلَسْتُ جُلُوسَ الْقَارِئِ (Aku duduk seperti duduknya seorang qari).\n3. **Al-Mubayyin li 'Adadihi (Penjelas Bilangan Amil / 'Adadi):** Contoh: ضَرَبْتُ زَيْدًا ضَرْبَتَيْنِ (Aku memukul Zaid dua kali pukulan).\n\n**Dua Pembagian Lafazh Mashdar:**\n1. **Lafzhi:** Jika lafazh mashdar bersesuaian dengan lafazh fi'il amilnya, seperti: قَتَلْتُهُ قَتْلًا.\n2. **Ma'nawi:** Jika mashdar bersesuaian dengan makna fi'ilnya tetapi berbeda lafazhnya, seperti: جَلَسْتُ قُعُودًا.`,
    arabicText: `اَلْمَفْعُولُ الْمُطْلَقُ هُوَ : اَلْمَصْدَرُ الْفَضْلَةُ الْمُؤَكِّدُ لِعَامِلِهِ أَوْ الْمُبَيِّنُ لِنَوْعِهِ أَوْ عَدَدِهِ .`,
    sources: [
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: "Bab Maf'ul Muthlaq / Al-Mashdar (Taukidi, Naw'i, 'Adadi)",
        halaman: 'Hal. 135 (PDF Hal. 147)',
        pdfPage: 147,
        pdfUrl: '/api/pdf#page=147',
      },
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: "Bab Maf'ul Muthlaq / Al-Mashdar (Taukidi, Naw'i, 'Adadi)",
        halaman: 'Hal. 137 (PDF Hal. 149)',
        pdfPage: 149,
        pdfUrl: '/api/pdf#page=149',
      },
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: "Bab Maf'ul Muthlaq / Al-Mashdar (Taukidi, Naw'i, 'Adadi)",
        halaman: 'Hal. 138 (PDF Hal. 150)',
        pdfPage: 150,
        pdfUrl: '/api/pdf#page=150',
      },
    ],
  },
  'sharaf': {
    reply: `**Isim Ghairu Munsharif (Isim Tegah Sharaf)** dalam **Al-Kawakib Ad-Durriyyah**:\n\nIsim yang tercegah dari tanwin dan ber-i'rab tanda jar dengan **fathah** (selama tidak di-idhafahkan atau kemasukan Alif Lam).\n\n**Sebab Tercegahnya:**\nMemiliki **dua 'illat cabang** (satu kembali ke lafazh dan satu ke makna), atau **satu 'illat yang menempati dua 'illat**:\n1. Satu 'illat menempati dua 'illat:\n   - Alif Ta'nits Maqshurah atau Mamdudah (contoh: حُبْلَى، حَمْرَاء).\n   - Shighat Muntahal Jumu' (contoh: مَسَاجِدُ، مَصَابِيحُ).\n2. Dua 'illat (Gabungan 'Alamiyyah atau Washfiyyah dengan 'illat lain seperti 'Udul, Ta'nits, Tarkib Mazji, Ziyadah Alif Nun, Wazan Fi'il, atau 'Ajamiyyah).`,
    arabicText: `وَالْمَمْنُوعُ مِنَ الصَّرْفِ هُوَ مَا فِيهِ عِلَّتَانِ فَرْعِيَّتَانِ مِنْ تِسْعِ عِلَلٍ أَوْ وَاحِدَةٌ تَقُومُ مَقَامَهُمَا...`,
    sources: [
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: 'Fasal Isim Tegah Sharaf (Ghairu Munsharif)',
        halaman: 'Hal. 23 (PDF Hal. 35)',
        pdfPage: 35,
        pdfUrl: '/api/pdf#page=35',
      },
    ],
  },
};

// Fallback cerdas mengambil potongan asli Al-Kawakib dari indeks 284 halaman
export function getMockChatResponse(query: string, image?: string): ChatApiResponse {
  if (image) {
    return {
      reply: `**Hasil Analisis Naskah Fisik Kitab (Vision OCR & Syarah Nahwu):**\n\nNaskah yang dianalisis teridentifikasi sebagai petikan bab kaidah gramatika Arab klasik. Naskah memuat matan ibarat nahwu beserta rincian hukum i'rabnya.\n\n**Intisari Syarah:**\nKaidah yang termaktub menjelaskan pembagian lafazh dan ketentuan i'rab marfu'at. Setiap kalimat wajib memenuhi ketentuan gramatika baku agar terhindar dari kesalahan makna (lahn).\n\n*Catatan: Transkripsi naskah dan telaah syarah dianalisis secara presisi oleh modul Vision OCR berbasis naskah Al-Kawakib Ad-Durriyyah.*`,
      arabicText: `الْكَلَامُ هُوَ اللَّفْظُ الْمُرَكَّبُ الْمُفِيدُ بِالْوَضْعِ، وَأَقْسَامُهُ ثَلَاثَةٌ: اسْمٌ، وَفِعْلٌ، وَحَرْفٌ جَاءَ لِمَعْنًى`,
      sources: [
        {
          kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
          bab: 'Bab Tentang Pembahasan Kalam',
          halaman: 'Hal. 1 (PDF Hal. 13)',
          pdfPage: 13,
          pdfUrl: '/api/pdf#page=13',
        },
      ],
      isOcr: true,
    };
  }

  const q = (query || '').toLowerCase();

  for (const [key, val] of Object.entries(kawakibMockResponses)) {
    if (q.includes(key)) return val;
  }

  // Fallback kurasi gramatika Al-Kawakib untuk demo client-side
  if (q.includes('fiil') || q.includes("fi'il") || q.includes('kata kerja')) {
    return {
      reply: `**Ketentuan Fi'il (Kata Kerja)** dalam **Al-Kawakib Ad-Durriyyah Syarah Mutammimah**:\n\nFi'il adalah kata yang menunjukkan makna pada dirinya sendiri dan disertai dengan salah satu dari tiga dimensi waktu (madhi/lampau, hal/sekarang, istiqbal/akan datang).\n\n**Ciri-Ciri Fi'il:**\n1. Kemasukan huruf **Qad (قَدْ)** - masuk pada fi'il madhi dan mudhari'.\n2. Kemasukan huruf **Sin (السِّينُ)** dan **Saufa (سَوْفَ)** - khusus fi'il mudhari'.\n3. Kemasukan **Ta' Ta'nits As-Sakinah (تَاءُ التَّأْنِيثِ السَّاكِنَةُ)** - khusus fi'il madhi (contoh: قَامَتْ).\n4. Menerima **Ta' Fa'il** dan **Ya' Mukhatabah** berserta nun taukid pada fi'il amar.`,
      arabicText: `وَالْفِعْلُ يُعْرَفُ بِقَدْ، وَالسِّينِ، وَسَوْفَ، وَتَاءِ التَّأْنِيثِ السَّاكِنَةِ، وَيَاءِ الْفَاعِلَةِ، وَنُونِ التَّوْكِيدِ`,
      sources: [
        {
          kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
          bab: 'Bab Mengenal Tanda-Tanda Fi\'il',
          halaman: 'Hal. 8 (PDF Hal. 20)',
          pdfPage: 20,
          pdfUrl: '/api/pdf#page=20',
        },
      ],
    };
  }

  return {
    reply: `Pertanyaan Anda telah ditelusuri pada korpus **Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah Al-Jurumiyyah (284 Halaman)**.\n\nKaidah gramatika yang Anda tanyakan memiliki perincian yang dibahas secara mendalam dalam naskah syarah. Silakan periksa rujukan bab terkait pada berkas PDF resmi Dayah.`,
    arabicText: `الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ`,
    sources: [
      {
        kitabName: 'Intisari Kitab Al-Kawakib Al-Durriyyah Syarah Mutammimah',
        bab: 'Bab Tentang Pembahasan Kalam & Kaidah Nahwu',
        halaman: 'Hal. 1 (PDF Hal. 13)',
        pdfPage: 13,
        pdfUrl: '/api/pdf#page=13',
      },
    ],
  };
}

// -------------------------------------------------------------
// Korpus Dokumen Tunggal Resmi Dayah
// -------------------------------------------------------------
export const mockDocuments: UploadedDocument[] = [
  {
    id: 'doc-1',
    name: 'INTISARI KITAB AL-KAWAKIB AL-DURRIYYAH SYARAH MUTAMMIMAH AL-JURUMIYYAH.pdf',
    type: 'pdf',
    size: '1.77 MB',
    uploadedAt: new Date('2026-10-14'),
    status: 'indexed',
    pages: 284,
    category: 'Nahwu & Gramatika Arab Klasik',
  },
];

// -------------------------------------------------------------
// Topik Penelusuran Cepat (Nahwu Murni)
// -------------------------------------------------------------
export interface QuickPrompt {
  label: string;
  category: string;
}

export const quickPrompts: QuickPrompt[] = [
  { label: "Kaidah Kalam & Syaratnya", category: "Kalam" },
  { label: "Tanda I'rab Rofa'", category: "I'rab" },
  { label: "Amil Kaana & Saudaranya", category: "Nawasikh" },
  { label: "Hukum Fa'il & Na'ibul Fa'il", category: "Marfu'at" },
  { label: "Amalan Inna wa Akhwatuha", category: "Nawasikh" },
  { label: "Isim Cegah Sharaf (Ghairu Munsharif)", category: "I'rab" },
];

// -------------------------------------------------------------
// Bank Soal Muraja'ah Hafalan Santri (15 Pertanyaan)
// -------------------------------------------------------------
export const mockHafalanQuestions: HafalanQuestion[] = [
  {
    id: 'hafalan-1',
    type: 'sambung-ayat',
    questionAr: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ، فَصَلِّ لِرَبِّكَ ...',
    questionId: 'Lanjutkan ayat kedua dari Surah Al-Kautsar berikut:',
    options: ['وَانْحَرْ', 'وَاصْبِرْ', 'وَاسْجُدْ', 'وَاقْتَرِبْ'],
    correctAnswer: 'وَانْحَرْ',
    correctAnswerAr: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
    surahName: 'Al-Kautsar',
    ayahRange: 'Ayat 2',
    explanation: 'Perintah shalat dan menyembelih qurban sebagai rasa syukur atas nikmat Al-Kautsar yang melimpah.',
  },
  {
    id: 'hafalan-2',
    type: 'tebak-surah',
    questionAr: 'فِي جِيدِهَا حَبْلٌ مِّن مَّسَدٍ',
    questionId: 'Potongan ayat di atas merupakan ayat terakhir dari surah:',
    options: ['Al-Lahab', 'Al-Ikhlas', 'An-Nasr', 'Al-Kafirun'],
    correctAnswer: 'Al-Lahab',
    correctAnswerAr: 'سُورَةُ الْمَسَدِ / اللَّهَبِ (الآيَة 5)',
    surahName: 'Al-Lahab',
    ayahRange: 'Ayat 5',
    explanation: 'Menceritakan balasan bagi Ummu Jamil (istri Abu Lahab) yang memusuhi dakwah Rasulullah SAW.',
  },
  {
    id: 'hafalan-3',
    type: 'isi-lanjutan',
    questionAr: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ، مِن شَرِّ مَا خَلَقَ ، وَمِن شَرِّ ... إِذَا وَقَبَ',
    questionId: 'Lafaz yang tepat untuk melengkapi ayat ketiga Surah Al-Falaq adalah:',
    options: ['غَاسِقٍ', 'حَاسِدٍ', 'نَفَّاثَاتٍ', 'وَسْوَاسٍ'],
    correctAnswer: 'غَاسِقٍ',
    correctAnswerAr: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
    surahName: 'Al-Falaq',
    ayahRange: 'Ayat 3',
    explanation: 'Memohon perlindungan dari kejahatan malam apabila telah gelap gulita.',
  },
  {
    id: 'hafalan-4',
    type: 'sambung-ayat',
    questionAr: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ، وَوَضَعْنَا عَنكَ ...',
    questionId: 'Lanjutkan potongan ayat kedua dari Surah Al-Insyirah berikut:',
    options: ['وِزْرَكَ', 'ذِكْرَكَ', 'أَمْرَكَ', 'عَهْدَكَ'],
    correctAnswer: 'وِزْرَكَ',
    correctAnswerAr: 'وَوَضَعْنَا عَنكَ وِزْرَكَ',
    surahName: 'Al-Insyirah',
    ayahRange: 'Ayat 2',
    explanation: 'Allah SWT melapangkan dada Nabi Muhammad SAW dan meringankan beban berat dakwah beliau.',
  },
  {
    id: 'hafalan-5',
    type: 'isi-lanjutan',
    questionAr: 'وَالتِّينِ وَالزَّيْتُونِ ، وَطُورِ ...',
    questionId: 'Lanjutkan ayat kedua dari Surah At-Tin berikut:',
    options: ['سِينِينَ', 'الْبَلَدِ', 'الْأَمِينِ', 'تَقْوِيمٍ'],
    correctAnswer: 'سِينِينَ',
    correctAnswerAr: 'وَطُورِ سِينِينَ ، وَهَٰذَا الْبَلَدِ الْأَمِينِ',
    surahName: 'At-Tin',
    ayahRange: 'Ayat 2',
    explanation: 'Thuri Sinin adalah Bukit Sinai tempat Nabi Musa AS bermunajat menerima wahyu dari Allah SWT.',
  },
  {
    id: 'hafalan-6',
    type: 'sambung-ayat',
    questionAr: 'إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا ، وَأَخْرَجَتِ الْأَرْضُ ...',
    questionId: 'Lanjutkan ayat kedua dari Surah Az-Zalzalah berikut:',
    options: ['أَثْقَالَهَا', 'أَخْبَارَهَا', 'أَوْزَارَهَا', 'أَسْرَارَهَا'],
    correctAnswer: 'أَثْقَالَهَا',
    correctAnswerAr: 'وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا',
    surahName: 'Az-Zalzalah',
    ayahRange: 'Ayat 2',
    explanation: 'Bumi memuntahkan beban-beban berat yang dikandungnya pada hari kiamat.',
  },
  {
    id: 'hafalan-7',
    type: 'tebak-surah',
    questionAr: 'فَأَمَّا مَن ثَقُلَتْ مَوَازِينُهُ ، فَهُوَ فِي عِيشَةٍ رَّاضِيَةٍ',
    questionId: 'Potongan ayat di atas merupakan bagian dari surah:',
    options: ["Al-Qari'ah", 'At-Takatsur', "Al-'Adiyat", 'Al-Zalzalah'],
    correctAnswer: "Al-Qari'ah",
    correctAnswerAr: 'سُورَةُ الْقَارِعَةِ (الآيَات 6-7)',
    surahName: "Al-Qari'ah",
    ayahRange: 'Ayat 6-7',
    explanation: 'Menerangkan orang yang berat timbangan amal kebaikannya berada dalam kehidupan yang memuaskan di surga.',
  },
  {
    id: 'hafalan-8',
    type: 'isi-lanjutan',
    questionAr: 'أَلْهَاكُمُ التَّكَاثُرُ ، حَتَّىٰ زُرْتُمُ ...',
    questionId: 'Lafaz yang tepat untuk melengkapi ayat kedua Surah At-Takatsur adalah:',
    options: ['الْمَقَابِرَ', 'الْجَحِيمَ', 'الْيَقِينَ', 'النَّعِيمَ'],
    correctAnswer: 'الْمَقَابِرَ',
    correctAnswerAr: 'حَتَّىٰ زُرْتُمُ الْمَقَابِرَ',
    surahName: 'At-Takatsur',
    ayahRange: 'Ayat 2',
    explanation: 'Manusia lalai karena bermegah-megahan hingga mereka masuk ke liang kubur.',
  },
  {
    id: 'hafalan-9',
    type: 'sambung-ayat',
    questionAr: 'وَالْعَادِيَاتِ ضَبْحًا ، فَالْمُورِيَاتِ ...',
    questionId: "Lanjutkan ayat kedua dari Surah Al-'Adiyat berikut:",
    options: ['قَدْحًا', 'صُبْحًا', 'نَقْعًا', 'جَمْعًا'],
    correctAnswer: 'قَدْحًا',
    correctAnswerAr: 'فَالْمُورِيَاتِ قَدْحًا',
    surahName: "Al-'Adiyat",
    ayahRange: 'Ayat 2',
    explanation: 'Kuda perang yang memercikkan bunga api dengan pukulan kuku kakinya.',
  },
  {
    id: 'hafalan-10',
    type: 'tebak-surah',
    questionAr: 'وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ',
    questionId: 'Ayat pertama di atas membuka surah:',
    options: ['Al-Humazah', "Al-Ma'un", 'Al-Masad', 'Al-Kafirun'],
    correctAnswer: 'Al-Humazah',
    correctAnswerAr: 'سُورَةُ الْهُمَزَةِ (الآيَة 1)',
    surahName: 'Al-Humazah',
    ayahRange: 'Ayat 1',
    explanation: 'Ancaman kecelakaan besar bagi setiap pengumpat dan pencela.',
  },
  {
    id: 'hafalan-11',
    type: 'isi-lanjutan',
    questionAr: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ، أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي ...',
    questionId: 'Lafaz yang tepat untuk melengkapi ayat kedua Surah Al-Fil adalah:',
    options: ['تَضْلِيلٍ', 'تَأْكِيلٍ', 'سِجِّيلٍ', 'تَكْذِيبٍ'],
    correctAnswer: 'تَضْلِيلٍ',
    correctAnswerAr: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ',
    surahName: 'Al-Fil',
    ayahRange: 'Ayat 2',
    explanation: 'Allah SWT menjadikan tipu daya pasukan bergajah pimpinan Abrahah sia-sia dan hancur.',
  },
  {
    id: 'hafalan-12',
    type: 'sambung-ayat',
    questionAr: 'لِإِيلَافِ قُرَيْشٍ ، إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَ ...',
    questionId: 'Lanjutkan potongan ayat kedua dari Surah Quraisy berikut:',
    options: ['الصَّيْفِ', 'الْبَلَدِ', 'الْخَوْفِ', 'الْجُوعِ'],
    correctAnswer: 'الصَّيْفِ',
    correctAnswerAr: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ',
    surahName: 'Quraisy',
    ayahRange: 'Ayat 2',
    explanation: 'Kebiasaan orang-orang Quraisy melakukan perjalanan berniaga pada musim dingin (ke Yaman) dan musim panas (ke Syam).',
  },
  {
    id: 'hafalan-13',
    type: 'tebak-surah',
    questionAr: 'فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ ، وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ',
    questionId: 'Potongan ayat di atas merupakan bagian dari surah:',
    options: ["Al-Ma'un", 'Al-Kautsar', "Al-Qari'ah", 'Al-Balad'],
    correctAnswer: "Al-Ma'un",
    correctAnswerAr: 'سُورَةُ الْمَاعُونِ (الآيَات 2-3)',
    surahName: "Al-Ma'un",
    ayahRange: 'Ayat 2-3',
    explanation: 'Ciri orang yang mendustakan agama adalah mereka yang menghardik anak yatim dan enggan memberi makan orang miskin.',
  },
  {
    id: 'hafalan-14',
    type: 'isi-lanjutan',
    questionAr: 'قُلْ هُوَ اللَّهُ أَحَدٌ ، اللَّهُ الصَّمَدُ ، لَمْ يَلِدْ وَلَمْ يُولَدْ ، وَلَمْ يَكُن لَّهُ كُفُوًا ...',
    questionId: 'Lafaz penutup dari Surah Al-Ikhlas adalah:',
    options: ['أَحَدٌ', 'صَمَدٌ', 'عَظِيمٌ', 'قَدِيرٌ'],
    correctAnswer: 'أَحَدٌ',
    correctAnswerAr: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
    surahName: 'Al-Ikhlas',
    ayahRange: 'Ayat 4',
    explanation: 'Penegasan kemurnian tauhid bahwa tidak ada seorang pun atau sesuatu pun yang setara dengan Allah SWT.',
  },
  {
    id: 'hafalan-15',
    type: 'sambung-ayat',
    questionAr: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ، مَلِكِ النَّاسِ ، إِلَٰهِ النَّاسِ ، مِن شَرِّ الْوَسْوَاسِ ...',
    questionId: 'Lanjutkan potongan ayat keempat Surah An-Nas berikut:',
    options: ['الْخَنَّاسِ', 'النَّاسِ', 'الْخَنَّاسُ', 'الْأَمِينِ'],
    correctAnswer: 'الْخَنَّاسِ',
    correctAnswerAr: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
    surahName: 'An-Nas',
    ayahRange: 'Ayat 4',
    explanation: 'Perlindungan dari kejahatan bisikan setan yang bersembunyi ketika manusia mengingat Allah SWT.',
  },
];
