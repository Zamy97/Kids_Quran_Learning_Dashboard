import { Component, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { AudioPlayerService } from '../../../core/services/audio-player.service';
import { AudioControlsComponent } from '../../../shared/components/audio-controls/audio-controls.component';
import { Surah } from '../../../core/models/surah.model';
import { buildVerseAudioUrls } from '../../../core/utils/verse-audio.utils';
import { Subscription } from 'rxjs';

type ViewMode = 'listen' | 'read';

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
      <div class="flex flex-col h-full min-h-0 max-w-7xl mx-auto w-full">
        <!-- Minimal top bar -->
        <div class="flex items-center justify-between gap-2 px-2 py-1.5 flex-shrink-0 bg-white/80 backdrop-blur border-b">
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
          <!-- Full-screen verse: no scroll, Arabic as large as possible -->
          <div class="flex-1 flex flex-col justify-center items-center px-3 py-2 min-h-0 overflow-hidden">
            @if (currentVerse()) {
              <div class="w-full h-full flex flex-col justify-center items-center text-center max-w-6xl mx-auto">
                <p class="text-xs text-gray-400 mb-1 shrink-0">
                  Verse {{ currentVerse()!.number }} of {{ surah()!.verses }}
                  @if (usePerVerseAudio()) {
                    <span class="ml-2 text-primary">·</span>
                    @for (opt of repeatOptions; track opt.value) {
                      <button
                        type="button"
                        (click)="setRepeat(opt.value)"
                        [class.bg-primary]="repeatVerseCount() === opt.value"
                        [class.text-white]="repeatVerseCount() === opt.value"
                        class="ml-1 px-2 py-0.5 rounded-full text-xs font-bold border border-primary"
                      >
                        {{ opt.label }}
                      </button>
                    }
                    <span class="ml-2 inline-flex items-center gap-1">
                      <label class="text-xs text-gray-500">or</label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        [value]="customRepeatInput()"
                        (input)="onCustomRepeatInput($event)"
                        class="w-12 px-1.5 py-0.5 rounded border border-primary text-xs font-bold text-center"
                      />
                      <span class="text-xs text-gray-500">times</span>
                    </span>
                  } @else if (useSyncedVerse()) {
                    <span class="ml-2 text-primary">Synced</span>
                  }
                </p>
                <div class="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 flex-1 min-h-0 flex flex-col justify-center w-full">
                  <p class="verse-arabic text-primary text-right font-arabic leading-tight mb-2">
                    {{ currentVerse()!.arabic }}
                  </p>
                </div>
                <p class="verse-translation text-gray-700 leading-snug max-w-4xl mx-auto mt-2 shrink-0">
                  {{ currentVerse()!.translation }}
                </p>
                <div class="flex gap-2 mt-2 shrink-0">
                  <button
                    (click)="previousVerse()"
                    [disabled]="currentVerseIndex() === 0"
                    class="px-4 py-2 rounded-full bg-primary text-white font-bold disabled:opacity-40 text-sm"
                  >
                    ⏮️
                  </button>
                  <button
                    (click)="nextVerse()"
                    [disabled]="currentVerseIndex() === surah()!.verses_data.length - 1"
                    class="px-4 py-2 rounded-full bg-primary text-white font-bold disabled:opacity-40 text-sm"
                  >
                    ⏭️
                  </button>
                </div>
              </div>
            }
          </div>
        }

        @if (viewMode() === 'read') {
          <div class="flex-1 flex flex-col justify-center items-center px-4 py-2 min-h-0 overflow-hidden">
            @if (readVerse()) {
              <div class="w-full max-w-4xl mx-auto flex flex-col justify-center items-center text-center">
                <p class="text-xs text-gray-400 mb-1 shrink-0">
                  Verse {{ readVerse()!.number }} of {{ surah()!.verses }}
                </p>
                <div class="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6 w-full flex flex-col justify-center min-h-0">
                  <p class="text-primary text-right font-arabic leading-relaxed read-verse-arabic">
                    {{ readVerse()!.arabic }}
                    <span class="inline-block bg-primary text-white rounded-full text-center read-verse-num ml-2">{{ readVerse()!.number }}</span>
                  </p>
                </div>
                <p class="text-gray-700 leading-snug mt-2 read-verse-translation">{{ readVerse()!.translation }}</p>
                <div class="flex gap-2 mt-2 shrink-0">
                  <button
                    (click)="previousReadVerse()"
                    [disabled]="readVerseIndex() === 0"
                    class="px-4 py-2 rounded-full bg-primary text-white font-bold disabled:opacity-40 text-sm"
                  >⏮️</button>
                  <button
                    (click)="nextReadVerse()"
                    [disabled]="readVerseIndex() === surah()!.verses_data.length - 1"
                    class="px-4 py-2 rounded-full bg-primary text-white font-bold disabled:opacity-40 text-sm"
                  >⏭️</button>
                </div>
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
    :host { display: block; height: 100%; min-height: 0; }
    .verse-arabic { font-size: clamp(2.5rem, 14vmin, 8rem); line-height: 1.3; }
    .verse-translation { font-size: clamp(0.95rem, 2.2vmin, 1.35rem); }
    .read-verse-arabic { font-size: clamp(1.5rem, 8vmin, 5rem); line-height: 1.4; }
    .read-verse-num { width: clamp(2rem, 6vmin, 3rem); height: clamp(2rem, 6vmin, 3rem); line-height: clamp(2rem, 6vmin, 3rem); font-size: clamp(0.875rem, 2.5vmin, 1.25rem); }
    .read-verse-translation { font-size: clamp(0.875rem, 2.2vmin, 1.35rem); }
  `]
})
export class SurahDetailComponent implements OnInit, OnDestroy {
  /** 1 = once, 5 = five times, 0 = until I skip; any other positive = custom count. */
  readonly repeatOptions: { value: number; label: string }[] = [
    { value: 1, label: '1 time' },
    { value: 5, label: '5 times' },
    { value: 0, label: 'Until I skip' },
  ];

  surah = signal<Surah | null>(null);
  viewMode = signal<ViewMode>('listen');
  /** 1 = once; 5 = five times; 0 = until skip; any positive N = repeat N times (including custom). */
  repeatVerseCount = signal(1);

  /** Value to show in the custom repeat input (empty when preset 0 is selected). */
  customRepeatInput = computed(() => {
    const n = this.repeatVerseCount();
    return n >= 1 && n <= 99 ? n : '';
  });
  /** How many times the current verse has played this round (reset on verse change). */
  private playsThisVerse = signal(0);
  /** Used when verseAudioBaseUrl is set (ayah-by-ayah playback). */
  private verseIndexByAyah = signal(0);
  /** Read mode: which verse is shown (one verse per screen, no scroll). */
  readVerseIndex = signal(0);

  private endedSub: Subscription | null = null;

  /** Verse shown in read mode (one at a time). */
  readVerse = computed(() => {
    const s = this.surah();
    const idx = this.readVerseIndex();
    return s ? s.verses_data[idx] ?? null : null;
  });

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

  /** Displayed verse index: from ayah index, or audio time when synced, else 0. */
  currentVerseIndex = computed(() => {
    const s = this.surah();
    if (!s) return 0;
    if (this.usePerVerseAudio()) return this.verseIndexByAyah();
    const times = s.verseStartTimes;
    if (times?.length) {
      const t = this.audioService.state().currentTime;
      return getVerseIndexForTime(t, times);
    }
    return 0;
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
    this.endedSub?.unsubscribe();
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
    }
  }

  previousReadVerse(): void {
    const idx = this.readVerseIndex();
    if (idx > 0) this.readVerseIndex.set(idx - 1);
  }

  nextReadVerse(): void {
    const s = this.surah();
    const idx = this.readVerseIndex();
    if (s && idx < s.verses_data.length - 1) this.readVerseIndex.set(idx + 1);
  }

  setRepeat(value: number): void {
    this.repeatVerseCount.set(value);
  }

  onCustomRepeatInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const n = parseInt(input.value, 10);
    if (!Number.isNaN(n)) {
      const clamped = Math.min(99, Math.max(1, n));
      this.repeatVerseCount.set(clamped);
    }
  }
}
