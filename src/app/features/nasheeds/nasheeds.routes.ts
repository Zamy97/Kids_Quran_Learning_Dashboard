import { Routes } from '@angular/router';

export const NASHEEDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./nasheed-player/nasheed-player.component').then(m => m.NasheedPlayerComponent)
  }
];
