import { Dua } from '../models/dua.model';

export const DUAS_DATA: Dua[] = [
  {
    id: 'before-eating',
    title: 'Before Eating',
    category: 'food',
    icon: '🍽️',
    occasion: 'Say this before you start eating',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translation: 'In the name of Allah',
    explanation: 'When we say Bismillah before eating, we remember that all our food comes from Allah. It makes our food blessed and keeps Shaytan away from our meal!',
    audioUrl: 'assets/audio/duas/before-eating.mp3'
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
    explanation: 'We thank Allah for the food and drink He gave us. Being grateful is very important in Islam!',
    audioUrl: 'assets/audio/duas/after-eating.mp3'
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
    explanation: 'We remember that only Allah gives us life and takes it. We sleep safely in His care.',
    audioUrl: 'assets/audio/duas/before-sleeping.mp3'
  }
];
