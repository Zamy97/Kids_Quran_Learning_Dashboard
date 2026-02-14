import { Component } from '@angular/core';
import { ARABIC_LETTERS_DATA } from '../../../core/data/arabic-letters.data';

@Component({
  selector: 'app-alphabet',
  standalone: true,
  template: `
    <div class="max-w-6xl mx-auto px-4 py-6">
      <h2 class="text-3xl md:text-4xl font-bold text-primary mb-6">✏️ Arabic Alphabet</h2>
      <p class="text-gray-600 mb-8">Tap a letter to hear its name and sound.</p>

      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 gap-4">
        @for (letter of letters; track letter.arabic) {
          <div
            class="bg-white p-4 rounded-2xl shadow-lg text-center cursor-pointer
                   hover:scale-105 hover:shadow-xl transition-all border-2 border-primary/20
                   hover:border-primary"
          >
            <span class="text-4xl md:text-5xl font-arabic text-primary block mb-2">
              {{ letter.arabic }}
            </span>
            <span class="text-sm font-semibold text-gray-700">{{ letter.name }}</span>
          </div>
        }
      </div>
    </div>
  `
})
export class AlphabetComponent {
  letters = ARABIC_LETTERS_DATA;
}
