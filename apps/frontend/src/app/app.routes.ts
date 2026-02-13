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
      import('./admin/admin.component').then((m) => m.AdminComponent),  
  },
  {
    path: 'coordinator',
    canActivate: [roleGuard('COORDINATOR')],
    loadChildren: () =>
      import('./pages/coordinator/coordinator.routes').then((m) => m.coordinatorRoutes),
  },
  {
    path: 'student',
    canActivate: [roleGuard('STUDENT')],
    loadChildren: () =>
      import('./pages/student/student.routes').then((m) => m.studentRoutes),
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