import { Component } from '@angular/core';

@Component({
  selector: 'app-nasheed-player',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto px-4 py-6">
      <h2 class="text-3xl md:text-4xl font-bold text-primary mb-6">🎵 Nasheeds</h2>
      <p class="text-gray-600 mb-8">Islamic songs for children. Add audio files to assets/audio/nasheeds/ to play them here.</p>

      <div class="bg-white p-8 rounded-2xl shadow-lg text-center">
        <div class="text-6xl mb-4">🎵</div>
        <p class="text-lg text-gray-600">No nasheeds added yet. Place MP3 files in <code class="bg-gray-100 px-2 py-1 rounded">src/assets/audio/nasheeds/</code> and link them in this component.</p>
      </div>
    </div>
  `
})
export class NasheedPlayerComponent {}
