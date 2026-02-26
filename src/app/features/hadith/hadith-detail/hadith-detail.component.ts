import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { Hadith } from '../../../core/models/hadith.model';

@Component({
  selector: 'app-hadith-detail',
  standalone: true,
  template: `
    @if (hadith()) {
      <div class="h-full flex flex-col min-h-0 overflow-hidden max-w-4xl mx-auto w-full px-2 py-2 md:px-4 md:py-3">
        <button
          (click)="goBack()"
          class="flex-shrink-0 mb-2 px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white rounded-full hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors font-semibold text-sm"
        >
          ← Back to Hadith
        </button>

        <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex flex-col gap-2 md:gap-3">
          <div class="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg dark:shadow-gray-900/50 flex-shrink-0">
            <h2 class="text-lg font-bold text-primary dark:text-white mb-2">{{ hadith()!.title }}</h2>
            <blockquote class="hadith-text text-gray-800 dark:text-gray-100 leading-relaxed italic border-l-4 border-primary dark:border-primary pl-4">
              {{ hadith()!.text }}
            </blockquote>
            <p class="text-gray-500 dark:text-gray-400 mt-2 hadith-ref">— {{ hadith()!.reference }}</p>
          </div>

          <details class="bg-purple-50 dark:bg-gray-700 rounded-xl border-l-4 border-purple-500 dark:border-gray-600 flex-shrink-0 overflow-hidden">
            <summary class="p-2 cursor-pointer font-semibold text-primary dark:text-white text-sm">📖 Story</summary>
            <p class="text-gray-700 dark:text-gray-200 leading-relaxed px-2 pb-2 hadith-story">{{ hadith()!.story }}</p>
          </details>

          <details class="bg-green-50 dark:bg-gray-700 rounded-xl border-l-4 border-primary dark:border-gray-600 flex-shrink-0 overflow-hidden">
            <summary class="p-2 cursor-pointer font-semibold text-primary dark:text-white text-sm">✨ Lesson for you</summary>
            <p class="text-gray-700 dark:text-gray-200 leading-relaxed px-2 pb-2 hadith-lesson">{{ hadith()!.lesson }}</p>
          </details>
        </div>
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
export class HadithDetailComponent implements OnInit {
  hadith = signal<Hadith | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quranService: QuranDataService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      const hadith = this.quranService.getHadithById(id);
      if (hadith) this.hadith.set(hadith);
    }
  }

  goBack(): void {
    this.router.navigate(['/hadith']);
  }
}
