// apps/frontend/src/app/pages/public.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakService } from '../auth/keycloak.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="public-page">
      <nav class="navbar">
        <div class="nav-container">
          <div class="logo">Academic System</div>
          @if (!(isAuthenticated$ | async)) {
            <button (click)="login()" class="btn-nav-login">
              Login
            </button>
          } @else {
            <div class="user-info">
              <span class="user-email">{{ (user$ | async)?.['email'] }}</span>
              <button (click)="goToDashboard()" class="btn-dashboard">
                Dashboard
              </button>
            </div>
          }
        </div>
      </nav>

      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Sistema de Gestão Acadêmica</h1>
          <p class="hero-subtitle">
            Plataforma completa para coordenadores, professores e estudantes gerenciarem 
            suas atividades acadêmicas de forma integrada e eficiente.
          </p>
          
          @if (!(isAuthenticated$ | async)) {
            <div class="cta-buttons">
              <button (click)="login()" class="btn-primary">
                Acessar Sistema
              </button>
              <button class="btn-secondary">
                Saiba Mais
              </button>
            </div>
          }
        </div>
      </section>

      <section class="features">
        <div class="container">
          <h2 class="section-title">Recursos Principais</h2>
          
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3>Gestão de Currículo</h3>
              <p>Organize e acompanhe matrizes curriculares, disciplinas e planos de curso de forma centralizada.</p>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3>Controle de Turmas</h3>
              <p>Gerencie turmas, matrículas, frequência e desempenho acadêmico em tempo real.</p>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3>Relatórios e Análises</h3>
              <p>Visualize métricas, indicadores de desempenho e gere relatórios personalizados.</p>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3>Segurança e Privacidade</h3>
              <p>Autenticação segura com controle de acesso baseado em perfis e permissões.</p>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3>Calendário Acadêmico</h3>
              <p>Planeje e acompanhe eventos, prazos e atividades do semestre letivo.</p>
            </div>

            <div class="feature-item">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3>Comunicação Integrada</h3>
              <p>Facilite a comunicação entre coordenadores, professores e alunos.</p>
            </div>
          </div>
        </div>
      </section>

      <footer class="footer">
        <div class="container">
          <p>&copy; 2025 Academic System. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .public-page {
      min-height: 100vh;
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    /* Navbar */
    .navbar {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-email {
      color: #6b7280;
      font-size: 0.875rem;
    }

    /* Buttons */
    button {
      border: none;
      padding: 0.625rem 1.5rem;
      border-radius: 8px;
      font-size: 0.938rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .btn-nav-login {
      background: #667eea;
      color: white;
    }

    .btn-nav-login:hover {
      background: #5568d3;
      transform: translateY(-1px);
    }

    .btn-dashboard {
      background: #f3f4f6;
      color: #374151;
    }

    .btn-dashboard:hover {
      background: #e5e7eb;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2rem;
      font-size: 1.125rem;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: transparent;
      color: #667eea;
      border: 2px solid #667eea;
      padding: 1rem 2rem;
      font-size: 1.125rem;
    }

    .btn-secondary:hover {
      background: #667eea;
      color: white;
    }

    /* Hero Section */
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 6rem 2rem;
      text-align: center;
      color: white;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      line-height: 1.2;
      letter-spacing: -0.025em;
    }

    .hero-subtitle {
      font-size: 1.25rem;
      line-height: 1.8;
      opacity: 0.95;
      margin-bottom: 2.5rem;
      font-weight: 400;
    }

    .cta-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    /* Features Section */
    .features {
      padding: 6rem 2rem;
      background: #f9fafb;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .section-title {
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 4rem;
      color: #111827;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .feature-item {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .feature-icon svg {
      width: 28px;
      height: 28px;
      color: white;
    }

    .feature-item h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: #111827;
    }

    .feature-item p {
      color: #6b7280;
      line-height: 1.6;
      font-size: 0.938rem;
    }

    /* Footer */
    .footer {
      background: #111827;
      color: #9ca3af;
      padding: 2rem;
      text-align: center;
    }

    .footer p {
      font-size: 0.875rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1rem;
      }

      .section-title {
        font-size: 1.75rem;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .nav-container {
        padding: 1rem;
      }

      .cta-buttons {
        flex-direction: column;
      }

      .btn-primary, .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class PublicComponent {
  private keycloak = inject(KeycloakService);

  isAuthenticated$: Observable<boolean> = this.keycloak.isAuthenticated$;
  user$ = this.keycloak.user$;

  login() {
    this.keycloak.login().subscribe({
      next: () => console.log('Login iniciado'),
      error: (error) => console.error('Erro no login:', error)
    });
  }

  goToDashboard() {
    const roles = this.keycloak.roles;
    
    if (roles.includes('ADMIN')) {
      window.location.href = '/admin';
    } else if (roles.includes('COORDINATOR')) {
      window.location.href = '/coordinator';
    } else if (roles.includes('STUDENT')) {
      window.location.href = '/student';
    }
  }
}