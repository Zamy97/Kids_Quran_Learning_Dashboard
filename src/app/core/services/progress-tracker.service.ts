import { Injectable, signal } from '@angular/core';

export interface UserProgress {
  memorizedSurahs: string[];
  currentSurah: string;
  duasLearned: string[];
  hadithsRead: number[];
  lastActivity: string;
  totalPracticeTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressTrackerService {
  private readonly STORAGE_KEY = 'quran-app-progress';

  private progress = signal<UserProgress>(this.loadProgress());

  readonly userProgress = this.progress.asReadonly();

  private loadProgress(): UserProgress {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getDefaultProgress();
      }
    }
    return this.getDefaultProgress();
  }

  private getDefaultProgress(): UserProgress {
    return {
      memorizedSurahs: [
        'an-nas', 'al-falaq', 'al-ikhlas',
        'al-masad', 'an-nasr', 'al-kafirun', 'al-kawthar',
        'al-maun', 'quraysh', 'al-fil', 'al-asr'
      ],
      currentSurah: '',
      duasLearned: ['before-eating', 'after-eating', 'before-sleeping'],
      hadithsRead: [1, 2],
      lastActivity: new Date().toISOString(),
      totalPracticeTime: 0
    };
  }

  private saveProgress(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.progress()));
  }

  markSurahMemorized(surahId: string): void {
    this.progress.update(p => ({
      ...p,
      memorizedSurahs: [...p.memorizedSurahs, surahId],
      lastActivity: new Date().toISOString()
    }));
    this.saveProgress();
  }

  setCurrentSurah(surahId: string): void {
    this.progress.update(p => ({
      ...p,
      currentSurah: surahId,
      lastActivity: new Date().toISOString()
    }));
    this.saveProgress();
  }

  markDuaLearned(duaId: string): void {
    this.progress.update(p => ({
      ...p,
      duasLearned: [...p.duasLearned, duaId],
      lastActivity: new Date().toISOString()
    }));
    this.saveProgress();
  }

  markHadithRead(hadithId: number): void {
    this.progress.update(p => ({
      ...p,
      hadithsRead: [...p.hadithsRead, hadithId],
      lastActivity: new Date().toISOString()
    }));
    this.saveProgress();
  }

  addPracticeTime(minutes: number): void {
    this.progress.update(p => ({
      ...p,
      totalPracticeTime: p.totalPracticeTime + minutes,
      lastActivity: new Date().toISOString()
    }));
    this.saveProgress();
  }

  getMemorizedCount(): number {
    return this.progress().memorizedSurahs.length;
  }
}
