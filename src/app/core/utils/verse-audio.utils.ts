import { Surah } from '../models/surah.model';

/** Pad number to 3 digits (e.g. 1 → "001"). */
function pad3(n: number): string {
  return n.toString().padStart(3, '0');
}

/**
 * Build per-verse MP3 URLs from EveryAyah-style base URL.
 * Pattern: {baseUrl}/{SSS}{VVV}.mp3 (e.g. 001001.mp3 for surah 1 verse 1).
 * @see https://everyayah.com/
 */
export function buildVerseAudioUrls(surah: Surah): string[] {
  const base = surah.verseAudioBaseUrl?.replace(/\/$/, '');
  if (!base) return [];
  const surahNum = surah.number;
  return surah.verses_data.map(
    (v) => `${base}/${pad3(surahNum)}${pad3(v.number)}.mp3`
  );
}
