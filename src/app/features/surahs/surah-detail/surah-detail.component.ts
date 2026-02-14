import { Component, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { AudioPlayerService } from '../../../core/services/audio-player.service';
import { AudioControlsComponent } from '../../../shared/components/audio-controls/audio-controls.component';
import { Surah } from '../../../core/models/surah.model';
import { buildVerseAudioUrls } from '../../../core/utils/verse-audio.utils';
import { Subscription } from 'rxjs';

type ViewMode = 'listen' | 'read';

const VERSE_AUTO_ADVANCE_SEC = 12;

/** Given audio currentTime (sec) and verse start times, return 0-based verse index. */
function getVerseIndexForTime(currentTime: number, verseStartTimes: number[]): number {
  if (!verseStartTimes.length) return 0;
  for (let i = verseStartTimes.length - 1; i >= 0; i--) {
    if (currentTime >= verseStartTimes[i]) return i;
  }
  return 0;
}

@Component({
  selector: 'app-surah-detail',
  standalone: true,
  imports: [AudioControlsComponent],
  template: `
    @if (surah()) {
      <div class="flex flex-col h-[calc(100vh-11rem)] min-h-0 max-w-7xl mx-auto">
        <!-- Minimal top bar -->
        <div class="flex items-center justify-between gap-3 px-3 py-2 flex-shrink-0 bg-white/80 backdrop-blur border-b">
          <button
            (click)="goBack()"
            class="px-3 py-2 rounded-full bg-gray-200 hover:bg-gray-300 font-semibold text-sm"
          >
            ← Back
          </button>
          <span class="text-base md:text-lg font-bold text-primary truncate">
            {{ surah()!.nameAr }} · {{ surah()!.nameEn }}
          </span>
          <div class="flex gap-1">
            <button
              (click)="viewMode.set('listen')"
              [class.bg-primary]="viewMode() === 'listen'"
              [class.text-white]="viewMode() === 'listen'"
              [class.bg-gray-200]="viewMode() !== 'listen'"
              class="px-3 py-1.5 rounded-full font-bold text-xs"
            >
              🎧
            </button>
            <button
              (click)="viewMode.set('read')"
              [class.bg-primary]="viewMode() === 'read'"
              [class.text-white]="viewMode() === 'read'"
              [class.bg-gray-200]="viewMode() !== 'read'"
              class="px-3 py-1.5 rounded-full font-bold text-xs"
            >
              📖
            </button>
          </div>
        </div>

        @if (viewMode() === 'listen') {
          <!-- Big verse display: readable from distance -->
          <div class="flex-1 flex flex-col justify-center items-center px-4 py-6 min-h-0 overflow-auto">
            @if (currentVerse()) {
              <div class="w-full max-w-5xl mx-auto text-center">
                <p class="text-sm md:text-base text-gray-400 mb-4">
                  Verse {{ currentVerse()!.number }} of {{ surah()!.verses }}
                  @if (usePerVerseAudio()) {
                    <span class="block mt-1 text-primary font-medium">Ayah by ayah — Saood ash-Shuraym</span>
                    <div class="flex flex-wrap items-center justify-center gap-2 mt-3">
                      <span class="text-sm font-medium w-full text-center">Play verse:</span>
                      @for (opt of repeatOptions; track opt.value) {
                        <button
                          type="button"
                          (click)="repeatVerseCount.set(opt.value)"
                          [class.bg-primary]="repeatVerseCount() === opt.value"
                          [class.text-white]="repeatVerseCount() === opt.value"
                          class="px-3 py-1.5 rounded-full text-sm font-bold border-2 border-primary transition-colors"
                        >
                          {{ opt.label }}
                        </button>
                      }
                    </div>
                  } @else if (useSyncedVerse()) {
                    <span class="block mt-1 text-primary font-medium">Synced to recitation</span>
                  } @else {
                    <span class="block mt-1">Changes every {{ VERSE_AUTO_ADVANCE_SEC }}s</span>
                  }
                </p>
                <div class="bg-white/90 rounded-3xl shadow-xl p-6 md:p-10 mb-6">
                  <p class="verse-arabic text-primary text-right font-arabic leading-loose mb-6">
                    {{ currentVerse()!.arabic }}
                  </p>
                </div>
                <p class="verse-translation text-gray-800 leading-relaxed max-w-4xl mx-auto mb-8">
                  {{ currentVerse()!.translation }}
                </p>
                <div class="flex gap-4 justify-center">
                  <button
                    (click)="previousVerse()"
                    [disabled]="currentVerseIndex() === 0"
                    class="px-5 py-3 rounded-full bg-primary text-white font-bold disabled:opacity-40 text-lg"
                  >
                    ⏮️ Previous
                  </button>
                  <button
                    (click)="nextVerse()"
                    [disabled]="currentVerseIndex() === surah()!.verses_data.length - 1"
                    class="px-5 py-3 rounded-full bg-primary text-white font-bold disabled:opacity-40 text-lg"
                  >
                    Next ⏭️
                  </button>
                </div>
              </div>
            }
          </div>
        }

        @if (viewMode() === 'read') {
          <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
            @for (verse of surah()!.verses_data; track verse.number) {
              <div class="bg-white p-5 rounded-2xl shadow border-r-4 border-primary">
                <p class="text-2xl md:text-4xl text-primary text-right font-arabic leading-relaxed">
                  {{ verse.arabic }}
                  <span class="inline-block bg-primary text-white w-10 h-10 rounded-full text-center leading-10 text-lg ml-2">{{ verse.number }}</span>
                </p>
                <p class="text-lg md:text-xl text-gray-700 mt-3">{{ verse.translation }}</p>
              </div>
            }
          </div>
        }

        <!-- Audio fixed at bottom -->
        @if (currentAudioUrl()) {
          <div class="flex-shrink-0 w-full mt-auto">
            <app-audio-controls [audioUrl]="currentAudioUrl()!" [autoPlay]="true" [compact]="true" />
          </div>
        }
      </div>
    }
  `,
  styles: [`
    /* Large, distance-readable verse text (scales with viewport) */
    .verse-arabic {
      font-size: clamp(2rem, 5vw + 1.5rem, 4.5rem);
    }
    .verse-translation {
      font-size: clamp(1.25rem, 2.5vw + 0.75rem, 2.25rem);
    }
  `]
})
export class SurahDetailComponent implements OnInit, OnDestroy {
  readonly VERSE_AUTO_ADVANCE_SEC = VERSE_AUTO_ADVANCE_SEC;

  /** 1 = once, 2/3/5 = that many times, 0 = until I skip (infinite). */
  readonly repeatOptions: { value: number; label: string }[] = [
    { value: 1, label: '1 time' },
    { value: 2, label: '2 times' },
    { value: 3, label: '3 times' },
    { value: 5, label: '5 times' },
    { value: 0, label: 'Until I skip' },
  ];

  surah = signal<Surah | null>(null);
  viewMode = signal<ViewMode>('listen');
  /** 1 = play once then advance; 2,3,5 = that many times; 0 = repeat until user skips. */
  repeatVerseCount = signal(1);
  /** How many times the current verse has played this round (reset on verse change). */
  private playsThisVerse = signal(0);
  /** Used when verseAudioBaseUrl is set (ayah-by-ayah playback). */
  private verseIndexByAyah = signal(0);
  /** Only used when no verse timings and no verseAudioBaseUrl (timer mode). */
  private verseIndexByTimer = signal(0);

  private verseTimer: ReturnType<typeof setInterval> | null = null;
  private endedSub: Subscription | null = null;

  /** Per-verse MP3 URLs (EveryAyah style). Empty when not using verse-by-verse. */
  private verseAudioUrls = computed(() => {
    const s = this.surah();
    return s ? buildVerseAudioUrls(s) : [];
  });

  /** True when using ayah-by-ayah (one MP3 per verse). */
  usePerVerseAudio = computed(() => this.verseAudioUrls().length > 0);

  /** True when we have verse timings (full file) and display is synced to audio. */
  useSyncedVerse = computed(() => {
    const s = this.surah();
    return !!s?.verseStartTimes?.length && !this.usePerVerseAudio();
  });

  /** Displayed verse index: from ayah index, or audio time when synced, else from timer. */
  currentVerseIndex = computed(() => {
    const s = this.surah();
    if (!s) return 0;
    if (this.usePerVerseAudio()) return this.verseIndexByAyah();
    const times = s.verseStartTimes;
    if (times?.length) {
      const t = this.audioService.state().currentTime;
      return getVerseIndexForTime(t, times);
    }
    return this.verseIndexByTimer();
  });

  /** URL passed to audio controls: current verse MP3 or full surah. */
  currentAudioUrl = computed(() => {
    const s = this.surah();
    if (!s) return undefined;
    const urls = this.verseAudioUrls();
    if (urls.length) return urls[this.currentVerseIndex()];
    return s.audioUrl;
  });

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
    const s = this.surah();
    const useAyah = s && buildVerseAudioUrls(s).length > 0;
    if (!useAyah && !s?.verseStartTimes?.length) {
      this.startVerseAutoAdvance();
    }
    this.endedSub = this.audioService.onEnded.subscribe(() => this.onAudioEnded());
  }

  private onAudioEnded(): void {
    if (this.usePerVerseAudio()) {
      const count = this.repeatVerseCount();
      const completedPlays = this.playsThisVerse() + 1; // we just finished one play
      const shouldReplay = count === 0 || completedPlays < count;
      if (shouldReplay) {
        this.playsThisVerse.set(completedPlays);
        const url = this.currentAudioUrl();
        if (url) this.audioService.loadAudio(url, { autoPlay: true });
      } else {
        this.playsThisVerse.set(0);
        const s = this.surah();
        if (!s) return;
        const n = s.verses_data.length;
        const next = (this.verseIndexByAyah() + 1) % n;
        this.verseIndexByAyah.set(next);
      }
    } else {
      this.loopSurahAudio();
    }
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
      const next = this.verseIndexByTimer() + 1;
      if (next < s.verses_data.length) {
        this.verseIndexByTimer.set(next);
      } else {
        this.verseIndexByTimer.set(0);
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
    const s = this.surah();
    const idx = this.currentVerseIndex();
    if (!s || idx === 0) return;
    const newIdx = idx - 1;
    if (this.usePerVerseAudio()) {
      this.playsThisVerse.set(0);
      this.verseIndexByAyah.set(newIdx);
    } else if (s.verseStartTimes?.length) {
      this.audioService.seek(s.verseStartTimes[newIdx]);
    } else {
      this.verseIndexByTimer.set(newIdx);
    }
  }

  nextVerse(): void {
    const s = this.surah();
    const idx = this.currentVerseIndex();
    if (!s || idx >= s.verses_data.length - 1) return;
    const newIdx = idx + 1;
    if (this.usePerVerseAudio()) {
      this.playsThisVerse.set(0);
      this.verseIndexByAyah.set(newIdx);
    } else if (s.verseStartTimes?.length) {
      this.audioService.seek(s.verseStartTimes[newIdx]);
    } else {
      this.verseIndexByTimer.set(newIdx);
    }
  }
}
