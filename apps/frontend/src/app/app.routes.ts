import { Route } from '@angular/router';
import { roleGuard } from './auth/role.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/public',
    pathMatch: 'full',
  },
  {
    path: 'public',
    loadComponent: () =>
      import('./pages/public.component').then((m) => m.PublicComponent),
  },
  {
    path: 'admin',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () => import('./admin/admin').then((m) => m.Admin),
  },
  {
    path: 'coordinator',
    canActivate: [roleGuard('COORDINATOR')],
    loadComponent: () =>
      import('./pages/coordinator.component').then(
        (m) => m.CoordinatorComponent,
      ),
  },
  {
    path: 'student',
    canActivate: [roleGuard('STUDENT')],
    loadComponent: () =>
      import('./pages/student.component').then((m) => m.StudentComponent),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthotized.component').then(
        (m) => m.UnauthorizedComponent,
      ),
  },
];
