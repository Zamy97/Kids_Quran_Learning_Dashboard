import { Component, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { AudioPlayerService } from '../../../core/services/audio-player.service';
import { AudioControlsComponent } from '../../../shared/components/audio-controls/audio-controls.component';
import { Surah } from '../../../core/models/surah.model';
import { Subscription } from 'rxjs';

type ViewMode = 'listen' | 'read';

const VERSE_AUTO_ADVANCE_SEC = 12;

@Component({
  selector: 'app-surah-detail',
  standalone: true,
  imports: [AudioControlsComponent],
  template: `
    @if (surah()) {
      <div class="max-w-6xl mx-auto px-4 py-4 flex flex-col min-h-[calc(100vh-12rem)]">
        <div class="flex items-center justify-between gap-4 mb-4 flex-shrink-0">
          <button
            (click)="goBack()"
            class="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors font-semibold"
          >
            ← Back
          </button>
          <h2 class="text-xl md:text-2xl font-bold text-primary truncate">
            {{ surah()!.nameAr }} · {{ surah()!.nameEn }}
          </h2>
          <div class="flex gap-2">
            <button
              (click)="viewMode.set('listen')"
              [class.bg-primary]="viewMode() === 'listen'"
              [class.text-white]="viewMode() === 'listen'"
              [class.bg-gray-200]="viewMode() !== 'listen'"
              class="px-4 py-2 rounded-full font-bold text-sm transition-all"
            >
              🎧 Listen
            </button>
            <button
              (click)="viewMode.set('read')"
              [class.bg-primary]="viewMode() === 'read'"
              [class.text-white]="viewMode() === 'read'"
              [class.bg-gray-200]="viewMode() !== 'read'"
              class="px-4 py-2 rounded-full font-bold text-sm transition-all"
            >
              📖 Read
            </button>
          </div>
        </div>

        <details class="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-l-4 border-accent mb-4 flex-shrink-0">
          <summary class="p-3 cursor-pointer font-semibold text-primary">📖 Story & background</summary>
          <p class="text-gray-700 text-sm leading-relaxed px-4 pb-4">{{ surah()!.story }}</p>
        </details>

        @if (surah()!.audioUrl) {
          <div class="mb-4 flex-shrink-0">
            <app-audio-controls [audioUrl]="surah()!.audioUrl" [autoPlay]="true" />
          </div>
        }

        @if (viewMode() === 'listen') {
          <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg text-center flex-1 flex flex-col justify-center min-h-0">
            <p class="text-sm text-gray-500 mb-2">Verse {{ currentVerseIndex() + 1 }} of {{ surah()!.verses }} · changes every {{ VERSE_AUTO_ADVANCE_SEC }}s</p>
            @if (currentVerse()) {
              <div class="max-w-3xl mx-auto">
                <div class="text-3xl md:text-5xl text-primary mb-4 leading-relaxed text-right font-arabic p-4 bg-gray-50 rounded-2xl">
                  {{ currentVerse()!.arabic }}
                </div>
                <div class="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                  {{ currentVerse()!.translation }}
                </div>
                <div class="flex gap-3 justify-center">
                  <button
                    (click)="previousVerse()"
                    [disabled]="currentVerseIndex() === 0"
                    class="px-4 py-2 bg-primary text-white rounded-full font-semibold disabled:opacity-50"
                  >
                    ⏮️
                  </button>
                  <button
                    (click)="nextVerse()"
                    [disabled]="currentVerseIndex() === surah()!.verses_data.length - 1"
                    class="px-4 py-2 bg-primary text-white rounded-full font-semibold disabled:opacity-50"
                  >
                    ⏭️
                  </button>
                </div>
              </div>
            }
          </div>
        }

        @if (viewMode() === 'read') {
          <div class="space-y-3 overflow-y-auto flex-1 min-h-0">
            @for (verse of surah()!.verses_data; track verse.number) {
              <div class="bg-white p-4 rounded-xl shadow border-r-4 border-primary">
                <div class="text-2xl md:text-3xl text-primary text-right font-arabic leading-relaxed">
                  {{ verse.arabic }}
                  <span class="inline-block bg-primary text-white w-8 h-8 rounded-full text-center leading-8 text-sm ml-2">{{ verse.number }}</span>
                </div>
                <div class="text-base md:text-lg text-gray-700 mt-2">{{ verse.translation }}</div>
              </div>
            }
          </div>
        }
      </div>
    }
  `
})
export class SurahDetailComponent implements OnInit, OnDestroy {
  readonly VERSE_AUTO_ADVANCE_SEC = VERSE_AUTO_ADVANCE_SEC;

  surah = signal<Surah | null>(null);
  viewMode = signal<ViewMode>('listen');
  currentVerseIndex = signal(0);

  private verseTimer: ReturnType<typeof setInterval> | null = null;
  private endedSub: Subscription | null = null;

  currentVerse = computed(() => {
    const s = this.surah();
    const index = this.currentVerseIndex();
    return s ? s.verses_data[index] ?? null : null;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quranService: QuranDataService,
    private audioService: AudioPlayerService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const surah = this.quranService.getSurahById(id);
      if (surah) {
        this.surah.set(surah);
      }
    }
    this.startVerseAutoAdvance();
    this.endedSub = this.audioService.onEnded.subscribe(() => this.loopSurahAudio());
  }

  ngOnDestroy(): void {
    this.stopVerseAutoAdvance();
    this.endedSub?.unsubscribe();
  }

  private startVerseAutoAdvance(): void {
    this.stopVerseAutoAdvance();
    this.verseTimer = setInterval(() => {
      if (this.viewMode() !== 'listen') return;
      const s = this.surah();
      if (!s) return;
      const next = this.currentVerseIndex() + 1;
      if (next < s.verses_data.length) {
        this.currentVerseIndex.set(next);
      } else {
        this.currentVerseIndex.set(0);
      }
    }, VERSE_AUTO_ADVANCE_SEC * 1000);
  }

  private stopVerseAutoAdvance(): void {
    if (this.verseTimer) {
      clearInterval(this.verseTimer);
      this.verseTimer = null;
    }
  }

  private loopSurahAudio(): void {
    this.audioService.seek(0);
    this.audioService.play();
  }

  goBack(): void {
    this.router.navigate(['/surahs']);
  }

  previousVerse(): void {
    if (this.currentVerseIndex() > 0) {
      this.currentVerseIndex.update(i => i - 1);
    }
  }

  nextVerse(): void {
    const s = this.surah();
    if (s && this.currentVerseIndex() < s.verses_data.length - 1) {
      this.currentVerseIndex.update(i => i + 1);
    }
  }
}
