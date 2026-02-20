import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { Dua } from '../../../core/models/dua.model';

@Component({
  selector: 'app-dua-list',
  standalone: true,
  template: `
    <div class="h-full flex flex-col min-h-0 overflow-hidden max-w-7xl mx-auto px-2 py-2 md:px-4 md:py-3">
      <h2 class="text-xl md:text-3xl font-bold text-primary mb-2 flex-shrink-0">🤲 Du'as</h2>

      <div class="flex flex-wrap gap-1 md:gap-2 mb-2 flex-shrink-0">
        @for (cat of categories; track cat.id) {
          <button
            (click)="setCategory(cat.id)"
            [class.bg-primary]="category() === cat.id"
            [class.text-white]="category() === cat.id"
            class="px-3 py-1.5 rounded-full font-semibold text-sm bg-gray-200 hover:bg-primary hover:text-white transition-colors"
          >
            {{ cat.label }}
          </button>
        }
      </div>

      <div class="flex-1 min-h-0 overflow-hidden grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-3 auto-rows-fr">
        @for (dua of filteredDuas(); track dua.id) {
          <div
            (click)="openDua(dua.id)"
            class="bg-white p-3 md:p-4 rounded-xl shadow-lg cursor-pointer overflow-hidden flex flex-col min-h-0
                   hover:scale-105 hover:shadow-xl transition-all border-l-4 border-primary"
          >
            <span class="text-2xl md:text-4xl mb-1 block shrink-0">{{ dua.icon }}</span>
            <h3 class="text-sm md:text-lg font-bold text-primary mb-1 truncate flex-1 min-h-0">{{ dua.title }}</h3>
            <p class="text-gray-600 text-xs md:text-sm truncate">{{ dua.occasion }}</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; height: 100%; min-height: 0; }`]
})
export class DuaListComponent {
  categories = [
    { id: 'all', label: 'All' },
    { id: 'daily', label: 'Daily' },
    { id: 'food', label: 'Food' },
    { id: 'travel', label: 'Travel' },
    { id: 'special', label: 'Special' }
  ];
  category = signal<string>('all');
  filteredDuas = signal<Dua[]>(this.quranService.getDuasByCategory('all'));

  constructor(
    private quranService: QuranDataService,
    private router: Router
  ) {}

  setCategory(cat: string): void {
    this.category.set(cat);
    this.filteredDuas.set(this.quranService.getDuasByCategory(cat));
  }

  openDua(id: string): void {
    this.router.navigate(['/duas', id]);
  }
}
