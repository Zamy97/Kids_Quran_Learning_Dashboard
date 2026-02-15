export interface ArabicLetter {
  /** Isolated form (standalone) – used for display in lists */
  arabic: string;
  name: string;
  sound: string;
  /** Alone (isolated) */
  isolated: string;
  /** Beginning of word (connects to the right) */
  beginning: string;
  /** Middle of word (connects both sides) */
  middle: string;
  /** End of word (connects to the left) */
  end: string;
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
