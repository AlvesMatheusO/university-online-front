import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../auth/keycloak.service';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
  ],
  template: `
    <div class="layout">
      <aside>
        <h3>Área do Coordenador</h3>
        <ul>
          <li>
            <a routerLink="dashboard" routerLinkActive="active">Dashboard</a>
          </li>
          <li>
            <a routerLink="classes" routerLinkActive="active">Disciplinas</a>
          </li>
        </ul>
      </aside>

      <section class="content">
        <header>
          <span>
            @if (user$ | async; as user) {
              Bem-vindo,
              {{ user['name'] || user['preferred_username'] || user['email'] }}
            }
          </span>
          <p-button label="Logout" icon="pi pi-sign-out" (onClick)="logout()">
          </p-button>
        </header>

        <router-outlet></router-outlet>
      </section>
    </div>
  `,
  styles: [
    `
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

      aside h3 {
        margin-bottom: 2rem;
        font-size: 1.25rem;
      }

      aside ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      aside a {
        color: white;
        text-decoration: none;
        display: block;
        padding: 0.75rem 1rem;
        margin: 0.25rem 0;
        border-radius: 6px;
        transition: background 0.2s;
      }

      aside a:hover {
        background: rgba(255, 255, 255, 0.1);
      }

      aside a.active {
        background: rgba(255, 255, 255, 0.2);
        font-weight: 600;
      }

      .content {
        flex: 1;
        background: #f8f9fa;
        overflow-y: auto;
      }

      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 2rem;
        background: white;
        border-border: 1px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }

      header span {
        font-size: 1.125rem;
        font-weight: 500;
        color: #2d3748;
      }
    `,
  ],
})
export class DashboardHomeComponent {  
  private keycloak = inject(KeycloakService);

  user$ = this.keycloak.user$;

  logout() {
    this.keycloak.logout().subscribe();
  }
}