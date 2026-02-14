import { Routes } from '@angular/router';

export const DUAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dua-list/dua-list.component').then(m => m.DuaListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./dua-detail/dua-detail.component').then(m => m.DuaDetailComponent)
  }
];
