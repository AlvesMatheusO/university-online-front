// apps/frontend/src/app/app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeycloakService } from './auth/keycloak.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  template: `
    <div class="container">
      <header>
        <h1>Academic System</h1>
        
        @if (!isLoggedIn) {
          <div class="auth-section">
            <p>Você não está autenticado</p>
            <button (click)="login()" class="btn-primary">Login</button>
          </div>
        }

        @if (isLoggedIn) {
          <div class="auth-section">
            <p>Bem-vindo, {{ userEmail }}</p>
            <p>Roles: {{ userRoles.join(', ') }}</p>
            <button (click)="logout()" class="btn-secondary">Logout</button>
          </div>
        }
      </header>

      @if (isLoggedIn) {
        <nav>
          <h2>Navegação por Role:</h2>
          <ul>
            <li>
              <a routerLink="/admin" routerLinkActive="active">
                Admin (precisa role ADMIN)
              </a>
            </li>
            <li>
              <a routerLink="/coordinator" routerLinkActive="active">
                Coordenador (precisa role COORDINATOR)
              </a>
            </li>
            <li>
              <a routerLink="/student" routerLinkActive="active">
                Estudante (precisa role STUDENT)
              </a>
            </li>
            <li>
              <a routerLink="/public" routerLinkActive="active">
                Público (sem proteção)
              </a>
            </li>
          </ul>
        </nav>
      }

      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: system-ui, -apple-system, sans-serif;
    }

    header {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    h1 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .auth-section {
      margin-top: 10px;
    }

    .auth-section p {
      margin: 5px 0;
    }

    nav {
      background: #e0e0e0;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    nav h2 {
      margin-top: 0;
      font-size: 1.2em;
    }

    nav ul {
      list-style: none;
      padding: 0;
      margin: 10px 0 0 0;
    }

    nav li {
      margin: 10px 0;
    }

    nav a {
      color: #333;
      text-decoration: none;
      padding: 8px 12px;
      display: inline-block;
      border-radius: 4px;
      transition: background 0.2s;
    }

    nav a:hover {
      background: #ccc;
    }

    nav a.active {
      background: #007bff;
      color: white;
    }

    button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: opacity 0.2s;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    button:hover {
      opacity: 0.8;
    }

    main {
      background: white;
      padding: 20px;
      border-radius: 8px;
      min-height: 300px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
  `]
})
export class AppComponent implements OnInit {
  keycloak = inject(KeycloakService);

  ngOnInit() {
    console.log('🚀 App initialized');
    console.log('📝 Is logged in:', this.isLoggedIn);
    console.log('👤 User roles:', this.userRoles);
  }

  get isLoggedIn(): boolean {
    return this.keycloak.isLoggedIn();
  }

  get userEmail(): string {
    const profile = this.keycloak.userProfile;
    return profile?.['email'] || 'N/A';
  }

  get userRoles(): string[] {
    return this.keycloak.roles;
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }
}