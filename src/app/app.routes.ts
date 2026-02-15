import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/surahs',
    pathMatch: 'full'
  },
  {
    path: 'surahs',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/surahs/surah-list/surah-list.component').then(m => m.SurahListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/surahs/surah-detail/surah-detail.component').then(m => m.SurahDetailComponent)
      }
    ]
  },
  {
    path: 'duas',
    loadChildren: () => import('./features/duas/duas.routes').then(m => m.DUAS_ROUTES)
  },
  {
    path: 'hadith',
    loadChildren: () => import('./features/hadith/hadith.routes').then(m => m.HADITH_ROUTES)
  },
  {
    path: 'letters',
    loadChildren: () => import('./features/letters/letters.routes').then(m => m.LETTERS_ROUTES)
  },
  {
    path: 'nasheeds',
    loadChildren: () => import('./features/nasheeds/nasheeds.routes').then(m => m.NASHEEDS_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/surahs'
  }
];
