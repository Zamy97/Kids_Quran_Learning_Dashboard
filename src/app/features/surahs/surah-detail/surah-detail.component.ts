import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { AudioControlsComponent } from '../../../shared/components/audio-controls/audio-controls.component';
import { Surah } from '../../../core/models/surah.model';

type ViewMode = 'listen' | 'read';

@Component({
  selector: 'app-surah-detail',
  standalone: true,
  imports: [AudioControlsComponent],
  template: `
    @if (surah()) {
      <div class="max-w-6xl mx-auto px-4 py-6">
        <button
          (click)="goBack()"
          class="mb-6 px-6 py-3 bg-gray-500 text-white rounded-full
                 hover:bg-gray-600 transition-colors font-semibold"
        >
          ← Back to List
        </button>

        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6">
          <h2 class="text-3xl md:text-4xl font-bold text-primary mb-4">
            {{ surah()!.nameAr }} - {{ surah()!.nameEn }}
          </h2>
          <div class="text-gray-600 space-y-1">
            <p><strong>Meaning:</strong> {{ surah()!.meaning }}</p>
            <p><strong>Verses:</strong> {{ surah()!.verses }}</p>
            <p><strong>Revealed in:</strong> {{ surah()!.revelation }}</p>
          </div>
        </div>

        <div class="bg-gradient-to-r from-yellow-50 to-orange-50
                    p-6 rounded-2xl mb-6 border-l-4 border-accent">
          <h3 class="text-2xl font-bold text-primary mb-3">📖 Story & Background</h3>
          <p class="text-gray-700 leading-relaxed text-lg">{{ surah()!.story }}</p>
        </div>

        <div class="flex gap-4 mb-6 justify-center">
          <button
            (click)="viewMode.set('listen')"
            [class.bg-primary]="viewMode() === 'listen'"
            [class.text-white]="viewMode() === 'listen'"
            [class.bg-gray-200]="viewMode() !== 'listen'"
            class="px-8 py-4 rounded-full font-bold text-lg transition-all
                   hover:scale-105"
          >
            🎧 Listen Mode
          </button>
          <button
            (click)="viewMode.set('read')"
            [class.bg-primary]="viewMode() === 'read'"
            [class.text-white]="viewMode() === 'read'"
            [class.bg-gray-200]="viewMode() !== 'read'"
            class="px-8 py-4 rounded-full font-bold text-lg transition-all
                   hover:scale-105"
          >
            📖 Read Mode
          </button>
        </div>

        @if (surah()!.audioUrl) {
          <div class="mb-6">
            <app-audio-controls [audioUrl]="surah()!.audioUrl" />
          </div>
        }

        @if (viewMode() === 'listen') {
          <div class="bg-white p-8 md:p-12 rounded-2xl shadow-lg text-center">
            <h3 class="text-2xl font-bold text-primary mb-6">
              Current Verse: {{ currentVerseIndex() + 1 }} / {{ surah()!.verses }}
            </h3>

            @if (currentVerse()) {
              <div class="max-w-3xl mx-auto">
                <div class="text-4xl md:text-5xl text-primary mb-6 leading-relaxed
                            text-right font-arabic p-6 bg-gray-50 rounded-2xl">
                  {{ currentVerse()!.arabic }}
                </div>

                <div class="inline-block bg-primary text-white px-6 py-2
                            rounded-full font-bold text-xl mb-4">
                  Verse {{ currentVerse()!.number }}
                </div>

                <div class="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  {{ currentVerse()!.translation }}
                </div>

                <div class="flex gap-4 justify-center mt-8">
                  <button
                    (click)="previousVerse()"
                    [disabled]="currentVerseIndex() === 0"
                    class="px-6 py-3 bg-primary text-white rounded-full
                           font-semibold hover:bg-primary-dark transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ⏮️ Previous
                  </button>
                  <button
                    (click)="nextVerse()"
                    [disabled]="currentVerseIndex() === surah()!.verses_data.length - 1"
                    class="px-6 py-3 bg-primary text-white rounded-full
                           font-semibold hover:bg-primary-dark transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next ⏭️
                  </button>
                </div>
              </div>
            }
          </div>
        }

        @if (viewMode() === 'read') {
          <div class="space-y-4">
            @for (verse of surah()!.verses_data; track verse.number) {
              <div class="bg-white p-6 rounded-2xl shadow-md
                          border-r-4 border-primary hover:shadow-lg transition-shadow">
                <div class="text-3xl md:text-4xl text-primary mb-4
                            leading-relaxed text-right font-arabic">
                  {{ verse.arabic }}
                  <span class="inline-block bg-primary text-white w-10 h-10
                               rounded-full text-center leading-10 text-xl ml-2">
                    {{ verse.number }}
                  </span>
                </div>

                <div class="text-lg md:text-xl text-gray-700 leading-relaxed">
                  {{ verse.translation }}
                </div>
              </div>
            }
          </div>
        }
      </div>
    }
  `
})
export class SurahDetailComponent implements OnInit {
  surah = signal<Surah | null>(null);
  viewMode = signal<ViewMode>('listen');
  currentVerseIndex = signal(0);

  currentVerse = computed(() => {
    const s = this.surah();
    const index = this.currentVerseIndex();
    return s ? s.verses_data[index] ?? null : null;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quranService: QuranDataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const surah = this.quranService.getSurahById(id);
      if (surah) {
        this.surah.set(surah);
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/surahs']);
  }

  previousVerse(): void {
    if (this.currentVerseIndex() > 0) {
      this.currentVerseIndex.update(i => i - 1);
    }
  }

  nextVerse(): void {
    const s = this.surah();
    if (s && this.currentVerseIndex() < s.verses_data.length - 1) {
      this.currentVerseIndex.update(i => i + 1);
    }
  }
}
