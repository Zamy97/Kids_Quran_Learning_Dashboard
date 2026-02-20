import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
    <nav class="flex-shrink-0 bg-white shadow-md z-40">
      <div class="w-full px-1 py-1 md:px-2 md:py-2">
        <div class="flex flex-wrap gap-1 md:gap-2 justify-center items-stretch">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="!bg-primary !text-white"
              class="flex flex-col items-center justify-center gap-0.5 px-2 py-2 md:px-4 md:py-3
                     bg-gray-100 rounded-xl min-w-0 flex-1 max-w-[120px] md:max-w-[140px]
                     hover:bg-primary hover:text-white transition-all duration-300
                     hover:scale-105 cursor-pointer"
            >
              <span class="text-2xl md:text-3xl lg:text-4xl leading-none">{{ item.icon }}</span>
              <span class="text-[10px] md:text-xs font-semibold whitespace-nowrap truncate w-full text-center">{{ item.label }}</span>
            </a>
          }
        </div>
      </div>
    </nav>
  `
})
export class NavigationComponent {
  navItems: NavItem[] = [
    { path: '/surahs', label: 'Surahs', icon: '📖' },
    { path: '/duas', label: "Du'as", icon: '🤲' },
    { path: '/hadith', label: 'Hadith', icon: '💎' },
    { path: '/letters', label: 'Letters', icon: '✏️' },
    { path: '/nasheeds', label: 'Nasheeds', icon: '🎵' }
  ];
}
