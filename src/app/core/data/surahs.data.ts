import { Surah } from '../models/surah.model';

export const SURAHS_DATA: Surah[] = [
  {
    id: 'al-fatiha',
    number: 1,
    nameAr: 'الفاتحة',
    nameEn: 'Al-Fatiha',
    meaning: 'The Opening',
    verses: 7,
    revelation: 'Makkah',
    memorized: true,
    story: 'Al-Fatiha is the first chapter of the Quran and is recited in every unit of prayer. It was revealed in Makkah and is also called "The Opening" because it opens the Book of Allah. The Prophet ﷺ said it is "the greatest surah in the Quran." This beautiful surah teaches us how to praise Allah, ask for His guidance, and seek His help.',
    audioUrl: 'assets/audio/surahs/al-fatiha.mp3',
    verseStartTimes: [0, 5, 10, 16, 23, 31, 40],
    verseAudioBaseUrl: 'https://everyayah.com/data/Saood_ash-Shuraym_128kbps',
    verses_data: [
      { number: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Most Gracious, the Most Merciful' },
      { number: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: 'All praise is due to Allah, Lord of all the worlds' },
      { number: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', translation: 'The Most Gracious, the Most Merciful' },
      { number: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Master of the Day of Judgment' },
      { number: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'You alone we worship, and You alone we ask for help' },
      { number: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translation: 'Guide us on the Straight Path' },
      { number: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', translation: 'The path of those who have received Your grace; not the path of those who have brought down wrath upon themselves, nor of those who have gone astray' }
    ]
  },
  {
    id: 'al-humazah',
    number: 104,
    nameAr: 'الهُمَزة',
    nameEn: 'Al-Humazah',
    meaning: 'The Backbiter',
    verses: 9,
    revelation: 'Makkah',
    memorized: false,
    story: 'Surah Al-Humazah was revealed in Makkah. It warns against backbiting, gossiping, and being proud of wealth. Allah tells us that people who mock others and collect money greedily will face serious consequences. This surah teaches us to be kind in our speech, not to make fun of others, and to remember that our wealth cannot save us from Allah\'s punishment if we do wrong things.',
    audioUrl: 'assets/audio/surahs/al-humazah.mp3',
    verseStartTimes: [0, 4, 8, 12, 16, 20, 24, 28, 32],
    verseAudioBaseUrl: 'https://everyayah.com/data/Saood_ash-Shuraym_128kbps',
    verses_data: [
      { number: 1, arabic: 'وَيْلٌ لِكُلِّ هُمَزَةٍ لُمَزَةٍ', translation: 'Woe to every backbiter, slanderer' },
      { number: 2, arabic: 'الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ', translation: 'Who amasses wealth and counts it over' },
      { number: 3, arabic: 'يَحْسَبُ أَنَّ مَالَهُ أَخْلَدَهُ', translation: 'Thinking that his wealth will make him last forever' },
      { number: 4, arabic: 'كَلَّا ۖ لَيُنْبَذَنَّ فِي الْحُطَمَةِ', translation: 'No! He will surely be thrown into the Crusher' },
      { number: 5, arabic: 'وَمَا أَدْرَاكَ مَا الْحُطَمَةُ', translation: 'And what can make you know what the Crusher is?' },
      { number: 6, arabic: 'نَارُ اللَّهِ الْمُوقَدَةُ', translation: 'It is the fire of Allah, [eternally] fueled' },
      { number: 7, arabic: 'الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ', translation: 'Which mounts directed at the hearts' },
      { number: 8, arabic: 'إِنَّهَا عَلَيْهِمْ مُؤْصَدَةٌ', translation: 'Indeed, it will be closed over them' },
      { number: 9, arabic: 'فِي عَمَدٍ مُّمَدَّدَةٍ', translation: 'In extended columns' }
    ]
  }
];
