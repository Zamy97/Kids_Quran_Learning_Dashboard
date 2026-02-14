import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: true,
  template: `
    <button
      (click)="goBack()"
      class="mb-6 px-6 py-3 bg-gray-500 text-white rounded-full
             hover:bg-gray-600 transition-colors font-semibold"
    >
      ← {{ label }}
    </button>
  `
})
export class BackButtonComponent {
  @Input() label = 'Back';
  @Input() route?: string;

  constructor(private router: Router) {}

  goBack(): void {
    if (this.route) {
      this.router.navigate([this.route]);
    } else {
      this.router.navigate(['/surahs']);
    }
  }
}
