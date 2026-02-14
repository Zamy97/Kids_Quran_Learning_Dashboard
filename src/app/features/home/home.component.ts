import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressTrackerService } from '../../core/services/progress-tracker.service';
import { QuranDataService } from '../../core/services/quran-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div class="bg-gradient-to-br from-purple-600 to-indigo-700 text-white
                  p-8 md:p-12 rounded-3xl text-center mb-8 shadow-2xl">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Assalamu Alaikum, Fatimah! 🌸
        </h2>
        <p class="text-lg md:text-xl italic leading-relaxed max-w-3xl mx-auto">
          "And We have certainly made the Qur'an easy for remembrance,
          so is there any who will remember?"
          <br><em class="block mt-2">- Surah Al-Qamar (54:17)</em>
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg text-center
                    hover:scale-105 transition-transform">
          <div class="text-5xl md:text-6xl font-extrabold text-primary mb-2">
            {{ memorizedCount() }}
          </div>
          <div class="text-xl font-semibold mb-2">Surahs Completed</div>
          <div class="text-gray-500 text-sm">Al-Fatiha to Al-Fil + Al-Asr</div>
        </div>

        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg text-center
                    hover:scale-105 transition-transform">
          <div class="text-5xl md:text-6xl font-extrabold text-primary mb-2">1</div>
          <div class="text-xl font-semibold mb-2">Current Surah</div>
          <div class="text-gray-500 text-sm">{{ currentSurah() }}</div>
        </div>

        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg text-center
                    hover:scale-105 transition-transform">
          <div class="text-5xl md:text-6xl font-extrabold text-primary mb-2">
            {{ duasCount() }}+
          </div>
          <div class="text-xl font-semibold mb-2">Du'as Learned</div>
          <div class="text-gray-500 text-sm">Keep practicing!</div>
        </div>
      </div>

      <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <h3 class="text-2xl md:text-3xl font-bold text-primary mb-6">Quick Start</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (action of quickActions; track action.label) {
            <button
              (click)="navigate(action.route)"
              class="flex flex-col items-center gap-3 p-6 md:p-8
                     bg-gradient-to-br from-primary to-primary-light text-white
                     rounded-2xl hover:scale-105 transition-all shadow-md"
            >
              <span class="text-5xl">{{ action.icon }}</span>
              <span class="text-base md:text-lg font-semibold text-center">
                {{ action.label }}
              </span>
            </button>
          }
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  progress = this.progressService.userProgress;

  memorizedCount = computed(() => this.progress().memorizedSurahs.length);
  currentSurah = computed(() => this.progress().currentSurah);
  duasCount = computed(() => this.progress().duasLearned.length);

  quickActions = [
    { icon: '📖', label: 'Continue Al-Humazah', route: '/surahs/al-humazah' },
    { icon: '💎', label: "Today's Hadith", route: '/hadith' },
    { icon: '🤲', label: "Practice Du'as", route: '/duas' },
    { icon: '✏️', label: 'Arabic Practice', route: '/letters' }
  ];

  constructor(
    private progressService: ProgressTrackerService,
    private router: Router
  ) {}

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
