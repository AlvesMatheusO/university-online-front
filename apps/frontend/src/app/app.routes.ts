// apps/frontend/src/app/app.routes.ts
import { Route } from '@angular/router';
import { roleGuard } from './auth/role.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./auth/auth-redirect.component').then(
        (m) => m.AuthRedirectComponent,
      ),
  },
  {
    path: 'public',
    loadComponent: () =>
      import('./pages/public.component').then((m) => m.PublicComponent),
  },
  {
    path: 'admin',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () => 
      import('./admin/admin.component').then((m) => m.AdminComponent),  // ← MUDANÇA AQUI
  },
  {
    path: 'coordinator',
    canActivate: [roleGuard('COORDINATOR')],
    loadChildren: () =>
      import('./pages/coordinator.routes').then((m) => m.coordinatorRoutes),
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
  {
    path: '**',
    redirectTo: '',
  },
];