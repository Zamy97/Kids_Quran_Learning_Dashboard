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
  memorized: boolean;
  story: string;
  verses_data: Verse[];
  audioUrl?: string;
}
