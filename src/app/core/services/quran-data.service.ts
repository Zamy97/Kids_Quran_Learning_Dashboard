import { Injectable, signal } from '@angular/core';
import { Surah } from '../models/surah.model';
import { Dua } from '../models/dua.model';
import { Hadith } from '../models/hadith.model';
import { SURAHS_DATA } from '../data/surahs.data';
import { DUAS_DATA } from '../data/duas.data';
import { HADITHS_DATA } from '../data/hadiths.data';

@Injectable({
  providedIn: 'root'
})
export class QuranDataService {
  private surahs = signal<Surah[]>(SURAHS_DATA);
  private duas = signal<Dua[]>(DUAS_DATA);
  private hadiths = signal<Hadith[]>(HADITHS_DATA);

  readonly surahsList = this.surahs.asReadonly();
  readonly duasList = this.duas.asReadonly();
  readonly hadithsList = this.hadiths.asReadonly();

  getSurahById(id: string): Surah | undefined {
    return this.surahs().find(s => s.id === id);
  }

  getMemorizedSurahs(): Surah[] {
    return this.surahs().filter(s => s.memorized);
  }

  toggleMemorized(surahId: string): void {
    this.surahs.update(surahs =>
      surahs.map(s =>
        s.id === surahId ? { ...s, memorized: !s.memorized } : s
      )
    );
  }

  searchSurahs(query: string): Surah[] {
    const lowerQuery = query.toLowerCase();
    return this.surahs().filter(s =>
      s.nameEn.toLowerCase().includes(lowerQuery) ||
      s.nameAr.includes(query) ||
      s.meaning.toLowerCase().includes(lowerQuery)
    );
  }

  getDuaById(id: string): Dua | undefined {
    return this.duas().find(d => d.id === id);
  }

  getDuasByCategory(category: string): Dua[] {
    if (category === 'all') return this.duas();
    return this.duas().filter(d => d.category === category);
  }

  getHadithById(id: number): Hadith | undefined {
    return this.hadiths().find(h => h.id === id);
  }

  getTodaysHadith(): Hadith {
    const today = new Date().toISOString().split('T')[0];
    const hadith = this.hadiths().find(h => h.date === today);
    return hadith ?? this.hadiths()[0];
  }
}
