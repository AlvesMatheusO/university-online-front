import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../../auth/keycloak.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home', // Ajuste o seletor se necessário
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <div class="layout">
      <aside>
        <div class="brand">
          <i class="pi pi-graduation-cap"></i>
          <h3>Portal do Aluno</h3>
        </div>
        <nav>
          <ul>
            <li>
              <a routerLink="home" routerLinkActive="active">
                <i class="pi pi-home"></i> Minhas Disciplinas
              </a>
            </li>
            <li>
              <a routerLink="enrollment" routerLinkActive="active">
                <i class="pi pi-plus-circle"></i> Matrícula Online
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <section class="content">
        <header>
          <div class="user-welcome">
            @if (user$ | async; as user) {
              <div class="avatar">
                {{ (user['name'] || 'U')[0] }}
              </div>
              <div class="welcome-text">
                <span class="greeting">Bem-vindo(a),</span>
                <span class="user-name">{{ user['name'] || user['preferred_username'] }}</span>
              </div>
            }
          </div>
          <p-button
            label="Sair"
            icon="pi pi-sign-out"
            styleClass="p-button-rounded p-button-text p-button-danger"
            (onClick)="logout()"
          >
          </p-button>
        </header>

        <main class="main-container">
          <router-outlet></router-outlet>
        </main>
      </section>
    </div>
  `,
  styles: [`
    /* Seus estilos originais da Sidebar */
    .layout { display: flex; height: 100vh; font-family: 'Inter', sans-serif; }
    aside { width: 280px; background: #064e3b; color: white; padding: 24px; display: flex; flex-direction: column; }
    .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 2.5rem; color: #34d399; }
    .brand i { font-size: 1.5rem; }
    .brand h3 { margin: 0; font-size: 1.1rem; font-weight: 700; text-transform: uppercase; }
    ul { list-style: none; padding: 0; margin: 0; }
    a { color: #ecfdf5; text-decoration: none; display: flex; align-items: center; gap: 12px; padding: 0.85rem 1rem; margin-bottom: 0.5rem; border-radius: 8px; transition: all 0.3s; cursor: pointer; }
    a:hover { background: rgba(52, 211, 153, 0.1); color: #34d399; }
    a.active { background: #059669; color: white; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
    .content { flex: 1; background: #f0fdf4; overflow-y: auto; display: flex; flex-direction: column; }
    header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: white; border-bottom: 1px solid #d1fae5; }
    .user-welcome { display: flex; align-items: center; gap: 12px; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #10b981; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; }
    .welcome-text { display: flex; flex-direction: column; }
    .greeting { font-size: 0.75rem; color: #6b7280; }
    .user-name { font-weight: 600; color: #064e3b; }
    .main-container { padding: 2rem; flex: 1; }
  `]
})
export class HomeComponent {
  private keycloak = inject(KeycloakService);
  user$ = this.keycloak.user$;

  logout() {
    this.keycloak.logout().subscribe();
  }
}