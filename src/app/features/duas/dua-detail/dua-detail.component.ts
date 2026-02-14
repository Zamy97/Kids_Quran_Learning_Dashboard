import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuranDataService } from '../../../core/services/quran-data.service';
import { AudioControlsComponent } from '../../../shared/components/audio-controls/audio-controls.component';
import { Dua } from '../../../core/models/dua.model';

@Component({
  selector: 'app-dua-detail',
  standalone: true,
  imports: [AudioControlsComponent],
  template: `
    @if (dua()) {
      <div class="max-w-4xl mx-auto px-4 py-6">
        <button
          (click)="goBack()"
          class="mb-6 px-6 py-3 bg-gray-500 text-white rounded-full
                 hover:bg-gray-600 transition-colors font-semibold"
        >
          ← Back to Du'as
        </button>

        <div class="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6">
          <span class="text-5xl mb-4 block">{{ dua()!.icon }}</span>
          <h2 class="text-3xl font-bold text-primary mb-2">{{ dua()!.title }}</h2>
          <p class="text-gray-600 mb-4">{{ dua()!.occasion }}</p>

          <div class="bg-gray-50 p-6 rounded-2xl mb-4 text-right">
            <p class="text-3xl md:text-4xl font-arabic text-primary leading-relaxed">
              {{ dua()!.arabic }}
            </p>
          </div>

          <p class="text-xl text-gray-700 italic mb-2">{{ dua()!.transliteration }}</p>
          <p class="text-lg text-gray-600">{{ dua()!.translation }}</p>
        </div>

        @if (dua()!.audioUrl) {
          <app-audio-controls [audioUrl]="dua()!.audioUrl" [autoPlay]="true" />
        }

        <details class="bg-yellow-50 border-l-4 border-accent rounded-2xl mt-4">
          <summary class="p-4 cursor-pointer font-semibold text-primary">💡 Why we say this</summary>
          <p class="text-gray-700 leading-relaxed px-4 pb-4">{{ dua()!.explanation }}</p>
        </details>
      </div>
    }
  `
})
export class DuaDetailComponent implements OnInit {
  dua = signal<Dua | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quranService: QuranDataService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const dua = this.quranService.getDuaById(id);
      if (dua) {
        this.dua.set(dua);
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/duas']);
  }
}
