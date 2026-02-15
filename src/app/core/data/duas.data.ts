import { Dua } from '../models/dua.model';

export const DUAS_DATA: Dua[] = [
  // —— Daily ——
  {
    id: 'waking-up',
    title: 'When Waking Up',
    category: 'daily',
    icon: '☀️',
    occasion: 'Say this when you wake up in the morning',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: "Alhamdulillahi alladhi ahvana ba'da ma amatana wa ilayhin-nushur",
    translation: 'Praise be to Allah who gave us life after He gave us death, and to Him is the resurrection',
    explanation: 'We thank Allah for another day of life. Every morning is a new gift from Him!'
  },
  {
    id: 'before-sleeping',
    title: 'Before Sleeping',
    category: 'daily',
    icon: '🌙',
    occasion: 'Say this when you go to bed',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translation: 'In Your name, O Allah, I die and I live',
    explanation: 'We remember that only Allah gives us life and takes it. We sleep safely in His care.'
  },
  {
    id: 'entering-bathroom',
    title: 'Before Entering Bathroom',
    category: 'daily',
    icon: '🚽',
    occasion: 'Say this before entering the bathroom',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبْثِ وَالْخَبَائِثِ',
    transliteration: "Allahumma inni a'udhu bika min al-khubthi wal-khaba'ith",
    translation: 'O Allah, I seek refuge in You from male and female evil spirits',
    explanation: 'We ask Allah to protect us from harm and to keep us clean in body and heart.'
  },
  {
    id: 'leaving-bathroom',
    title: 'After Leaving Bathroom',
    category: 'daily',
    icon: '✨',
    occasion: 'Say this when you come out of the bathroom',
    arabic: 'غُفْرَانَكَ',
    transliteration: 'Ghufranak',
    translation: 'I seek Your forgiveness',
    explanation: 'We ask Allah to forgive us and to bless us with purity.'
  },
  {
    id: 'entering-home',
    title: 'When Entering Home',
    category: 'daily',
    icon: '🏠',
    occasion: 'Say this when you enter your home',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    transliteration: 'Bismillahi walajna wa bismillahi kharajna wa ala Allahi rabbina tawakkalna',
    translation: 'In the name of Allah we enter and in the name of Allah we leave, and upon our Lord we rely',
    explanation: 'We remember Allah when we enter our home so that He blesses it and keeps us safe.'
  },
  {
    id: 'leaving-home',
    title: 'When Leaving Home',
    category: 'daily',
    icon: '🚪',
    occasion: 'Say this when you leave the house',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillahi tawakkaltu ala Allahi wa la hawla wa la quwwata illa billah',
    translation: 'In the name of Allah I place my trust in Allah, and there is no power or strength except with Allah',
    explanation: 'We ask Allah to protect us whenever we go out and to bring us back safely.'
  },
  {
    id: 'wearing-new-clothes',
    title: 'When Wearing New Clothes',
    category: 'daily',
    icon: '👕',
    occasion: 'Say this when you put on new clothes',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: "Alhamdulillahi alladhi kasani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
    translation: 'Praise be to Allah who has clothed me with this and provided it for me without any might or power from myself',
    explanation: 'We thank Allah for the blessing of clothes and remember that all good things come from Him.'
  },
  {
    id: 'looking-in-mirror',
    title: 'When Looking in the Mirror',
    category: 'daily',
    icon: '🪞',
    occasion: 'Say this when you look in the mirror',
    arabic: 'اللَّهُمَّ أَحْسَنْتَ خَلْقِي فَحَسِّنْ خُلُقِي',
    transliteration: 'Allahumma ahsanta khalqi fa hassin khuluqi',
    translation: 'O Allah, as You have made my creation good, make my character good too',
    explanation: 'We ask Allah to make our inside as beautiful as He made our outside—by having good manners and a good heart.'
  },
  // —— Food ——
  {
    id: 'before-eating',
    title: 'Before Eating',
    category: 'food',
    icon: '🍽️',
    occasion: 'Say this before you start eating',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah',
    explanation: 'When we say Bismillah before eating, we remember that all our food comes from Allah. It makes our food blessed and keeps Shaytan away from our meal!'
  },
  {
    id: 'after-eating',
    title: 'After Eating',
    category: 'food',
    icon: '🙏',
    occasion: 'Say this when you finish eating',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي وَسَقَانِي',
    transliteration: "Alhamdulillahi alladhi at'amani wa saqani",
    translation: 'Praise be to Allah who has fed me and given me drink',
    explanation: 'We thank Allah for the food and drink He gave us. Being grateful is very important in Islam!'
  },
  {
    id: 'before-drinking-milk',
    title: 'Before Drinking Milk',
    category: 'food',
    icon: '🥛',
    occasion: 'Say this when you drink milk',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ',
    transliteration: 'Allahumma barik lana fihi wa zidna minhu',
    translation: 'O Allah, bless it for us and give us more of it',
    explanation: 'The Prophet ﷺ taught us this dua when drinking milk. We ask Allah to make it beneficial and to provide for us.'
  },
  // —— Travel ——
  {
    id: 'starting-journey',
    title: 'When Starting a Journey',
    category: 'travel',
    icon: '🛣️',
    occasion: 'Say this when you begin a trip',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: "Subhanalladhi sakhkhara lana hadha wa ma kunna lahu muqrinin wa inna ila rabbina lamunqalibun",
    translation: 'Glory to Him who has subjected this to us, and we could not have done it by ourselves. And indeed to our Lord we will return',
    explanation: 'We thank Allah for the car, bus, or plane that takes us places and remember that we will return to Him one day.'
  },
  {
    id: 'travel-supplication',
    title: 'Travel Supplication',
    category: 'travel',
    icon: '✈️',
    occasion: 'Say this when you travel',
    arabic: 'اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ',
    transliteration: "Allahumma hawwin alayna safarana hadha watwi anna bu'dahu",
    translation: 'O Allah, make this journey easy for us and shorten its distance for us',
    explanation: 'We ask Allah to make our trip easy, safe, and not too tiring.'
  },
  {
    id: 'returning-from-travel',
    title: 'When Returning Home from Travel',
    category: 'travel',
    icon: '🏡',
    occasion: 'Say this when you come back from a trip',
    arabic: 'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ',
    transliteration: 'Ahibuna taibuna abiduna li rabbina hamidun',
    translation: 'We return, we repent, we worship, and we praise our Lord',
    explanation: 'We thank Allah for a safe return and remember that we worship Him wherever we go.'
  },
  // —— Special (Masjid, nature, family, etc.) ——
  {
    id: 'entering-masjid',
    title: 'When Entering the Masjid',
    category: 'special',
    icon: '🕌',
    occasion: 'Say this when you enter the mosque',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: 'Allahumma aftah li abwaba rahmatik',
    translation: 'O Allah, open for me the doors of Your mercy',
    explanation: 'We ask Allah to bless our time in the masjid and to accept our worship.'
  },
  {
    id: 'leaving-masjid',
    title: 'When Leaving the Masjid',
    category: 'special',
    icon: '🕌',
    occasion: 'Say this when you leave the mosque',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    transliteration: 'Allahumma inni asaluka min fadlik',
    translation: 'O Allah, I ask You from Your bounty',
    explanation: 'We ask Allah to reward us for coming to the masjid and to keep us close to Him.'
  },
  {
    id: 'hearing-thunder',
    title: 'When Hearing Thunder',
    category: 'special',
    icon: '⛈️',
    occasion: 'Say this when you hear thunder',
    arabic: 'سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ',
    transliteration: 'Subhanalladhi yusabbihu ar-radu bihamdihi wal-malaikatu min khifatih',
    translation: 'Glory be to Him whom thunder glorifies with His praise, and so do the angels out of fear of Him',
    explanation: 'We remember that thunder and everything in the sky glorify Allah. He is the Most Powerful.'
  },
  {
    id: 'when-it-rains',
    title: 'When It Rains',
    category: 'special',
    icon: '🌧️',
    occasion: 'Say this when rain falls',
    arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
    transliteration: 'Allahumma sayyiban nafia',
    translation: 'O Allah, let it be a beneficial rain',
    explanation: 'We ask Allah to make the rain good for the earth, the animals, and the people.'
  },
  {
    id: 'dua-for-parents',
    title: 'Dua for Parents',
    category: 'special',
    icon: '❤️',
    occasion: 'Say this to ask Allah to bless your parents',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbir hamhuma kama rabbayanee sagheera',
    translation: 'My Lord, have mercy upon them as they brought me up when I was small',
    explanation: 'We ask Allah to be kind to our parents and to reward them for taking care of us when we were little.'
  },
  {
    id: 'when-in-difficulty',
    title: 'When in Difficulty',
    category: 'special',
    icon: '🤲',
    occasion: 'Say this when something is hard or you feel worried',
    arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin',
    translation: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers',
    explanation: 'This is the dua of Prophet Yunus (Jonah) when he was in difficulty. Allah answered him, and He can answer us too when we call on Him.'
  },
  {
    id: 'seeking-knowledge',
    title: 'Before Studying / Seeking Knowledge',
    category: 'special',
    icon: '📚',
    occasion: 'Say this when you sit down to learn or read',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni ilma',
    translation: 'My Lord, increase me in knowledge',
    explanation: 'We ask Allah to help us learn and understand. He loves those who seek knowledge!'
  },
  {
    id: 'after-sneezing',
    title: 'After Sneezing',
    category: 'daily',
    icon: '🤧',
    occasion: 'Say this after you sneeze (the one who sneezed)',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    translation: 'Praise be to Allah',
    explanation: 'We thank Allah for our health. When someone else sneezes and says this, we reply: Yarhamukallah (May Allah have mercy on you).'
  },
  {
    id: 'replying-to-sneezer',
    title: 'Reply to Someone Who Sneezed',
    category: 'daily',
    icon: '💚',
    occasion: 'Say this when someone sneezes and says Alhamdulillah',
    arabic: 'يَرْحَمُكَ اللَّهُ',
    transliteration: 'Yarhamukallah',
    translation: 'May Allah have mercy on you',
    explanation: 'We make a kind dua for the person who sneezed. They can then reply: Yahdikumullah (May Allah guide you).'
  }
];
