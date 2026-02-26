import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { Hadith } from '../../../core/models/hadith.model';

@Component({
  selector: 'app-hadith-list',
  standalone: true,
  template: `
    <div class="h-full flex flex-col min-h-0 max-w-7xl mx-auto px-2 py-2 md:px-4 md:py-3">
      <div class="flex-shrink-0">
        <h2 class="text-xl md:text-3xl font-bold text-primary dark:text-white mb-2">💎 Hadith</h2>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Sayings of the Prophet ﷺ with stories and lessons.</p>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-4">
          @for (hadith of hadiths(); track hadith.id) {
            <div
              (click)="openHadith(hadith.id)"
              class="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-xl shadow-lg dark:shadow-gray-900/50 cursor-pointer flex flex-col min-h-[5rem]
                     hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] transition-all border-l-4 border-primary"
            >
              <span class="text-2xl md:text-3xl mb-2 block shrink-0">💬</span>
              <h3 class="hadith-title font-bold text-primary dark:text-white mb-1">{{ hadith.title }}</h3>
              <p class="hadith-preview text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{{ hadith.text }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ hadith.reference }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; min-height: 0; }
    .hadith-title { font-size: clamp(0.95rem, 3vmin, 1.25rem); word-break: break-word; }
    .hadith-preview { font-size: clamp(0.8rem, 2.2vmin, 0.95rem); word-break: break-word; }
  `]
})
export class HadithListComponent {
  hadiths = signal<Hadith[]>(this.quranService.hadithsList());

  constructor(
    private quranService: QuranDataService,
    private router: Router
  ) {}

  openHadith(id: number): void {
    this.router.navigate(['/hadith', id]);
  }
}
