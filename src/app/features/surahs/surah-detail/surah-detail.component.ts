import { Component, OnInit, OnDestroy, computed, signal, effect, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { AudioPlayerService } from '../../../core/services/audio-player.service';
import { ProgressTrackerService } from '../../../core/services/progress-tracker.service';
import { WakeLockService } from '../../../core/services/wake-lock.service';
import { AudioControlsComponent } from '../../../shared/components/audio-controls/audio-controls.component';
import { Surah } from '../../../core/models/surah.model';
import { buildVerseAudioUrls } from '../../../core/utils/verse-audio.utils';
import { Subscription } from 'rxjs';

type ViewMode = 'listen' | 'read' | 'everyAyah';

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
      <div class="flex flex-col h-full min-h-0 max-w-7xl mx-auto w-full overflow-hidden">
        <!-- Minimal top bar -->
        <div class="flex items-center justify-between gap-2 px-2 py-1.5 flex-shrink-0 bg-white/80 dark:bg-gray-800/90 backdrop-blur border-b dark:border-gray-700">
          <button
            (click)="goBack()"
            class="px-3 py-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold text-sm text-gray-900 dark:text-gray-100"
          >
            ← Back
          </button>
          <span class="text-base md:text-lg font-bold text-primary truncate">
            {{ surah()!.nameAr }} · {{ surah()!.nameEn }}
          </span>
          <div class="flex gap-1 flex-wrap justify-end">
            <button
              (click)="viewMode.set('listen')"
              [class.bg-primary]="viewMode() === 'listen'"
              [class.text-white]="viewMode() === 'listen'"
              [class.bg-gray-200]="viewMode() !== 'listen'"
              [class.dark:bg-gray-600]="viewMode() !== 'listen'"
              class="px-3 py-1.5 rounded-full font-bold text-xs dark:text-gray-100"
              title="Full surah"
            >
              🎧 Listen
            </button>
            @if (hasVerseByVerse()) {
              <button
                (click)="viewMode.set('everyAyah')"
                [class.bg-primary]="viewMode() === 'everyAyah'"
                [class.text-white]="viewMode() === 'everyAyah'"
                [class.bg-gray-200]="viewMode() !== 'everyAyah'"
                [class.dark:bg-gray-600]="viewMode() !== 'everyAyah'"
                class="px-3 py-1.5 rounded-full font-bold text-xs dark:text-gray-100"
                title="Verse by verse (Every ayah)"
              >
                📿 Every ayah
              </button>
            }
            <button
              (click)="viewMode.set('read')"
              [class.bg-primary]="viewMode() === 'read'"
              [class.text-white]="viewMode() === 'read'"
              [class.bg-gray-200]="viewMode() !== 'read'"
              [class.dark:bg-gray-600]="viewMode() !== 'read'"
              class="px-3 py-1.5 rounded-full font-bold text-xs dark:text-gray-100"
              title="Read"
            >
              📖 Read
            </button>
          </div>
        </div>

        @if (viewMode() === 'listen' || viewMode() === 'everyAyah') {
          <!-- Listen or Every ayah: verse + audio (verse fits in white area, no scroll) -->
          <div class="flex-1 min-h-0 overflow-hidden flex flex-col items-center px-3 pt-4 pb-2">
            @if (useFullSurahAudio()) {
              <!-- Full surah Listen: visual card only, no verse display -->
              <div class="w-full flex flex-col items-center max-w-6xl mx-auto pt-2 pb-2 min-w-0 flex-1 justify-center">
                <div class="full-surah-visual rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 p-6 md:p-8 text-center w-full max-w-lg mx-auto flex flex-col justify-center min-h-[200px]">
                  <img src="assets/images/surah-cover.png" alt="" class="full-surah-cover mx-auto rounded-xl mb-3 max-h-48 object-contain" (error)="$any($event.target).style.display='none'" />
                  <p class="text-primary font-arabic text-3xl md:text-4xl font-bold mb-1">{{ surah()!.nameAr }}</p>
                  <p class="text-gray-700 text-lg md:text-xl font-semibold">{{ surah()!.nameEn }}</p>
                  <p class="text-gray-500 text-sm mt-1">{{ surah()!.verses }} verses · Full surah</p>
                  <p class="text-gray-400 text-xs mt-2">Tap Play below to listen</p>
                </div>
              </div>
            } @else if (currentVerse()) {
              <div class="w-full flex-1 min-h-0 flex flex-col items-center text-center max-w-6xl mx-auto pt-2 pb-2 min-w-0 overflow-hidden">
                <p class="text-xs text-gray-400 mb-1 flex-shrink-0">
                  Verse {{ currentVerse()!.number }} of {{ surah()!.verses }}
                  @if (usePerVerseAudio()) {
                    <span class="ml-2 text-primary">·</span>
                    <span class="inline-flex items-center gap-1 flex-wrap">
                      <label class="text-gray-500">From</label>
                      <input
                        type="number"
                        [min]="1"
                        [max]="effectiveRangeEnd()"
                        [value]="playRangeStart()"
                        (input)="onRangeStartInput($event)"
                        class="w-10 px-1 py-0.5 rounded border border-primary text-xs font-bold text-center"
                      />
                      <label class="text-gray-500">to</label>
                      <input
                        type="number"
                        [min]="effectiveRangeStart()"
                        [max]="surah()!.verses"
                        [value]="playRangeEnd()"
                        (input)="onRangeEndInput($event)"
                        class="w-10 px-1 py-0.5 rounded border border-primary text-xs font-bold text-center"
                      />
                      <span class="text-gray-500">verse</span>
                    </span>
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
                <div class="flex-1 min-h-0 flex flex-col min-w-0 w-full overflow-hidden">
                  <div class="bg-white/90 dark:bg-gray-800/95 rounded-2xl shadow-xl dark:shadow-gray-900/50 px-4 md:px-6 py-4 md:py-6 w-full min-w-0 min-h-0 flex-1 flex flex-col justify-center overflow-hidden verse-arabic-wrap">
                    <p class="verse-arabic text-primary text-right font-arabic min-h-0">
                      {{ currentVerse()!.arabic }}
                    </p>
                  </div>
                  <p class="verse-translation text-gray-700 leading-snug max-w-4xl mx-auto mt-2 break-words min-w-0 flex-shrink-0">
                    {{ currentVerse()!.translation }}
                  </p>
                </div>
                <div class="flex flex-wrap items-center justify-center gap-2 mt-2 flex-shrink-0">
                  <button
                    (click)="previousVerse()"
                    [disabled]="isAtRangeStart()"
                    class="px-4 py-2 rounded-full bg-primary text-white font-bold disabled:opacity-40 text-sm"
                  >
                    ⏮️
                  </button>
                  <button
                    (click)="nextVerse()"
                    [disabled]="isAtRangeEnd()"
                    class="px-4 py-2 rounded-full bg-primary text-white font-bold disabled:opacity-40 text-sm"
                  >
                    ⏭️
                  </button>
                  @if (wakeLock.isSupported) {
                    <label class="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-gray-100 dark:bg-gray-600 text-sm cursor-pointer dark:text-gray-100">
                      <input
                        type="checkbox"
                        [checked]="wakeLock.isActive()"
                        (change)="onKeepScreenOnChange($event)"
                        class="rounded border-primary"
                      />
                      <span>Keep screen on</span>
                    </label>
                  }
                </div>
              </div>
            }
          </div>
        }

        @if (viewMode() === 'read') {
          <div #readScrollContainer class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col items-center px-4 pt-4 pb-2 verse-scroll">
            <div class="w-full max-w-4xl mx-auto flex flex-col items-center text-center pt-2 pb-6 min-w-0 gap-6">
              @for (verse of surah()!.verses_data; track verse.number) {
                <div #verseBlock class="read-verse-block w-full flex flex-col items-center min-w-0 transition-colors duration-200 rounded-2xl -mx-2 px-2 py-2" [attr.data-verse-number]="verse.number" [class.read-verse-highlight]="verse.number === readHighlightedVerseNumber()">
                  <p class="text-xs text-gray-400 mb-1">Verse {{ verse.number }} of {{ surah()!.verses }}</p>
<div class="bg-white/90 dark:bg-gray-800/95 rounded-2xl shadow-xl dark:shadow-gray-900/50 px-4 md:px-6 py-5 md:py-8 w-full min-w-0 overflow-x-hidden verse-arabic-wrap">
                  <p class="text-primary text-right font-arabic read-verse-arabic">
                      {{ verse.arabic }}
                      <span class="inline-block bg-primary text-white rounded-full text-center read-verse-num ml-2">{{ verse.number }}</span>
                    </p>
                  </div>
                  <p class="text-gray-700 leading-snug mt-2 read-verse-translation break-words min-w-0 w-full">{{ verse.translation }}</p>
                </div>
              }
            </div>
          </div>
        }

        <!-- Audio fixed at bottom -->
        @if (currentAudioUrl()) {
          <div class="flex-shrink-0 w-full mt-auto">
            <app-audio-controls [audioUrl]="currentAudioUrl()!" [autoPlay]="!useFullSurahAudio()" [compact]="true" />
          </div>
        }
        @if (viewMode() === 'listen' || viewMode() === 'everyAyah') {
          <p class="text-[10px] text-gray-400 text-center px-2 py-1 shrink-0">
            @if (wakeLock.isSupported) {
              “Keep screen on” prevents sleep. Lock-screen media controls may keep audio playing when supported.
            }
            If audio stops when you switch browser tabs, it will resume when you return to this tab.
          </p>
        }
      </div>
    }
  `,
  styles: [`
    :host { display: block; height: 100%; min-height: 0; overflow: hidden; }
    .verse-scroll { -webkit-overflow-scrolling: touch; }
    /* Verse area: fit in viewport, no scroll; wrap long text */
    .verse-arabic-wrap { overflow: hidden; min-height: 0; }
    /* Big text for kids; smaller max so long verses fit in white area */
    .verse-arabic {
      font-size: clamp(1.5rem, 10vmin, 5rem);
      line-height: 1.4;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      padding-top: 0.2em;
      padding-bottom: 0.2em;
    }
    .verse-translation {
      font-size: clamp(0.95rem, 3vmin, 1.5rem);
      line-height: 1.4;
    }
    .read-verse-arabic {
      font-size: clamp(2.25rem, 12vmin, 6.5rem);
      line-height: 1.5;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      padding-top: 0.35em;
      padding-bottom: 0.25em;
    }
    .read-verse-num { width: clamp(2.5rem, 7vmin, 4rem); height: clamp(2.5rem, 7vmin, 4rem); line-height: clamp(2.5rem, 7vmin, 4rem); font-size: clamp(1rem, 3vmin, 1.5rem); }
    .read-verse-translation { font-size: clamp(1.1rem, 3.5vmin, 1.75rem); line-height: 1.5; }
    .read-verse-highlight { background: rgba(var(--primary-rgb, 59, 130, 246), 0.12); }
  `]
})
export class SurahDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  /** 1 = once, 5 = five times, 0 = until I skip; any other positive = custom count. */
  readonly repeatOptions: { value: number; label: string }[] = [
    { value: 1, label: '1 time' },
    { value: 5, label: '5 times' },
    { value: 0, label: 'Until I skip' },
  ];

  surah = signal<Surah | null>(null);
  viewMode = signal<ViewMode>('everyAyah');
  /** 1 = once; 5 = five times; 0 = until skip; any positive N = repeat N times (including custom). */
  repeatVerseCount = signal(1);
  /** Play only verses in this range (1-based). Used when usePerVerseAudio. */
  playRangeStart = signal(1);
  playRangeEnd = signal(1);

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
  /** Verse start times for full-surah file (from assets/audio/surahs-full/id.json). Enables verse sync. */
  fullSurahVerseStartTimes = signal<number[] | null>(null);
  /** Verse number currently most in view in Read mode (for scroll highlight). */
  readHighlightedVerseNumber = signal<number | null>(null);

  @ViewChild('readScrollContainer') readScrollContainerRef: ElementRef<HTMLElement> | undefined;
  @ViewChildren('verseBlock') verseBlocksRef!: QueryList<ElementRef<HTMLElement>>;

  private endedSub: Subscription | null = null;
  private readHighlightObserver: IntersectionObserver | null = null;
  private readVerseRatios = new Map<Element, number>();

  private setupReadHighlightObserver(): void {
    const root = this.readScrollContainerRef?.nativeElement;
    if (!root) return;
    this.readHighlightObserver?.disconnect();
    this.readVerseRatios.clear();
    this.readHighlightObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) this.readVerseRatios.set(e.target, e.intersectionRatio);
        let bestVerse: number | null = null;
        let bestRatio = 0;
        this.verseBlocksRef?.forEach((ref) => {
          const el = ref.nativeElement;
          const num = el.getAttribute('data-verse-number');
          if (num === null) return;
          const n = parseInt(num, 10);
          if (Number.isNaN(n)) return;
          const r = this.readVerseRatios.get(el) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestVerse = n;
          }
        });
        this.readHighlightedVerseNumber.set(bestVerse);
      },
      { root, threshold: [0, 0.2, 0.5, 0.8, 1], rootMargin: '-20% 0px -30% 0px' }
    );
    this.verseBlocksRef?.forEach((ref) => this.readHighlightObserver?.observe(ref.nativeElement));
  }

  private teardownReadHighlightObserver(): void {
    this.readHighlightObserver?.disconnect();
    this.readHighlightObserver = null;
    this.readVerseRatios.clear();
    this.readHighlightedVerseNumber.set(null);
  }

  ngAfterViewInit(): void {
    this.verseBlocksRef.changes.subscribe(() => {
      if (this.viewMode() === 'read' && this.readScrollContainerRef) this.setupReadHighlightObserver();
    });
    if (this.viewMode() === 'read' && this.readScrollContainerRef) this.setupReadHighlightObserver();
  }

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

  /** Clamped 1-based range start (1..verses). */
  effectiveRangeStart = computed(() => {
    const s = this.surah();
    if (!s) return 1;
    return Math.max(1, Math.min(this.playRangeStart(), s.verses));
  });

  /** Clamped 1-based range end (1..verses, >= start). */
  effectiveRangeEnd = computed(() => {
    const s = this.surah();
    if (!s) return 1;
    const start = this.effectiveRangeStart();
    return Math.max(start, Math.min(this.playRangeEnd(), s.verses));
  });

  /** 0-based range start for indexing. */
  private rangeStartIndex = computed(() => this.effectiveRangeStart() - 1);
  /** 0-based range end (inclusive) for indexing. */
  private rangeEndIndex = computed(() => this.effectiveRangeEnd() - 1);

  /** True when surah has verse-by-verse audio (EveryAyah). Enables "Every ayah" button. */
  hasVerseByVerse = computed(() => (this.verseAudioUrls().length > 0));

  /** True when in Listen mode and we have a full-surah file (use one file, verse sync from JSON). */
  useFullSurahAudio = computed(() => this.viewMode() === 'listen' && !!this.surah()?.fullSurahAudioUrl);

  /** True when using ayah-by-ayah: Every ayah mode, or Listen mode when no full surah file. */
  usePerVerseAudio = computed(() => {
    const urls = this.verseAudioUrls();
    if (urls.length === 0) return false;
    if (this.viewMode() === 'everyAyah') return true;
    if (this.viewMode() === 'listen' && !this.surah()?.fullSurahAudioUrl) return true;
    return false;
  });

  /** True when we have verse timings (full file) and display is synced to audio. */
  useSyncedVerse = computed(() => {
    const s = this.surah();
    return !!s?.verseStartTimes?.length && !this.usePerVerseAudio();
  });

  /** Displayed verse index: from ayah index, or audio time when synced (incl. full surah with times), else 0. */
  currentVerseIndex = computed(() => {
    const s = this.surah();
    if (!s) return 0;
    if (this.usePerVerseAudio()) return this.verseIndexByAyah();
    if (this.useFullSurahAudio()) {
      const times = this.fullSurahVerseStartTimes();
      if (times?.length) {
        const t = this.audioService.state().currentTime;
        return getVerseIndexForTime(t, times);
      }
      return this.verseIndexByAyah();
    }
    const times = s.verseStartTimes;
    if (times?.length) {
      const t = this.audioService.state().currentTime;
      return getVerseIndexForTime(t, times);
    }
    return 0;
  });

  /** URL passed to audio controls: in Every ayah always verse URL; in Listen use full file when present else verse or audioUrl. */
  currentAudioUrl = computed(() => {
    const s = this.surah();
    if (!s) return undefined;
    if (this.viewMode() === 'everyAyah') {
      const urls = this.verseAudioUrls();
      if (urls.length) return urls[this.currentVerseIndex()];
      return s.audioUrl;
    }
    if (this.viewMode() === 'listen' && s.fullSurahAudioUrl) return s.fullSurahAudioUrl;
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
    private audioService: AudioPlayerService,
    private progressService: ProgressTrackerService,
    public wakeLock: WakeLockService
  ) {
    effect(() => {
      const s = this.surah();
      const verse = this.currentVerse();
      const url = this.currentAudioUrl();
      if (s && verse && url) {
        this.audioService.setMediaSessionMetadata({
          title: `${s.nameEn} — Verse ${verse.number}`,
          artist: s.nameAr,
          album: 'Quran'
        });
      }
    });
    effect(() => {
      if (!this.usePerVerseAudio()) return;
      const start = this.rangeStartIndex();
      const end = this.rangeEndIndex();
      const idx = this.verseIndexByAyah();
      if (idx < start || idx > end) {
        this.verseIndexByAyah.set(Math.max(start, Math.min(end, idx)));
      }
    });
    effect(() => {
      if (this.viewMode() !== 'read') this.teardownReadHighlightObserver();
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const surah = this.quranService.getSurahById(id);
      if (surah) {
        this.surah.set(surah);
        this.playRangeEnd.set(surah.verses);
        this.progressService.setCurrentSurah(id);
        if (surah.fullSurahAudioUrl) {
          this.loadFullSurahVerseTimes(id);
        } else {
          this.fullSurahVerseStartTimes.set(null);
        }
      }
    }
    this.endedSub = this.audioService.onEnded.subscribe(() => this.onAudioEnded());
  }

  private loadFullSurahVerseTimes(surahId: string): void {
    this.fullSurahVerseStartTimes.set(null);
    fetch(`assets/audio/surahs-full/${surahId}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { verseStartTimes?: number[] } | null) => {
        if (data?.verseStartTimes?.length) {
          this.fullSurahVerseStartTimes.set(data.verseStartTimes);
        }
      })
      .catch(() => {});
  }

  private onAudioEnded(): void {
    if (this.useFullSurahAudio()) {
      this.audioService.seek(0);
      this.audioService.play();
      return;
    }
    if (this.usePerVerseAudio()) {
      const count = this.repeatVerseCount();
      const completedPlays = this.playsThisVerse() + 1;
      const shouldReplay = count === 0 || completedPlays < count;
      if (shouldReplay) {
        this.playsThisVerse.set(completedPlays);
        const url = this.currentAudioUrl();
        if (url) this.audioService.loadAudio(url, { autoPlay: true });
      } else {
        this.playsThisVerse.set(0);
        const endIdx = this.rangeEndIndex();
        const startIdx = this.rangeStartIndex();
        const next = this.verseIndexByAyah() + 1;
        if (next <= endIdx) {
          this.verseIndexByAyah.set(next);
        } else {
          this.verseIndexByAyah.set(startIdx);
          if (startIdx === endIdx) {
            const url = this.verseAudioUrls()[startIdx];
            if (url) this.audioService.loadAudio(url, { autoPlay: true });
          }
        }
      }
    } else {
      this.loopSurahAudio();
    }
  }

  ngOnDestroy(): void {
    this.endedSub?.unsubscribe();
    this.wakeLock.release();
    this.teardownReadHighlightObserver();
  }

  private loopSurahAudio(): void {
    this.audioService.seek(0);
    this.audioService.play();
  }

  goBack(): void {
    this.router.navigate(['/surahs']);
  }

  isAtRangeStart(): boolean {
    if (this.usePerVerseAudio()) return this.currentVerseIndex() <= this.rangeStartIndex();
    return this.currentVerseIndex() === 0;
  }

  isAtRangeEnd(): boolean {
    if (this.usePerVerseAudio()) return this.currentVerseIndex() >= this.rangeEndIndex();
    const s = this.surah();
    return !s || this.currentVerseIndex() >= s.verses_data.length - 1;
  }

  previousVerse(): void {
    const s = this.surah();
    const idx = this.currentVerseIndex();
    const startIdx = this.usePerVerseAudio() ? this.rangeStartIndex() : 0;
    if (!s || idx <= startIdx) return;
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
    const endIdx = this.usePerVerseAudio() ? this.rangeEndIndex() : (s?.verses_data.length ?? 1) - 1;
    if (!s || idx >= endIdx) return;
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

  onRangeStartInput(event: Event): void {
    const s = this.surah();
    if (!s) return;
    const n = parseInt((event.target as HTMLInputElement).value, 10);
    if (!Number.isNaN(n)) {
      const clamped = Math.min(s.verses, Math.max(1, n));
      this.playRangeStart.set(clamped);
      if (this.playRangeEnd() < clamped) this.playRangeEnd.set(clamped);
      this.verseIndexByAyah.set(Math.max(0, Math.min(this.verseIndexByAyah(), this.rangeEndIndex())));
      if (this.verseIndexByAyah() < this.rangeStartIndex()) this.verseIndexByAyah.set(this.rangeStartIndex());
    }
  }

  onRangeEndInput(event: Event): void {
    const s = this.surah();
    if (!s) return;
    const n = parseInt((event.target as HTMLInputElement).value, 10);
    if (!Number.isNaN(n)) {
      const clamped = Math.min(s.verses, Math.max(1, n));
      this.playRangeEnd.set(Math.max(this.playRangeStart(), clamped));
      if (this.verseIndexByAyah() > this.rangeEndIndex()) this.verseIndexByAyah.set(this.rangeEndIndex());
    }
  }

  async onKeepScreenOnChange(event: Event): Promise<void> {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) await this.wakeLock.request();
    else await this.wakeLock.release();
  }
}
