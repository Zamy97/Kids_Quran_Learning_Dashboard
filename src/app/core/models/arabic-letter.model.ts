export interface ArabicLetter {
  arabic: string;
  name: string;
  sound: string;
}

export interface JoiningExample {
  title: string;
  beginning: string;
  middle: string;
  end: string;
  isolated: string;
  word: string;
  meaning: string;
}

export interface SimpleWord {
  arabic: string;
  transliteration: string;
  meaning: string;
}
