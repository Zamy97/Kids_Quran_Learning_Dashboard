export interface Dua {
  id: string;
  title: string;
  category: 'daily' | 'food' | 'travel' | 'special';
  icon: string;
  occasion: string;
  arabic: string;
  transliteration: string;
  translation: string;
  explanation: string;
  audioUrl?: string;
}
