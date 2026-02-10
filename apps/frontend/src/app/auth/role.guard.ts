// apps/frontend/src/app/auth/role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { KeycloakService } from './keycloak.service';
import { map, take } from 'rxjs/operators';

export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const keycloak = inject(KeycloakService);
    const router = inject(Router);

    // Verificar de forma síncrona primeiro
    if (!keycloak.isLoggedIn()) {
      keycloak.login().subscribe();
      return false;
    }

    // Verificar role de forma reativa
    return keycloak.hasRole$(requiredRole).pipe(
      take(1),
      map(hasRole => {
        if (!hasRole) {
          console.warn(`Acesso negado. Role necessária: ${requiredRole}`);
          router.navigate(['/unauthorized']);
          return false;
        }
        return true;
      })
    );
  };
};