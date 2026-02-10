import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { KeycloakService } from './keycloak.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(KeycloakService);
  const token = keycloak.token;

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
