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
    <div class="max-w-7xl mx-auto px-4 py-4">
      @if (continueSurah()) {
        <a
          [routerLink]="['/surahs', continueSurah()!.id]"
          class="block mb-6 p-6 rounded-2xl bg-gradient-to-r from-primary to-primary-light text-white shadow-lg hover:scale-[1.02] transition-transform no-underline"
        >
          <span class="text-sm font-semibold opacity-90">Continue practicing</span>
          <p class="text-2xl md:text-3xl font-bold mt-1">{{ continueSurah()!.nameAr }} · {{ continueSurah()!.nameEn }}</p>
          <p class="mt-2 opacity-90">Tap to open → play and listen. Verse changes every 12s.</p>
        </a>
      }

      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h2 class="text-2xl font-bold text-primary">📖 All surahs</h2>
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (ngModelChange)="onSearch()"
          placeholder="Search..."
          class="px-4 py-2 border-2 border-primary rounded-full w-full md:w-64"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        @for (surah of filteredSurahs(); track surah.id) {
          <div
            (click)="openSurah(surah.id)"
            class="bg-white p-6 rounded-2xl shadow-lg cursor-pointer
                   hover:scale-105 hover:shadow-2xl transition-all
                   border-l-4"
            [class.border-l-primary]="!surah.memorized"
            [class.border-l-green-500]="surah.memorized"
            [class.bg-gradient-to-br]="surah.memorized"
            [class.from-blue-50]="surah.memorized"
            [class.to-cyan-50]="surah.memorized"
          >
            <div class="bg-primary text-white w-12 h-12 rounded-full
                        flex items-center justify-center font-bold text-lg mb-4">
              {{ surah.number }}
            </div>

            <div class="text-3xl font-bold text-primary mb-2 text-right font-arabic">
              {{ surah.nameAr }}
            </div>

            <div class="text-xl font-semibold text-gray-800 mb-1">
              {{ surah.nameEn }}
            </div>

            <div class="text-sm text-gray-500 mb-3">
              {{ surah.meaning }} • {{ surah.verses }} verses • {{ surah.revelation }}
            </div>

            @if (surah.memorized) {
              <span class="inline-block bg-green-500 text-white px-4 py-1
                           rounded-full text-sm font-semibold">
                ✓ Memorized
              </span>
            }
          </div>
        }
      </div>

      @if (filteredSurahs().length === 0) {
        <div class="text-center py-12">
          <div class="text-6xl mb-4">🔍</div>
          <p class="text-xl text-gray-500">No surahs found matching "{{ searchQuery }}"</p>
        </div>
      }
    </div>
  `
})
export class SurahListComponent {
  searchQuery = '';
  filteredSurahs = signal(this.quranService.surahsList());

  continueSurah = computed(() => {
    const id = this.progressService.userProgress().currentSurah;
    return this.quranService.getSurahById(id);
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
