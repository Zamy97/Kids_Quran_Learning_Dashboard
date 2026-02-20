import { Component } from '@angular/core';
import { SIMPLE_WORDS } from '../../../core/data/arabic-letters.data';

@Component({
  selector: 'app-words',
  standalone: true,
  template: `
    <div class="h-full flex flex-col min-h-0 overflow-hidden max-w-4xl mx-auto w-full px-2 py-2 md:px-4">
      <h2 class="text-lg md:text-2xl font-bold text-primary mb-2 flex-shrink-0">📚 Simple Words</h2>
      <p class="text-gray-600 mb-2 flex-shrink-0 text-sm">Learn common Arabic words used in the Quran.</p>
      <div class="flex-1 min-h-0 overflow-hidden grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 auto-rows-fr">
        @for (word of words; track word.arabic) {
          <div class="bg-white p-3 md:p-4 rounded-xl shadow-lg text-center flex flex-col justify-center min-h-0 overflow-hidden hover:scale-105 transition-transform">
            <p class="text-2xl md:text-4xl font-arabic text-primary mb-1 truncate">{{ word.arabic }}</p>
            <p class="text-gray-600 italic text-xs md:text-sm truncate">{{ word.transliteration }}</p>
            <p class="text-sm md:text-base font-semibold text-primary mt-1 truncate">{{ word.meaning }}</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; height: 100%; min-height: 0; }`]
})
export class WordsComponent {
  words = SIMPLE_WORDS;
}
