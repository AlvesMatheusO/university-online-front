import { Route } from '@angular/router';

export const coordinatorRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./coordinator/dashboard.component').then(
        (m) => m.DashboardHomeComponent,
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'classes',
        loadComponent: () =>
          import('./coordinator/classes-list.component').then(
            (m) => m.ClassesListComponent,
          ),
      },
    ],
  },
];
