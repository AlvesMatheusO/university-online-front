import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { KeycloakService } from '../auth/keycloak.service';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [ButtonModule, RouterOutlet],
  template: `
    <div class="admin-container">
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
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
    }

    .content {
      margin-top: 20px;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    header span {
      font-size: 18px;
      font-weight: 500;
    }
  `]
})
export class AdminComponent {
  private keycloak = inject(KeycloakService);
  
  logout() {
    this.keycloak.logout().subscribe();
  }
}