import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { AudioControlsComponent } from '../../../shared/components/audio-controls/audio-controls.component';
import { SpeechService } from '../../../core/services/speech.service';
import { Dua } from '../../../core/models/dua.model';

@Component({
  selector: 'app-dua-detail',
  standalone: true,
  imports: [AudioControlsComponent],
  template: `
    @if (dua()) {
      <div class="h-full flex flex-col min-h-0 overflow-hidden max-w-4xl mx-auto w-full px-2 py-2 md:px-4 md:py-3">
        <button
          (click)="goBack()"
          class="flex-shrink-0 mb-2 px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-full hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors font-semibold text-sm"
        >
          ← Back to Du'as
        </button>

        <div class="flex-1 min-h-0 overflow-hidden flex flex-col gap-2 md:gap-3">
          <div class="bg-white dark:bg-gray-800 p-3 md:p-5 rounded-xl shadow-lg dark:shadow-gray-900/50 flex-shrink-0">
            <span class="dua-icon block mb-2">{{ dua()!.icon }}</span>
            <h2 class="dua-title font-bold text-primary dark:text-white mb-1">{{ dua()!.title }}</h2>
            <p class="dua-occasion text-gray-600 dark:text-gray-300 mb-2">{{ dua()!.occasion }}</p>
          </div>

          <div class="bg-gray-50 dark:bg-gray-800 p-3 md:p-4 rounded-xl text-right flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
            <p class="dua-arabic font-arabic text-primary dark:text-white leading-relaxed overflow-hidden">
              {{ dua()!.arabic }}
            </p>
          </div>

          <p class="dua-translit text-gray-700 dark:text-gray-200 italic flex-shrink-0 overflow-hidden truncate">{{ dua()!.transliteration }}</p>
          <p class="dua-translation text-gray-600 dark:text-gray-200 flex-shrink-0 overflow-hidden line-clamp-2">{{ dua()!.translation }}</p>
        </div>

        @if (dua()!.audioUrl) {
          <div class="flex-shrink-0 mt-2">
            <app-audio-controls [audioUrl]="dua()!.audioUrl" [autoPlay]="true" [compact]="true" />
          </div>
        }

        @if (speechService.supported) {
          <div class="flex-shrink-0 flex flex-wrap gap-2 mt-2">
            <button
              (click)="readAloud()"
              [disabled]="isSpeaking()"
              class="px-4 py-2 rounded-full font-bold text-sm bg-primary text-white hover:bg-primary/90 disabled:opacity-60"
            >
              @if (isSpeaking()) { <span class="animate-pulse">Playing…</span> } @else { 🔊 Read aloud }
            </button>
            @if (isSpeaking()) {
              <button (click)="stopReading()" class="px-4 py-2 rounded-full font-bold text-sm bg-gray-600 text-white">Stop</button>
            }
          </div>
        }

        <details class="flex-shrink-0 bg-yellow-50 dark:bg-gray-700 border-l-4 border-accent dark:border-gray-600 rounded-xl mt-2 overflow-hidden">
          <summary class="p-2 cursor-pointer font-semibold text-primary dark:text-white text-sm">💡 Why we say this</summary>
          <p class="text-gray-700 dark:text-gray-200 leading-relaxed px-2 pb-2 text-sm dua-explanation overflow-hidden line-clamp-3">{{ dua()!.explanation }}</p>
        </details>
      </div>
    }
  `,
  styles: [`
    :host { display: block; height: 100%; min-height: 0; }
    .dua-icon { font-size: clamp(2rem, 6vmin, 4rem); }
    .dua-title { font-size: clamp(1rem, 3vmin, 1.75rem); }
    .dua-occasion { font-size: clamp(0.75rem, 2vmin, 1rem); }
    .dua-arabic { font-size: clamp(1.25rem, 5vmin, 3rem); }
    .dua-translit { font-size: clamp(0.8rem, 2vmin, 1.1rem); }
    .dua-translation { font-size: clamp(0.8rem, 2vmin, 1.1rem); }
    .dua-explanation { font-size: clamp(0.75rem, 1.8vmin, 1rem); }
  `]
})
export class DuaDetailComponent implements OnInit, OnDestroy {
  dua = signal<Dua | null>(null);
  isSpeaking = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quranService: QuranDataService,
    public speechService: SpeechService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const dua = this.quranService.getDuaById(id);
      if (dua) {
        this.dua.set(dua);
      }
    }
  }

  ngOnDestroy(): void {
    this.speechService.cancel();
  }

  async readAloud(): Promise<void> {
    const d = this.dua();
    if (!d || this.isSpeaking()) return;
    this.isSpeaking.set(true);
    try {
      await this.speechService.speakSequence([
        { text: d.arabic, lang: 'ar' },
        { text: d.translation, lang: 'en' }
      ]);
    } finally {
      this.isSpeaking.set(false);
    }
  }

  stopReading(): void {
    this.speechService.cancel();
    this.isSpeaking.set(false);
  }

  goBack(): void {
    this.router.navigate(['/duas']);
  }
}
