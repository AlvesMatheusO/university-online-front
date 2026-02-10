import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { KeycloakService } from './keycloak.service';

export const roleGuard = (requiredRole: string): CanActivateFn => {
  return () => {
    const keycloak = inject(KeycloakService);
    const router = inject(Router);

    if (!keycloak.isLoggedIn()) {
      keycloak.login();
      return false;
    }

    if (!keycloak.hasRole(requiredRole)) {
      console.warn(`Acesso negado. Role necessária: ${requiredRole}`);
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
};