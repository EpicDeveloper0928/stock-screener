import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'screener',
    pathMatch: 'full',
  },
  {
    path: 'screener',
    loadComponent: () =>
      import('./features/stock-screener/stock-screener.component').then(
        m => m.StockScreenerComponent
      ),
  },
];
