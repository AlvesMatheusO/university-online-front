// import { Route } from '@angular/router';

// export const coordinatorRoutes: Route[] = [
//   {
//     path: '',
//     loadComponent: () =>
//       import('./coordinator/dashboard.component')
//         .then(m => m.CoordinatorLayoutComponent),
//     children: [
//       {
//         path: '',
//         redirectTo: 'dashboard',
//         pathMatch: 'full',
//       },
//       {
//         path: 'classes',
//         loadComponent: () =>
//           import('./coordinator/classes.component')
//             .then(m => m.ClassesListComponent),
//       },
//     ],
//   },
// ];
// apps/frontend/src/app/pages/coordinator.routes.ts
import { Route } from '@angular/router';

export const coordinatorRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./coordinator/dashboard.component').then(
        (m) => m.CoordinatorLayoutComponent,
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
