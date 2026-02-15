import { ArabicLetter, JoiningExample, SimpleWord } from '../models/arabic-letter.model';

/**
 * Full Arabic alphabet (28 letters) with isolated, beginning, middle, and end forms
 * to match standard alphabet charts. Non-joining letters (ا د ذ ر ز و) repeat
 * the same form in all positions.
 */
export const ARABIC_LETTERS_DATA: ArabicLetter[] = [
  { arabic: 'ا', name: 'Alif', sound: 'a', isolated: 'ا', beginning: 'ا', middle: 'ا', end: 'ا' },
  { arabic: 'ب', name: 'Bā', sound: 'b', isolated: 'ب', beginning: 'بـ', middle: 'ـبـ', end: 'ـب' },
  { arabic: 'ت', name: 'Tā', sound: 't', isolated: 'ت', beginning: 'تـ', middle: 'ـتـ', end: 'ـت' },
  { arabic: 'ث', name: 'Thā', sound: 'th', isolated: 'ث', beginning: 'ثـ', middle: 'ـثـ', end: 'ـث' },
  { arabic: 'ج', name: 'Jīm', sound: 'j', isolated: 'ج', beginning: 'جـ', middle: 'ـجـ', end: 'ـج' },
  { arabic: 'ح', name: 'Ḥā', sound: 'h', isolated: 'ح', beginning: 'حـ', middle: 'ـحـ', end: 'ـح' },
  { arabic: 'خ', name: 'Khā', sound: 'kh', isolated: 'خ', beginning: 'خـ', middle: 'ـخـ', end: 'ـخ' },
  { arabic: 'د', name: 'Dāl', sound: 'd', isolated: 'د', beginning: 'د', middle: 'د', end: 'د' },
  { arabic: 'ذ', name: 'Dhāl', sound: 'dh', isolated: 'ذ', beginning: 'ذ', middle: 'ذ', end: 'ذ' },
  { arabic: 'ر', name: 'Rā', sound: 'r', isolated: 'ر', beginning: 'ر', middle: 'ر', end: 'ر' },
  { arabic: 'ز', name: 'Zāy', sound: 'z', isolated: 'ز', beginning: 'ز', middle: 'ز', end: 'ز' },
  { arabic: 'س', name: 'Sīn', sound: 's', isolated: 'س', beginning: 'سـ', middle: 'ـسـ', end: 'ـس' },
  { arabic: 'ش', name: 'Shīn', sound: 'sh', isolated: 'ش', beginning: 'شـ', middle: 'ـشـ', end: 'ـش' },
  { arabic: 'ص', name: 'Ṣād', sound: 'ṣ', isolated: 'ص', beginning: 'صـ', middle: 'ـصـ', end: 'ـص' },
  { arabic: 'ض', name: 'Ḍād', sound: 'ḍ', isolated: 'ض', beginning: 'ضـ', middle: 'ـضـ', end: 'ـض' },
  { arabic: 'ط', name: 'Ṭā', sound: 'ṭ', isolated: 'ط', beginning: 'طـ', middle: 'ـطـ', end: 'ـط' },
  { arabic: 'ظ', name: 'Ẓā', sound: 'ẓ', isolated: 'ظ', beginning: 'ظـ', middle: 'ـظـ', end: 'ـظ' },
  { arabic: 'ع', name: 'ʿAyn', sound: 'ʿ', isolated: 'ع', beginning: 'عـ', middle: 'ـعـ', end: 'ـع' },
  { arabic: 'غ', name: 'Ghayn', sound: 'gh', isolated: 'غ', beginning: 'غـ', middle: 'ـغـ', end: 'ـغ' },
  { arabic: 'ف', name: 'Fā', sound: 'f', isolated: 'ف', beginning: 'فـ', middle: 'ـفـ', end: 'ـف' },
  { arabic: 'ق', name: 'Qāf', sound: 'q', isolated: 'ق', beginning: 'قـ', middle: 'ـقـ', end: 'ـق' },
  { arabic: 'ك', name: 'Kāf', sound: 'k', isolated: 'ك', beginning: 'كـ', middle: 'ـكـ', end: 'ـك' },
  { arabic: 'ل', name: 'Lām', sound: 'l', isolated: 'ل', beginning: 'لـ', middle: 'ـلـ', end: 'ـل' },
  { arabic: 'م', name: 'Mīm', sound: 'm', isolated: 'م', beginning: 'مـ', middle: 'ـمـ', end: 'ـم' },
  { arabic: 'ن', name: 'Nūn', sound: 'n', isolated: 'ن', beginning: 'نـ', middle: 'ـنـ', end: 'ـن' },
  { arabic: 'ه', name: 'Hā', sound: 'h', isolated: 'ه', beginning: 'هـ', middle: 'ـهـ', end: 'ـه' },
  { arabic: 'و', name: 'Wāw', sound: 'w', isolated: 'و', beginning: 'و', middle: 'و', end: 'و' },
  { arabic: 'ي', name: 'Yā', sound: 'y', isolated: 'ي', beginning: 'يـ', middle: 'ـيـ', end: 'ـي' }
];

export const JOINING_EXAMPLES: JoiningExample[] = [
  { title: 'Bā (ب)', beginning: 'بـ', middle: 'ـبـ', end: 'ـب', isolated: 'ب', word: 'باب', meaning: 'door' },
  { title: 'Nūn (ن)', beginning: 'نـ', middle: 'ـنـ', end: 'ـن', isolated: 'ن', word: 'نور', meaning: 'light' },
  { title: 'Mīm (م)', beginning: 'مـ', middle: 'ـمـ', end: 'ـم', isolated: 'م', word: 'مسجد', meaning: 'mosque' },
  { title: 'Lām (ل)', beginning: 'لـ', middle: 'ـلـ', end: 'ـل', isolated: 'ل', word: 'كتاب', meaning: 'book' },
  { title: 'Yā (ي)', beginning: 'يـ', middle: 'ـيـ', end: 'ـي', isolated: 'ي', word: 'بيت', meaning: 'house' },
  { title: 'Sīn (س)', beginning: 'سـ', middle: 'ـسـ', end: 'ـس', isolated: 'س', word: 'سلام', meaning: 'peace' }
];

export const SIMPLE_WORDS: SimpleWord[] = [
  { arabic: 'باب', transliteration: 'bāb', meaning: 'door' },
  { arabic: 'كتاب', transliteration: 'kitāb', meaning: 'book' },
  { arabic: 'مسجد', transliteration: 'masjid', meaning: 'mosque' },
  { arabic: 'نور', transliteration: 'nūr', meaning: 'light' },
  { arabic: 'سلام', transliteration: 'salām', meaning: 'peace' }
];
