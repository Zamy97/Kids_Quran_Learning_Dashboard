import { Component, signal, computed } from '@angular/core';
import { ARABIC_LETTERS_DATA } from '../../../core/data/arabic-letters.data';
import { SIMPLE_WORDS } from '../../../core/data/arabic-letters.data';

@Component({
  selector: 'app-alphabet',
  standalone: true,
  template: `
    <div class="h-[calc(100vh-5.5rem)] min-h-[480px] flex flex-col relative">
      <!-- Words overlay: big Arabic + English -->
      @if (showWords()) {
        <div class="fixed inset-0 z-50 bg-primary/95 flex flex-col items-center justify-center p-6"
             (click)="closeWords()">
          <button type="button" class="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20
                     text-white text-2xl leading-none flex items-center justify-center
                     hover:bg-white/30"
                  (click)="closeWords(); $event.stopPropagation()"
                  aria-label="Close words">
            ✕
          </button>
          <p class="text-[min(18vw,8rem)] font-arabic text-white mb-4" dir="rtl">
            {{ currentWord().arabic }}
          </p>
          <p class="text-[min(8vw,3rem)] font-bold text-white drop-shadow">
            {{ currentWord().meaning }}
          </p>
          <p class="text-white/80 text-lg mt-2">{{ currentWord().transliteration }}</p>
          <div class="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
            <button type="button" class="w-14 h-14 rounded-full bg-white/20 text-white text-2xl
                       flex items-center justify-center hover:bg-white/30"
                    (click)="prevWord(); $event.stopPropagation()"
                    aria-label="Previous word">‹</button>
            <span class="text-white/90 text-lg self-center">{{ wordIndex() + 1 }} / {{ words.length }}</span>
            <button type="button" class="w-14 h-14 rounded-full bg-white/20 text-white text-2xl
                       flex items-center justify-center hover:bg-white/30"
                    (click)="nextWord(); $event.stopPropagation()"
                    aria-label="Next word">›</button>
          </div>
        </div>
      }

      <!-- Small "Words" button -->
      <button type="button"
              class="absolute top-2 right-2 z-10 px-4 py-2 rounded-xl bg-primary text-white
                     text-sm font-semibold shadow-lg hover:bg-primary-dark transition-colors"
              (click)="openWords()">
        📚 Words
      </button>

      <!-- One letter: big, no scroll -->
      <div class="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <p class="text-gray-500 text-sm mb-2">{{ currentIndex() + 1 }} of {{ letters.length }}</p>

        <!-- Four forms in a 2x2 grid, very large -->
        <div class="grid grid-cols-2 gap-6 md:gap-10 max-w-2xl w-full mb-6">
          <div class="flex flex-col items-center">
            <span class="text-[min(20vmin,7rem)] font-arabic text-primary block" dir="rtl">
              {{ currentLetter().isolated }}
            </span>
            <span class="text-gray-500 text-sm mt-1">Alone</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[min(20vmin,7rem)] font-arabic text-primary block" dir="rtl">
              {{ currentLetter().beginning }}
            </span>
            <span class="text-gray-500 text-sm mt-1">Beginning</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[min(20vmin,7rem)] font-arabic text-primary block" dir="rtl">
              {{ currentLetter().middle }}
            </span>
            <span class="text-gray-500 text-sm mt-1">Middle</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[min(20vmin,7rem)] font-arabic text-primary block" dir="rtl">
              {{ currentLetter().end }}
            </span>
            <span class="text-gray-500 text-sm mt-1">End</span>
          </div>
        </div>

        <p class="text-[min(8vw,2.5rem)] font-bold text-primary">{{ currentLetter().name }}</p>
      </div>

      <!-- Prev / Next: big, easy to tap -->
      <div class="flex justify-between items-center px-4 py-4 border-t border-gray-200 bg-white/80">
        <button type="button"
                class="min-w-[80px] md:min-w-[120px] py-4 px-6 rounded-2xl bg-primary text-white
                       text-2xl font-bold shadow-lg hover:bg-primary-dark disabled:opacity-40
                       disabled:pointer-events-none transition-all"
                (click)="prev()"
                [disabled]="currentIndex() === 0"
                aria-label="Previous letter">
          ‹ Previous
        </button>
        <button type="button"
                class="min-w-[80px] md:min-w-[120px] py-4 px-6 rounded-2xl bg-primary text-white
                       text-2xl font-bold shadow-lg hover:bg-primary-dark disabled:opacity-40
                       disabled:pointer-events-none transition-all"
                (click)="next()"
                [disabled]="currentIndex() === letters.length - 1"
                aria-label="Next letter">
          Next ›
        </button>
      </div>
    </div>
  `
})
export class AlphabetComponent {
  letters = ARABIC_LETTERS_DATA;
  words = SIMPLE_WORDS;

  currentIndex = signal(0);
  showWords = signal(false);
  wordIndex = signal(0);

  currentLetter = computed(() => this.letters[this.currentIndex()] ?? this.letters[0]);
  currentWord = computed(() => this.words[this.wordIndex()] ?? this.words[0]);

  prev(): void {
    this.currentIndex.update(i => Math.max(0, i - 1));
  }

  next(): void {
    this.currentIndex.update(i => Math.min(this.letters.length - 1, i + 1));
  }

  openWords(): void {
    this.wordIndex.set(0);
    this.showWords.set(true);
  }

  closeWords(): void {
    this.showWords.set(false);
  }

  prevWord(): void {
    this.wordIndex.update(i => (i <= 0 ? this.words.length - 1 : i - 1));
  }

  nextWord(): void {
    this.wordIndex.update(i => (i >= this.words.length - 1 ? 0 : i + 1));
  }
}
