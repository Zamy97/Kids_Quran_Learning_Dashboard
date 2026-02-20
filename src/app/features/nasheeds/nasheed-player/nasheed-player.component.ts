import { Component } from '@angular/core';

@Component({
  selector: 'app-nasheed-player',
  standalone: true,
  template: `
    <div class="h-full flex flex-col min-h-0 overflow-hidden max-w-4xl mx-auto w-full px-4 py-4 justify-center">
      <h2 class="text-xl md:text-3xl font-bold text-primary mb-2 flex-shrink-0 text-center">🎵 Nasheeds</h2>
      <p class="text-gray-600 mb-4 flex-shrink-0 text-center text-sm md:text-base">Islamic songs for children. Add audio files to assets/audio/nasheeds/ to play them here.</p>
      <div class="bg-white p-6 rounded-2xl shadow-lg text-center flex-1 min-h-0 flex flex-col justify-center overflow-hidden">
        <div class="text-4xl md:text-6xl mb-3">🎵</div>
        <p class="text-sm md:text-lg text-gray-600">No nasheeds added yet. Place MP3 files in <code class="bg-gray-100 px-2 py-1 rounded text-xs md:text-sm">src/assets/audio/nasheeds/</code> and link them in this component.</p>
      </div>
    </div>
  `,
  styles: [`:host { display: block; height: 100%; min-height: 0; }`]
})
export class NasheedPlayerComponent {}
