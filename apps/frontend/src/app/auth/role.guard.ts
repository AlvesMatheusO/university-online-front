// apps/frontend/src/app/auth/role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { KeycloakService } from './keycloak.service';
import { map, take } from 'rxjs/operators';

export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const keycloak = inject(KeycloakService);
    const router = inject(Router);

    console.log(`🛡️ Guard verificando role: ${requiredRole}`);

    return keycloak.isAuthenticated$.pipe(
      take(1),
      map(isAuth => {
        if (!isAuth) {
          console.log('❌ Não autenticado, redirecionando para login');
          keycloak.login().subscribe();
          return false;
        }

        const hasRole = keycloak.hasRole(requiredRole);
        console.log(`🎭 Usuário tem role ${requiredRole}?`, hasRole);
        console.log('🎭 Roles do usuário:', keycloak.roles);

        if (!hasRole) {
          console.log(`⚠️ Acesso negado. Role necessária: ${requiredRole}`);
          router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      })
    );
  };
};