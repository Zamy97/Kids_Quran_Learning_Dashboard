import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="flex-shrink-0 bg-white dark:bg-gray-800 shadow-md z-40">
      <div class="w-full px-1 py-1 md:px-2 md:py-2">
        <div class="flex flex-wrap gap-1 md:gap-2 justify-center items-stretch">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="!bg-primary !text-white dark:!bg-primary dark:!text-white"
              class="flex flex-col items-center justify-center gap-0.5 px-2 py-2 md:px-4 md:py-3
                     bg-gray-100 dark:bg-gray-700 rounded-xl min-w-0 flex-1 max-w-[120px] md:max-w-[140px]
                     hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300
                     hover:scale-105 cursor-pointer text-gray-900 dark:text-gray-100"
            >
              <span class="text-2xl md:text-3xl lg:text-4xl leading-none">{{ item.icon }}</span>
              <span class="text-[10px] md:text-xs font-semibold whitespace-nowrap truncate w-full text-center">{{ item.label }}</span>
            </a>
          }
          <button
            type="button"
            (click)="theme.toggle()"
            class="flex flex-col items-center justify-center gap-0.5 px-2 py-2 md:px-4 md:py-3
                   bg-gray-100 dark:bg-gray-700 rounded-xl min-w-0 flex-1 max-w-[120px] md:max-w-[140px]
                   hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300
                   hover:scale-105 cursor-pointer text-gray-900 dark:text-gray-100"
            [attr.aria-label]="theme.dark() ? 'Switch to light mode' : 'Switch to dark mode'"
            title="{{ theme.dark() ? 'Light mode' : 'Dark mode' }}"
          >
            <span class="text-2xl md:text-3xl lg:text-4xl leading-none">{{ theme.dark() ? '☀️' : '🌙' }}</span>
            <span class="text-[10px] md:text-xs font-semibold whitespace-nowrap truncate w-full text-center">{{ theme.dark() ? 'Light' : 'Dark' }}</span>
          </button>
        </div>
      </div>
    </nav>
  `
})
export class NavigationComponent {
  constructor(public theme: ThemeService) {}

  navItems: NavItem[] = [
    { path: '/surahs', label: 'Surahs', icon: '📖' },
    { path: '/duas', label: "Du'as", icon: '🤲' },
    { path: '/hadith', label: 'Hadith', icon: '💎' },
    { path: '/letters', label: 'Letters', icon: '✏️' },
    { path: '/nasheeds', label: 'Nasheeds', icon: '🎵' }
  ];
}
