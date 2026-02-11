import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../auth/keycloak.service';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="layout">
      <aside>
        <h3>Área do Coordenador</h3>
        <ul>
          <li><a routerLink="dashboard">Dashboard</a></li>
          <li><a routerLink="classes">Matriz Curricular</a></li>
        </ul>
      </aside>

      <section class="content">
        <header>
          <span>Bem-vindo Coordenador</span>
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
    .layout {
      display: flex;
      height: 100vh;
    }

    aside {
      width: 250px;
      background: #1e293b;
      color: white;
      padding: 20px;
    }

    aside a {
      color: white;
      text-decoration: none;
      display: block;
      margin: 10px 0;
    }

    .content {
      flex: 1;
      padding: 20px;
      background: #f8f9fa;
    }

    header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
  `]
})
export class CoordinatorLayoutComponent {
  private keycloak = inject(KeycloakService);

  logout() {
    this.keycloak.logout().subscribe();
  }
}
