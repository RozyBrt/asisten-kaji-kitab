// Sample Turats Manuscript Image (SVG data URI encoded as base64 / data URL)
// Used for 1-click multimodal OCR demonstration during competition presentations.

export const SAMPLE_KITAB_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
  <defs>
    <linearGradient id="paper" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23fbf5e6"/>
      <stop offset="50%" stop-color="%23f5eccb"/>
      <stop offset="100%" stop-color="%23ece0b5"/>
    </linearGradient>
    <filter id="borderGlow">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="%2378350f" flood-opacity="0.15"/>
    </filter>
  </defs>

  <!-- Paper background -->
  <rect width="600" height="400" fill="url(%23paper)"/>
  
  <!-- Outer border -->
  <rect x="25" y="25" width="550" height="350" fill="none" stroke="%2392400e" stroke-width="2.5" rx="4"/>
  <rect x="32" y="32" width="536" height="336" fill="none" stroke="%23b45309" stroke-width="1" stroke-dasharray="4,2"/>

  <!-- Corner Islamic ornaments -->
  <circle cx="45" cy="45" r="8" fill="none" stroke="%2392400e" stroke-width="1.5"/>
  <circle cx="555" cy="45" r="8" fill="none" stroke="%2392400e" stroke-width="1.5"/>
  <circle cx="45" cy="355" r="8" fill="none" stroke="%2392400e" stroke-width="1.5"/>
  <circle cx="555" cy="355" r="8" fill="none" stroke="%2392400e" stroke-width="1.5"/>

  <!-- Header Banner -->
  <text x="300" y="68" font-family="'Amiri', 'Traditional Arabic', serif" font-size="20" font-weight="bold" fill="%2378350f" text-anchor="middle">
    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
  </text>
  <text x="300" y="94" font-family="'Amiri', 'Traditional Arabic', serif" font-size="16" fill="%2392400e" text-anchor="middle">
    كِتَابُ الطَّهَارَةِ — فُرُوضُ الْوُضُوءِ
  </text>

  <line x1="80" y1="110" x2="520" y2="110" stroke="%23b45309" stroke-width="1.2"/>

  <!-- Matan Arabic Text in Classical Layout -->
  <text x="520" y="150" font-family="'Amiri', 'Traditional Arabic', serif" font-size="18" fill="%231f2937" text-anchor="end">
    (فَصْلٌ) وَفُرُوضُ الْوُضُوءِ سِتَّةُ أَشْيَاءَ:
  </text>
  <text x="520" y="190" font-family="'Amiri', 'Traditional Arabic', serif" font-size="17" fill="%231f2937" text-anchor="end">
    الْأَوَّلُ: النِّيَّةُ عِنْدَ غَسْلِ الْوَجْهِ،
  </text>
  <text x="520" y="230" font-family="'Amiri', 'Traditional Arabic', serif" font-size="17" fill="%231f2937" text-anchor="end">
    وَالثَّانِي: غَسْلُ الْوَجْهِ، وَالثَّالِثُ: غَسْلُ الْيَدَيْنِ إِلَى الْمِرْفَقَيْنِ،
  </text>
  <text x="520" y="270" font-family="'Amiri', 'Traditional Arabic', serif" font-size="17" fill="%231f2937" text-anchor="end">
    وَالرَّابِعُ: مَسْحُ بَعْضِ الرَّأْسِ، وَالْخَامِسُ: غَسْلُ الرِّجْلَيْنِ إِلَى الْكَعْبَيْنِ،
  </text>
  <text x="520" y="310" font-family="'Amiri', 'Traditional Arabic', serif" font-size="17" fill="%231f2937" text-anchor="end">
    وَالسَّادِسُ: التَّرْتِيبُ عَلَى مَا ذَكَرْنَاهُ.
  </text>

  <!-- Footnote / Hashiyah hint -->
  <text x="70" y="348" font-family="sans-serif" font-size="10" fill="%2392400e">
    [Matan Safinatun Najah / Fathul Qarib - Hal. 10]
  </text>
</svg>`;
