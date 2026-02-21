import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { Dua } from '../../../core/models/dua.model';

@Component({
  selector: 'app-dua-list',
  standalone: true,
  template: `
    <div class="h-full flex flex-col min-h-0 max-w-7xl mx-auto px-2 py-2 md:px-4 md:py-3">
      <!-- Fixed header: no scroll -->
      <div class="flex-shrink-0">
        <h2 class="text-xl md:text-3xl font-bold text-primary mb-2">🤲 Du'as</h2>
        <div class="flex flex-wrap gap-1 md:gap-2 mb-2">
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
      </div>

      <!-- Scrollable list: only this area scrolls -->
      <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 pb-4">
          @for (dua of filteredDuas(); track dua.id) {
            <div
              (click)="openDua(dua.id)"
              class="bg-white p-4 md:p-5 rounded-xl shadow-lg cursor-pointer flex flex-col min-h-[5rem]
                     hover:scale-[1.02] hover:shadow-xl active:scale-[0.99] transition-all border-l-4 border-primary"
            >
              <span class="text-3xl md:text-4xl mb-2 block shrink-0">{{ dua.icon }}</span>
              <h3 class="dua-title font-bold text-primary mb-1">{{ dua.title }}</h3>
              <p class="dua-occasion text-gray-600 text-sm">{{ dua.occasion }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; min-height: 0; }
    .dua-title { font-size: clamp(0.95rem, 3vmin, 1.25rem); word-break: break-word; }
    .dua-occasion { font-size: clamp(0.8rem, 2.2vmin, 0.95rem); word-break: break-word; }
  `]
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
