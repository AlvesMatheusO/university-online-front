import { Route } from '@angular/router';
import { roleGuard } from '../auth/role.guard';

export const coordinatorRoutes: Route[] = [
  {
    path: '',
    canActivate: [roleGuard('COORDINATOR')],
    loadComponent: () =>
      import('./coordinator/dashboard.component')
        .then(m => m.CoordinatorDashboardComponent),
    children: [
      // {
      //   path: 'classes',
      //   loadComponent: () =>
      //     import('./coordinator/classes.component')
      //       .then(m => m.CoordinatorClassesComponent),
      // },
      // {
      //   path: 'classes/new',
      //   loadComponent: () =>
      //     import('./coordinator/new-classes.component')
      //       .then(m => m.CoordinatorNewClassComponent),
      // },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
