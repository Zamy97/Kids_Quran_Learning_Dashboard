import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { NavigationComponent } from './shared/components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavigationComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <app-header />
      <app-navigation />
      <main class="pb-8">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppComponent {
  title = "Fatimah's Quran Learning App";
}
