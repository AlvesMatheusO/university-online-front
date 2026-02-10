// apps/frontend/src/app/components/header/header.component.ts
import { Component, inject } from '@angular/core';
import { KeycloakService } from '../../auth/keycloak.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header>
      @if (!isLoggedIn) {
        <div>
          <button (click)="login()">Login</button>
        </div>
      }
      @if (isLoggedIn) {
        <div>
          <span>Olá, {{ userEmail }}</span>
          <button (click)="logout()">Logout</button>
        </div>
      }
    </header>
  `
})
export class HeaderComponent {
  keycloak = inject(KeycloakService);

  get isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  get userEmail(): string {
    const profile = this.keycloak.userProfile;
    return profile?.['email'] || '';
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }
}