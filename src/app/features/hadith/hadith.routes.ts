import { Routes } from '@angular/router';

export const HADITH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./hadith-list/hadith-list.component').then(m => m.HadithListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./hadith-detail/hadith-detail.component').then(m => m.HadithDetailComponent)
  }
];
