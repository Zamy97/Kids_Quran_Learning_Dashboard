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
      <div class="max-w-4xl mx-auto px-4 py-6">
        <button
          (click)="goBack()"
          class="mb-6 px-6 py-3 bg-gray-500 text-white rounded-full
                 hover:bg-gray-600 transition-colors font-semibold"
        >
          ← Back to Du'as
        </button>

        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6">
          <span class="text-5xl mb-4 block">{{ dua()!.icon }}</span>
          <h2 class="text-3xl font-bold text-primary mb-2">{{ dua()!.title }}</h2>
          <p class="text-gray-600 mb-4">{{ dua()!.occasion }}</p>

          <div class="bg-gray-50 p-6 rounded-2xl mb-4 text-right">
            <p class="text-3xl md:text-4xl font-arabic text-primary leading-relaxed">
              {{ dua()!.arabic }}
            </p>
          </div>

          <p class="text-xl text-gray-700 italic mb-2">{{ dua()!.transliteration }}</p>
          <p class="text-lg text-gray-600">{{ dua()!.translation }}</p>
        </div>

        <!-- Human recitation when MP3 is in assets/audio/duas/{id}.mp3 -->
        @if (dua()!.audioUrl) {
          <div class="mb-6">
            <app-audio-controls [audioUrl]="dua()!.audioUrl" [autoPlay]="true" />
          </div>
        }

        <!-- Fallback: Read aloud (TTS) when no recording or for English -->
        @if (speechService.supported) {
          <div class="bg-primary/10 border-2 border-primary rounded-2xl p-6 mb-6">
            <h3 class="text-lg font-bold text-primary mb-3">🔊 Read aloud</h3>
            <p class="text-gray-600 text-sm mb-4">Hear the du'a in Arabic, then in English (uses device voice).</p>
            <div class="flex flex-wrap gap-3">
              <button
                (click)="readAloud()"
                [disabled]="isSpeaking()"
                class="px-6 py-3 rounded-full font-bold bg-primary text-white hover:bg-primary/90
                       disabled:opacity-60 disabled:cursor-not-allowed transition-all"
              >
                @if (isSpeaking()) {
                  <span class="animate-pulse">Playing…</span>
                } @else {
                  🔊 Read aloud
                }
              </button>
              @if (isSpeaking()) {
                <button
                  (click)="stopReading()"
                  class="px-6 py-3 rounded-full font-bold bg-gray-600 text-white hover:bg-gray-700"
                >
                  Stop
                </button>
              }
            </div>
          </div>
        }

        <details class="bg-yellow-50 border-l-4 border-accent rounded-2xl mt-4">
          <summary class="p-4 cursor-pointer font-semibold text-primary">💡 Why we say this</summary>
          <p class="text-gray-700 leading-relaxed px-4 pb-4">{{ dua()!.explanation }}</p>
        </details>
      </div>
    }
  `
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
