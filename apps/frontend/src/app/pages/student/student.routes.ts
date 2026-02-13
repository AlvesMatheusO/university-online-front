import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./home.component').then((m) => m.HomeComponent),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      {
        path: 'home',
        loadComponent: () =>
          import('./student-classes.component').then(
            (m) => m.StudentClassesComponent,
          ),
      },

      {
        path: 'enrollment',
        loadComponent: () =>
          import('./student-enrollment.component').then(
            (m) => m.StudentEnrollmentComponent,
          ),
      },
    ],
  },
];
