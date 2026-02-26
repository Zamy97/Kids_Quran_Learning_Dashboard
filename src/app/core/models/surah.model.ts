export interface Verse {
  number: number;
  arabic: string;
  translation: string;
  transliteration?: string;
}

export interface Surah {
  id: string;
  number: number;
  nameAr: string;
  nameEn: string;
  meaning: string;
  verses: number;
  revelation: 'Makkah' | 'Madinah';
  /** Juz number (1–30) where this surah begins. Used to group surahs by juz. */
  juz: number;
  memorized: boolean;
  story: string;
  verses_data: Verse[];
  /** Full surah recitation (one file). Used when verseAudioBaseUrl is not set. */
  audioUrl?: string;
  /**
   * Start time (seconds) of each verse in the full audio.
   * Only used when audioUrl is set and verseAudioBaseUrl is not.
   */
  verseStartTimes?: number[];
  /**
   * Base URL for ayah-by-ayah MP3s (e.g. EveryAyah).
   * Files are built as: {verseAudioBaseUrl}/{SSS}{VVV}.mp3 (e.g. 001001.mp3 for surah 1 verse 1).
   * When set, playback is one verse at a time and the displayed verse follows the audio.
   * @see https://everyayah.com/
   */
  verseAudioBaseUrl?: string;
  /**
   * Path to a single full-surah MP3 in assets (e.g. from scripts/build-surah-audio).
   * When set, the app plays this one file for continuous playback (better for background tabs).
   */
  fullSurahAudioUrl?: string;
}
