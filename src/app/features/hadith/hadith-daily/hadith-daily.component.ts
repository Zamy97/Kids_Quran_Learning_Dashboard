import { Component, OnInit, signal } from '@angular/core';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { Hadith } from '../../../core/models/hadith.model';

@Component({
  selector: 'app-hadith-daily',
  standalone: true,
  template: `
    @if (hadith()) {
      <div class="h-full flex flex-col min-h-0 overflow-hidden max-w-4xl mx-auto w-full px-2 py-2 md:px-4 md:py-3">
        <h2 class="text-lg md:text-2xl font-bold text-primary mb-2 flex-shrink-0">💎 Today's Hadith</h2>

        <div class="bg-white p-4 md:p-6 rounded-xl shadow-lg flex-1 min-h-0 overflow-hidden flex flex-col justify-center">
          <blockquote class="hadith-text text-gray-800 leading-relaxed italic border-l-4 border-primary pl-4 overflow-hidden">
            {{ hadith()!.text }}
          </blockquote>
          <p class="text-gray-500 mt-2 hadith-ref flex-shrink-0">— {{ hadith()!.reference }}</p>
        </div>

        <details class="bg-purple-50 rounded-xl mb-2 border-l-4 border-purple-500 flex-shrink-0 overflow-hidden">
          <summary class="p-2 cursor-pointer font-semibold text-primary text-sm">📖 Story</summary>
          <p class="text-gray-700 leading-relaxed px-2 pb-2 hadith-story overflow-hidden line-clamp-4">{{ hadith()!.story }}</p>
        </details>

        <details class="bg-green-50 rounded-xl border-l-4 border-primary flex-shrink-0 overflow-hidden">
          <summary class="p-2 cursor-pointer font-semibold text-primary text-sm">✨ Lesson for you</summary>
          <p class="text-gray-700 leading-relaxed px-2 pb-2 hadith-lesson overflow-hidden line-clamp-3">{{ hadith()!.lesson }}</p>
        </details>
      </div>
    }
  `,
  styles: [`
    :host { display: block; height: 100%; min-height: 0; }
    .hadith-text { font-size: clamp(1rem, 3.5vmin, 2rem); }
    .hadith-ref { font-size: clamp(0.75rem, 2vmin, 1rem); }
    .hadith-story, .hadith-lesson { font-size: clamp(0.8rem, 2vmin, 1.1rem); }
  `]
})
export class HadithDailyComponent implements OnInit {
  hadith = signal<Hadith | null>(null);

  constructor(private quranService: QuranDataService) {}

  ngOnInit(): void {
    this.hadith.set(this.quranService.getTodaysHadith());
  }
}
