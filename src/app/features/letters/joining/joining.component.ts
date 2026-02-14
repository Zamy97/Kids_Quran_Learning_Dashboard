import { Component } from '@angular/core';
import { JOINING_EXAMPLES } from '../../../core/data/arabic-letters.data';

@Component({
  selector: 'app-joining',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto px-4 py-6">
      <h2 class="text-3xl font-bold text-primary mb-6">🔗 Letter Joining</h2>
      <p class="text-gray-600 mb-8">Arabic letters change shape when they connect. Here are examples.</p>

      <div class="space-y-6">
        @for (example of examples; track example.title) {
          <div class="bg-white p-6 rounded-2xl shadow-lg">
            <h3 class="text-xl font-bold text-primary mb-4">{{ example.title }}</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p class="text-sm text-gray-500 mb-1">Beginning</p>
                <span class="text-3xl font-arabic">{{ example.beginning }}</span>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Middle</p>
                <span class="text-3xl font-arabic">{{ example.middle }}</span>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">End</p>
                <span class="text-3xl font-arabic">{{ example.end }}</span>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-1">Alone</p>
                <span class="text-3xl font-arabic">{{ example.isolated }}</span>
              </div>
            </div>
            <p class="mt-4 text-lg font-arabic text-primary">Word: {{ example.word }} — {{ example.meaning }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class JoiningComponent {
  examples = JOINING_EXAMPLES;
}
