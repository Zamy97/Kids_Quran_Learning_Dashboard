import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './shared/components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  template: `
    <div class="h-dvh max-h-dvh flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <app-navigation />
      <main class="flex-1 min-h-0 overflow-hidden flex flex-col">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {
  title = "Quran Learning Tool";
}
