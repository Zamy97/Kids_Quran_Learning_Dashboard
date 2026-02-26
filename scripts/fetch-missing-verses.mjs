#!/usr/bin/env node
/**
 * Fetches Arabic + English (Sahih International) for surahs that still have placeholder verses.
 * Uses api.alquran.cloud. Run: node scripts/fetch-missing-verses.mjs [output.txt]
 * If output file given, writes there; otherwise prints to stdout.
 */
import fs from 'fs';

// Surahs 78-99 (all that currently use placeholderVerses in the app)
const SURAH_NUMBERS = [];
for (let n = 78; n <= 99; n++) SURAH_NUMBERS.push(n);

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
  for (const num of SURAH_NUMBERS) {
    await delay(1200);
    process.stderr.write(`Fetching surah ${num}...\n`);
    const s = await fetchSurah(num);
    out.push(`// ${s.name} (${s.number}) - ${s.verses.length} verses`);
    out.push(`verses_data: [\n${formatVersesData(s.verses)}\n    ]`);
    out.push('');
  }
  const text = out.join('\n');
  const outPath = process.argv[2];
  if (outPath) {
    fs.writeFileSync(outPath, text, 'utf8');
    console.error(`Wrote ${outPath}`);
  } else {
    console.log(text);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
