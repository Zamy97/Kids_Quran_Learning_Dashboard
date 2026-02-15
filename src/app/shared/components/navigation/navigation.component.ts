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
    <nav class="bg-white shadow-md sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-2 py-3">
        <div class="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide justify-center">
          @for (item of navItems; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="!bg-primary !text-white"
              class="flex flex-col items-center gap-1 px-4 py-3 md:px-6 md:py-4
                     bg-gray-100 rounded-2xl min-w-[100px] md:min-w-[120px]
                     hover:bg-primary hover:text-white transition-all duration-300
                     hover:scale-105 cursor-pointer"
            >
              <span class="text-3xl md:text-4xl">{{ item.icon }}</span>
              <span class="text-xs md:text-sm font-semibold whitespace-nowrap">{{ item.label }}</span>
            </a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
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
