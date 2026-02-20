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
    <div class="h-full flex flex-col min-h-0 overflow-hidden max-w-7xl mx-auto px-2 py-2 md:px-4 md:py-3">
      @if (continueSurah()) {
        <a
          [routerLink]="['/surahs', continueSurah()!.id]"
          class="flex-shrink-0 block mb-2 p-3 md:p-4 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white shadow-lg hover:scale-[1.02] transition-transform no-underline"
        >
          <span class="text-xs md:text-sm font-semibold opacity-90">Continue practicing</span>
          <p class="text-lg md:text-2xl font-bold mt-0.5 truncate">{{ continueSurah()!.nameAr }} · {{ continueSurah()!.nameEn }}</p>
          <p class="mt-1 opacity-90 text-sm">Tap to open → play and listen.</p>
        </a>
      }

      <div class="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-2 mb-2">
        <h2 class="text-lg md:text-2xl font-bold text-primary shrink-0">📖 All surahs</h2>
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearch()"
          placeholder="Search..."
          class="px-3 py-1.5 border-2 border-primary rounded-full w-full sm:w-48 md:w-64 text-sm md:text-base"
        />
      </div>

      <div class="flex-1 min-h-0 overflow-hidden grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 auto-rows-fr">
        @for (surah of filteredSurahs(); track surah.id) {
          <div
            (click)="openSurah(surah.id)"
            class="bg-white p-2 md:p-4 rounded-xl shadow-lg cursor-pointer overflow-hidden
                   hover:scale-105 hover:shadow-2xl transition-all flex flex-col min-h-0
                   border-l-4"
            [class.border-l-primary]="!surah.memorized"
            [class.border-l-green-500]="surah.memorized"
            [class.bg-gradient-to-br]="surah.memorized"
            [class.from-blue-50]="surah.memorized"
            [class.to-cyan-50]="surah.memorized"
          >
            <div class="bg-primary text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base shrink-0">
              {{ surah.number }}
            </div>
            <div class="text-lg md:text-2xl font-bold text-primary text-right font-arabic truncate min-h-0 flex-1">
              {{ surah.nameAr }}
            </div>
            <div class="text-sm md:text-lg font-semibold text-gray-800 truncate">
              {{ surah.nameEn }}
            </div>
            <div class="text-xs md:text-sm text-gray-500 truncate">
              {{ surah.meaning }} · {{ surah.verses }} v · {{ surah.revelation }}
            </div>
            @if (surah.memorized) {
              <span class="inline-block bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 mt-1">
                ✓ Memorized
              </span>
            }
          </div>
        }
      </div>

      @if (filteredSurahs().length === 0) {
        <div class="flex-1 min-h-0 flex flex-col items-center justify-center text-center p-4">
          <div class="text-4xl md:text-6xl mb-2">🔍</div>
          <p class="text-sm md:text-xl text-gray-500">No surahs found matching "{{ searchQuery }}"</p>
        </div>
      }
    </div>
  `,
  styles: [`:host { display: block; height: 100%; min-height: 0; }`]
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
