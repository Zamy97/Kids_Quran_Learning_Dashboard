import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressTrackerService } from '../../core/services/progress-tracker.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-[calc(100vh-12rem)] flex flex-col justify-center items-center px-4 py-4">
      <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">Assalamu Alaikum 🌸</p>

      <a
        [routerLink]="continueRoute()"
        class="block w-full max-w-md p-10 rounded-3xl bg-gradient-to-br from-primary to-primary-light text-white text-center shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform no-underline"
      >
        <span class="text-6xl block mb-4">📖</span>
        <span class="text-2xl md:text-3xl font-bold block">Continue</span>
        <span class="text-lg opacity-90 mt-1 block">{{ currentSurah() }}</span>
      </a>

      <div class="flex gap-4 mt-10">
        <a [routerLink]="['/hadith']" class="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium">Hadith</a>
        <a [routerLink]="['/duas']" class="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium">Du'as</a>
        <a [routerLink]="['/letters']" class="text-gray-500 dark:text-gray-400 hover:text-primary text-sm font-medium">Letters</a>
      </div>
    </div>
  `
})
export class HomeComponent {
  progress = this.progressService.userProgress;
  currentSurah = computed(() => this.progress().currentSurah);
  continueRoute = computed(() => '/surahs/' + this.progress().currentSurah);

  constructor(private progressService: ProgressTrackerService) {}
}
