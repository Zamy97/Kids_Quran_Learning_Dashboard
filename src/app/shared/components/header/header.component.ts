import { Component, computed } from '@angular/core';
import { ProgressTrackerService } from '../../../core/services/progress-tracker.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="bg-gradient-to-r from-primary to-primary-light text-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-4 md:py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl md:text-3xl font-bold flex items-center gap-2">
            🌙 Fatimah's Quran Journey 🌙
          </h1>
          <div class="bg-white/20 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full">
            <span class="text-2xl md:text-3xl font-extrabold text-accent">
              {{ memorizedCount() }}
            </span>
            <span class="ml-2 text-sm md:text-base font-semibold">Surahs Memorized! 🌟</span>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  memorizedCount = computed(() =>
    this.progressService.userProgress().memorizedSurahs.length
  );

  constructor(private progressService: ProgressTrackerService) {}
}
