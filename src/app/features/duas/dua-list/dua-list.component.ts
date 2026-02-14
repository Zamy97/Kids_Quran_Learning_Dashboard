import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { Dua } from '../../../core/models/dua.model';

@Component({
  selector: 'app-dua-list',
  standalone: true,
  template: `
    <div class="max-w-7xl mx-auto px-4 py-6">
      <h2 class="text-3xl md:text-4xl font-bold text-primary mb-6">🤲 Du'as</h2>

      <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          (click)="setCategory('all')"
          [class.bg-primary]="category() === 'all'"
          [class.text-white]="category() === 'all'"
          class="px-4 py-2 rounded-full font-semibold bg-gray-200 hover:bg-primary hover:text-white transition-colors"
        >
          All
        </button>
        <button
          (click)="setCategory('daily')"
          [class.bg-primary]="category() === 'daily'"
          [class.text-white]="category() === 'daily'"
          class="px-4 py-2 rounded-full font-semibold bg-gray-200 hover:bg-primary hover:text-white transition-colors"
        >
          Daily
        </button>
        <button
          (click)="setCategory('food')"
          [class.bg-primary]="category() === 'food'"
          [class.text-white]="category() === 'food'"
          class="px-4 py-2 rounded-full font-semibold bg-gray-200 hover:bg-primary hover:text-white transition-colors"
        >
          Food
        </button>
        <button
          (click)="setCategory('travel')"
          [class.bg-primary]="category() === 'travel'"
          [class.text-white]="category() === 'travel'"
          class="px-4 py-2 rounded-full font-semibold bg-gray-200 hover:bg-primary hover:text-white transition-colors"
        >
          Travel
        </button>
        <button
          (click)="setCategory('special')"
          [class.bg-primary]="category() === 'special'"
          [class.text-white]="category() === 'special'"
          class="px-4 py-2 rounded-full font-semibold bg-gray-200 hover:bg-primary hover:text-white transition-colors"
        >
          Special
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (dua of filteredDuas(); track dua.id) {
          <div
            (click)="openDua(dua.id)"
            class="bg-white p-6 rounded-2xl shadow-lg cursor-pointer
                   hover:scale-105 hover:shadow-xl transition-all
                   border-l-4 border-primary"
          >
            <span class="text-4xl mb-3 block">{{ dua.icon }}</span>
            <h3 class="text-xl font-bold text-primary mb-2">{{ dua.title }}</h3>
            <p class="text-gray-600 text-sm">{{ dua.occasion }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class DuaListComponent {
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
