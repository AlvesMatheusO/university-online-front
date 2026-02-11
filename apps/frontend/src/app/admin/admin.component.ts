import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeycloakService } from '../auth/keycloak.service';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  template: `
    <h2>Painel do Administrador</h2>

    <section class="content">
      <header>
        <span>Bem-vindo Administrador</span>
        <p-button
          label="Logout"
          icon="pi pi-sign-out"
          (onClick)="logout()">
        </p-button>
      </header>

      <router-outlet></router-outlet>
    </section>
  `,
  imports: [ButtonModule, RouterOutlet],
})
export class AdminComponent {
  private keycloak = inject(KeycloakService);

  logout() {
    this.keycloak.logout().subscribe();
  }
}
