import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { ProgressTrackerService } from '../../../core/services/progress-tracker.service';

@Component({
  selector: 'app-surah-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="h-full flex flex-col min-h-0 max-w-7xl mx-auto px-2 py-2 md:px-4 md:py-3">
      <!-- Fixed header: no scroll -->
      <div class="flex-shrink-0">
        @if (continueSurah()) {
          <a
            [routerLink]="['/surahs', continueSurah()!.id]"
            class="flex items-center gap-2 mb-1.5 py-1.5 px-3 md:py-2 md:px-4 rounded-lg bg-gradient-to-r from-primary to-primary-light text-white shadow hover:scale-[1.01] transition-transform no-underline"
          >
            <span class="text-[10px] md:text-xs font-semibold opacity-90 whitespace-nowrap">Continue</span>
            <p class="text-sm md:text-base font-bold truncate min-w-0 flex-1">{{ continueSurah()!.nameAr }} · {{ continueSurah()!.nameEn }}</p>
            <span class="text-[10px] opacity-80 hidden sm:inline">Tap to open</span>
          </a>
        }

        <div class="flex flex-col sm:flex-row justify-between items-center gap-1.5 mb-2">
          <h2 class="text-base md:text-2xl font-bold text-primary shrink-0">📖 All surahs</h2>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch()"
            placeholder="Search..."
            class="px-3 py-1.5 border-2 border-primary rounded-full w-full sm:w-48 md:w-64 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 placeholder:dark:text-gray-400"
          />
        </div>
      </div>

      <!-- Scrollable list: only this area scrolls -->
      <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        @if (filteredSurahs().length === 0) {
          <div class="flex flex-col items-center justify-center text-center py-12">
            <div class="text-4xl md:text-6xl mb-2">🔍</div>
            <p class="text-sm md:text-xl text-gray-500 dark:text-gray-400">No surahs found matching "{{ searchQuery }}"</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-4">
            @for (surah of filteredSurahs(); track surah.id) {
              <div
                (click)="openSurah(surah.id)"
                class="surah-card bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 cursor-pointer
                       hover:scale-[1.02] hover:shadow-lg active:scale-[0.99] transition-all flex flex-col
                       border-l-4 min-h-[4.5rem]"
                [class.border-l-primary]="!surah.memorized"
                [class.border-l-green-500]="surah.memorized"
                [class.bg-gradient-to-br]="surah.memorized"
                [class.from-blue-50]="surah.memorized"
                [class.to-cyan-50]="surah.memorized"
                [class.dark:from-gray-700]="surah.memorized"
                [class.dark:to-gray-600]="surah.memorized"
              >
                <div class="flex items-center gap-3 flex-1 p-3 md:p-4">
                  <div class="surah-num-badge bg-primary text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    {{ surah.number }}
                  </div>
                  <div class="min-w-0 flex-1 flex flex-col justify-center gap-1">
                    <div class="surah-name-ar font-bold text-primary font-arabic leading-tight text-right" dir="rtl">
                      {{ surah.nameAr }}
                    </div>
                    <div class="surah-name-en font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                      {{ surah.nameEn }}
                    </div>
                    <div class="surah-meta text-gray-500 dark:text-gray-400 leading-tight">
                      {{ surah.meaning }} · {{ surah.verses }} v
                    </div>
                  </div>
                </div>
                @if (surah.memorized) {
                  <span class="inline-block bg-green-500 text-white px-2 py-0.5 rounded-b-xl text-[10px] font-semibold shrink-0 text-center">
                    ✓ Memorized
                  </span>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; min-height: 0; }
    /* Comfortable sizing: readable on phone, scales on big screens */
    .surah-num-badge {
      width: clamp(2.5rem, 8vmin, 3rem);
      height: clamp(2.5rem, 8vmin, 3rem);
      font-size: clamp(0.8rem, 3vmin, 1rem);
    }
    .surah-name-ar {
      font-size: clamp(1rem, 4vmin, 1.5rem);
      word-break: break-word;
    }
    .surah-name-en {
      font-size: clamp(0.9rem, 3vmin, 1.15rem);
      word-break: break-word;
    }
    .surah-meta {
      font-size: clamp(0.75rem, 2vmin, 0.875rem);
    }
  `]
})
export class SurahListComponent {
  searchQuery = '';
  filteredSurahs = signal(this.quranService.surahsList());

  /** Last surah the user opened (saved when they visit surah detail). Only shown when set. */
  continueSurah = computed(() => {
    const id = this.progressService.userProgress().currentSurah;
    if (!id?.trim()) return null;
    return this.quranService.getSurahById(id) ?? null;
  });

  constructor(
    private quranService: QuranDataService,
    private progressService: ProgressTrackerService,
    private router: Router
  ) {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filteredSurahs.set(this.quranService.searchSurahs(this.searchQuery));
    } else {
      this.filteredSurahs.set(this.quranService.surahsList());
    }
  }

  openSurah(id: string): void {
    this.router.navigate(['/surahs', id]);
  }
}
