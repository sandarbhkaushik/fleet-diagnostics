import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./features/event-explorer/event-explorer.component').then((m) => m.EventExplorerComponent),
  },
];
