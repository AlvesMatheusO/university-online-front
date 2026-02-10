import { Route } from '@angular/router';
import { roleGuard } from './auth/role.guard';

export const appRoutes: Route[] = [
  {
    path: 'admin',
    canActivate: [roleGuard('ADMIN')],
    loadComponent: () => import('./admin/admin').then((m) => m.Admin),
  },
];
