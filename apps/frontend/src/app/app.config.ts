import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { KeycloakService } from './auth/keycloak.service';
import { authInterceptor } from './auth/auth-interceptor';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

function initializeKeycloak(keycloak: KeycloakService) {
  return () => keycloak.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
            darkModeSelector: false
        }
      },
    }),
  ],
};
