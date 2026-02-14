import { Routes } from '@angular/router';

export const HADITH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./hadith-daily/hadith-daily.component').then(m => m.HadithDailyComponent)
  }
];
