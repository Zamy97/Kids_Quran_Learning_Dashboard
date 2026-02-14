import { ArabicLetter, JoiningExample, SimpleWord } from '../models/arabic-letter.model';

export const ARABIC_LETTERS_DATA: ArabicLetter[] = [
  { arabic: 'ا', name: 'Alif', sound: 'a' },
  { arabic: 'ب', name: 'Ba', sound: 'b' },
  { arabic: 'ت', name: 'Ta', sound: 't' },
  { arabic: 'ث', name: 'Tha', sound: 'th' },
  { arabic: 'ج', name: 'Jeem', sound: 'j' },
  { arabic: 'ح', name: 'Ha', sound: 'h' },
  { arabic: 'خ', name: 'Kha', sound: 'kh' },
  { arabic: 'د', name: 'Dal', sound: 'd' },
  { arabic: 'ذ', name: 'Dhal', sound: 'dh' },
  { arabic: 'ر', name: 'Ra', sound: 'r' },
  { arabic: 'ز', name: 'Zay', sound: 'z' },
  { arabic: 'س', name: 'Seen', sound: 's' },
  { arabic: 'ش', name: 'Sheen', sound: 'sh' },
  { arabic: 'ص', name: 'Sad', sound: 's' },
  { arabic: 'ض', name: 'Dad', sound: 'd' },
  { arabic: 'ط', name: 'Ta', sound: 't' },
  { arabic: 'ظ', name: 'Dha', sound: 'dh' },
  { arabic: 'ع', name: 'Ayn', sound: 'a' },
  { arabic: 'غ', name: 'Ghayn', sound: 'gh' },
  { arabic: 'ف', name: 'Fa', sound: 'f' },
  { arabic: 'ق', name: 'Qaf', sound: 'q' },
  { arabic: 'ك', name: 'Kaf', sound: 'k' },
  { arabic: 'ل', name: 'Lam', sound: 'l' },
  { arabic: 'م', name: 'Meem', sound: 'm' },
  { arabic: 'ن', name: 'Noon', sound: 'n' },
  { arabic: 'ه', name: 'Ha', sound: 'h' },
  { arabic: 'و', name: 'Waw', sound: 'w' },
  { arabic: 'ي', name: 'Ya', sound: 'y' }
];

export const JOINING_EXAMPLES: JoiningExample[] = [
  {
    title: 'Ba (ب)',
    beginning: 'بـ',
    middle: 'ـبـ',
    end: 'ـب',
    isolated: 'ب',
    word: 'باب',
    meaning: 'door'
  }
];

export const SIMPLE_WORDS: SimpleWord[] = [
  { arabic: 'باب', transliteration: 'bab', meaning: 'door' },
  { arabic: 'كتاب', transliteration: 'kitab', meaning: 'book' },
  { arabic: 'مسجد', transliteration: 'masjid', meaning: 'mosque' }
];
