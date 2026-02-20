import { Component } from '@angular/core';
import { JOINING_EXAMPLES } from '../../../core/data/arabic-letters.data';

@Component({
  selector: 'app-joining',
  standalone: true,
  template: `
    <div class="h-full flex flex-col min-h-0 overflow-hidden max-w-4xl mx-auto w-full px-2 py-2 md:px-4">
      <h2 class="text-lg md:text-2xl font-bold text-primary mb-2 flex-shrink-0">🔗 Letter Joining</h2>
      <p class="text-gray-600 mb-2 flex-shrink-0 text-sm">Arabic letters change shape when they connect.</p>
      <div class="flex-1 min-h-0 overflow-hidden grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 auto-rows-fr">
        @for (example of examples; track example.title) {
          <div class="bg-white p-3 md:p-4 rounded-xl shadow-lg flex flex-col min-h-0 overflow-hidden">
            <h3 class="text-sm md:text-base font-bold text-primary mb-2 flex-shrink-0">{{ example.title }}</h3>
            <div class="grid grid-cols-4 gap-2 text-center flex-1 min-h-0 content-center">
              <div><p class="text-xs text-gray-500 mb-0.5">Beg</p><span class="text-xl md:text-2xl font-arabic block">{{ example.beginning }}</span></div>
              <div><p class="text-xs text-gray-500 mb-0.5">Mid</p><span class="text-xl md:text-2xl font-arabic block">{{ example.middle }}</span></div>
              <div><p class="text-xs text-gray-500 mb-0.5">End</p><span class="text-xl md:text-2xl font-arabic block">{{ example.end }}</span></div>
              <div><p class="text-xs text-gray-500 mb-0.5">Alone</p><span class="text-xl md:text-2xl font-arabic block">{{ example.isolated }}</span></div>
            </div>
            <p class="mt-2 text-sm font-arabic text-primary truncate flex-shrink-0">Word: {{ example.word }} — {{ example.meaning }}</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`:host { display: block; height: 100%; min-height: 0; }`]
})
export class JoiningComponent {
  examples = JOINING_EXAMPLES;
}
