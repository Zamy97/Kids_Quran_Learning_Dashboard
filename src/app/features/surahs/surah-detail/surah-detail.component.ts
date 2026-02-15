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
      <div class="flex flex-col h-[calc(100vh-5.5rem)] min-h-0 max-w-7xl mx-auto">
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
                        (click)="repeatVerseCount.set(opt.value)"
                        [class.bg-primary]="repeatVerseCount() === opt.value"
                        [class.text-white]="repeatVerseCount() === opt.value"
                        class="ml-1 px-2 py-0.5 rounded-full text-xs font-bold border border-primary"
                      >
                        {{ opt.label }}
                      </button>
                    }
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
    /* As large as possible without scrolling; viewport-based */
    .verse-arabic {
      font-size: clamp(2.5rem, 14vmin, 8rem);
      line-height: 1.3;
    }
    .verse-translation {
      font-size: clamp(0.95rem, 2.2vmin, 1.35rem);
    }
  `]
})
export class SurahDetailComponent implements OnInit, OnDestroy {
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
}
