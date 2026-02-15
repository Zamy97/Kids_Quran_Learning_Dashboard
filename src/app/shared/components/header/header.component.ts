import { Component, computed } from '@angular/core';
import { ProgressTrackerService } from '../../../core/services/progress-tracker.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="bg-gradient-to-r from-primary to-primary-light text-white shadow sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-3 py-2">
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold">📖 Quran</span>
          <div class="bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm">
            <span class="text-xl font-extrabold text-accent">{{ memorizedCount() }}</span>
            <span class="ml-1.5 font-semibold">memorized</span>
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
