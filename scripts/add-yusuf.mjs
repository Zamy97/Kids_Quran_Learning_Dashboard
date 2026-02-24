#!/usr/bin/env node
/**
 * Fetches Surah Yusuf (ch 12) from api.quran.com and outputs a TypeScript Surah entry.
 * Run: node scripts/add-yusuf.mjs
 */
const ARABIC_URL = 'https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=12';
const TRANS_URL = 'https://api.quran.com/api/v4/quran/translations/20?chapter_number=12';

const [arabicRes, transRes] = await Promise.all([
  fetch(ARABIC_URL).then((r) => r.json()),
  fetch(TRANS_URL).then((r) => r.json()),
]);

const verses = arabicRes.verses || [];
const translations = transRes.translations || [];

function escapeTs(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ');
}

const versesData = verses.map((v, i) => {
  const num = parseInt(v.verse_key.split(':')[1], 10);
  const arabic = (v.text_uthmani || '').trim();
  const translation = (translations[i]?.text || '').trim();
  return `      { number: ${num}, arabic: '${escapeTs(arabic)}', translation: '${escapeTs(translation)}' }`;
});

const entry = `  {
    id: 'yusuf',
    number: 12,
    nameAr: 'يوسف',
    nameEn: 'Yusuf',
    meaning: 'Joseph',
    verses: 111,
    revelation: 'Makkah',
    memorized: false,
    story: 'Surah Yusuf was revealed in Makkah. It tells the story of Prophet Joseph (Yusuf)—his dreams, his brothers\\' jealousy, his time in Egypt, and how Allah gave him wisdom and a high position. The Quran calls it "the best of stories." It teaches us about patience, trust in Allah, and that good always wins in the end.',
    verseAudioBaseUrl: 'https://everyayah.com/data/Saood_ash-Shuraym_128kbps',
    fullSurahAudioUrl: 'assets/audio/surahs-full/yusuf.mp3',
    verses_data: [
${versesData.join(',\n')}
    ]
  }`;

console.log(entry);