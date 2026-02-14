import { Routes } from '@angular/router';

export const LETTERS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'alphabet',
    pathMatch: 'full'
  },
  {
    path: 'alphabet',
    loadComponent: () => import('./alphabet/alphabet.component').then(m => m.AlphabetComponent)
  },
  {
    path: 'joining',
    loadComponent: () => import('./joining/joining.component').then(m => m.JoiningComponent)
  },
  {
    path: 'words',
    loadComponent: () => import('./words/words.component').then(m => m.WordsComponent)
  }
];
