import { Component } from '@angular/core';
import { SIMPLE_WORDS } from '../../../core/data/arabic-letters.data';

@Component({
  selector: 'app-words',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto px-4 py-6">
      <h2 class="text-3xl font-bold text-primary mb-6">📚 Simple Words</h2>
      <p class="text-gray-600 mb-8">Learn common Arabic words used in the Quran.</p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (word of words; track word.arabic) {
          <div class="bg-white p-6 rounded-2xl shadow-lg text-center
                      hover:scale-105 transition-transform">
            <p class="text-4xl font-arabic text-primary mb-2">{{ word.arabic }}</p>
            <p class="text-gray-600 italic">{{ word.transliteration }}</p>
            <p class="text-lg font-semibold text-primary mt-2">{{ word.meaning }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class WordsComponent {
  words = SIMPLE_WORDS;
}
