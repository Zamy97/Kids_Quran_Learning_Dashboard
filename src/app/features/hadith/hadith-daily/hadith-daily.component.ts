import { Component, OnInit, signal } from '@angular/core';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { Hadith } from '../../../core/models/hadith.model';

@Component({
  selector: 'app-hadith-daily',
  standalone: true,
  template: `
    @if (hadith()) {
      <div class="max-w-4xl mx-auto px-4 py-6">
        <h2 class="text-3xl md:text-4xl font-bold text-primary mb-6">💎 Today's Hadith</h2>

        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6">
          <blockquote class="text-xl md:text-2xl text-gray-800 leading-relaxed italic border-l-4 border-primary pl-6">
            {{ hadith()!.text }}
          </blockquote>
          <p class="text-gray-500 mt-4">— {{ hadith()!.reference }}</p>
        </div>

        <div class="bg-purple-50 p-6 rounded-2xl mb-6 border-l-4 border-purple-500">
          <h3 class="text-xl font-bold text-primary mb-2">📖 Story</h3>
          <p class="text-gray-700 leading-relaxed">{{ hadith()!.story }}</p>
        </div>

        <div class="bg-green-50 p-6 rounded-2xl border-l-4 border-primary">
          <h3 class="text-xl font-bold text-primary mb-2">✨ Lesson for you</h3>
          <p class="text-gray-700 leading-relaxed">{{ hadith()!.lesson }}</p>
        </div>
      </div>
    }
  `
})
export class HadithDailyComponent implements OnInit {
  hadith = signal<Hadith | null>(null);

  constructor(private quranService: QuranDataService) {}

  ngOnInit(): void {
    this.hadith.set(this.quranService.getTodaysHadith());
  }
}
