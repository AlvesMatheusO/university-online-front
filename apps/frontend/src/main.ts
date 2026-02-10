import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { KeycloakService } from './app/auth/keycloak.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth/auth-interceptor';

// bootstrapApplication(App, appConfig).catch((err) => console.error(err));

const keycloak = new KeycloakService();

keycloak.init().then(() => {
  bootstrapApplication(App, {
    providers: [
      { provide: KeycloakService, useValue: keycloak },
      provideHttpClient(withInterceptors([authInterceptor])),
    ],
  });
});
