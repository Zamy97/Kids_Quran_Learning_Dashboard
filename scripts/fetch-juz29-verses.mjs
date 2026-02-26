#!/usr/bin/env node
/**
 * Fetches Arabic + English (Sahih International) for Juz 29 surahs from api.alquran.cloud
 * and outputs verses_data arrays for pasting into surahs.data.ts
 * Run: node scripts/fetch-juz29-verses.mjs
 */

const JUZ29_SURAHS = [67, 69, 70, 71, 72, 73, 74, 75, 76, 77]; // 68 Al-Qalam already has data

function escape(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ').trim();
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchSurah(surahNum, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const [arRes, enRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${surahNum}`),
        fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/en.sahih`)
      ]);
      const ar = await arRes.json();
      const en = await enRes.json();
      if (ar.code !== 200 || en.code !== 200) throw new Error(`API returned ${ar.code}/${en.code}`);
      const verses = ar.data.ayahs.map((a, i) => ({
        number: a.numberInSurah,
        arabic: escape(a.text),
        translation: escape(en.data.ayahs[i].text)
      }));
      return { number: surahNum, name: ar.data.englishName, verses };
    } catch (e) {
      if (attempt === retries) throw e;
      await delay(3000);
    }
  }
}

function formatVersesData(verses) {
  return verses.map(v => `      { number: ${v.number}, arabic: '${v.arabic}', translation: '${v.translation}' }`).join(',\n');
}

async function main() {
  const out = [];
  for (const num of JUZ29_SURAHS) {
    await delay(1500);
    const s = await fetchSurah(num);
    out.push(`// ${s.name} (${s.number}) - ${s.verses.length} verses`);
    out.push(`verses_data: [\n${formatVersesData(s.verses)}\n    ]`);
    out.push('');
  }
  console.log(out.join('\n'));
}

main().catch(e => { console.error(e); process.exit(1); });
