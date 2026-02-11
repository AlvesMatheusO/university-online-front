// apps/frontend/src/app/pages/coordinator/dashboard-home.component.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KeycloakService } from '../../auth/keycloak.service';
import { ClassService } from 'apps/frontend/src/services/class.service';
import { ClassCardComponent } from '../../components/card/class-card.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  standalone: true,
  imports: [CommonModule, ClassCardComponent],
  template: `
    <div class="dashboard-home">
      <div class="welcome-section">
        <h1>Dashboard do Coordenador</h1>
        <p>Bem-vindo, {{ (user$ | async)?.['email'] }}</p>
      </div>

      <div class="stats">
        <div class="stat-card">
          <div class="stat-icon" style="background: #3b82f6;">
            <i class="pi pi-book"></i>
          </div>
          <div class="stat-content">
            <h3>{{ (classes$ | async)?.length || 0 }}</h3>
            <p>Disciplinas</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #10b981;">
            <i class="pi pi-users"></i>
          </div>
          <div class="stat-content">
            <h3>345</h3>
            <p>Alunos</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #f59e0b;">
            <i class="pi pi-user"></i>
          </div>
          <div class="stat-content">
            <h3>28</h3>
            <p>Professores</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #8b5cf6;">
            <i class="pi pi-calendar"></i>
          </div>
          <div class="stat-content">
            <h3>12</h3>
            <p>Turmas Ativas</p>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h2>Disciplinas</h2>
          <button class="btn-view-all" (click)="viewAllClasses()">
            Ver todas
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>

        @if (loading$ | async) {
          <div class="loading">
            <div class="spinner"></div>
            <p>Carregando disciplinas...</p>
          </div>
        } @else if (classes$ | async; as classes) {
          @if (classes.length === 0) {
            <div class="empty-state">
              <i class="pi pi-inbox"></i>
              <p>Nenhuma disciplina cadastrada</p>
            </div>
          } @else {
            <div class="classes-grid">
              @for (class of classes.slice(0, 6); track class.id) {
                <app-class-card [class]="class"></app-class-card>
              }
            </div>

            @if (classes.length > 6) {
              <div class="view-more">
                <button class="btn-secondary" (click)="viewAllClasses()">
                  Ver todas as {{ classes.length }} disciplinas
                </button>
              </div>
            }
          }
        }
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-home {
        padding: 2rem;
        max-width: 1400px;
      }

      .welcome-section {
        margin-bottom: 2rem;
      }

      .welcome-section h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: #1e293b;
      }

      .welcome-section p {
        color: #64748b;
        margin: 0;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.5rem;
        margin-bottom: 3rem;
      }

      .stat-card {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;
        transition: transform 0.2s;
      }

      .stat-card:hover {
        transform: translateY(-2px);
      }

      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      }

      .stat-icon i {
        font-size: 1.5rem;
      }

      .stat-content h3 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
        color: #1e293b;
      }

      .stat-content p {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0;
      }

      .section {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .section-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0;
        color: #1e293b;
      }

      .btn-view-all {
        background: transparent;
        border: none;
        color: #667eea;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        transition: background 0.2s;
        font-size: 0.875rem;
      }

      .btn-view-all:hover {
        background: #f1f5f9;
      }

      .loading {
        text-align: center;
        padding: 3rem;
        color: #64748b;
      }

      .spinner {
        width: 40px;
        height: 40px;
        margin: 0 auto 1rem;
        border: 3px solid #f3f4f6;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .empty-state {
        text-align: center;
        padding: 3rem;
      }

      .empty-state i {
        font-size: 3rem;
        color: #cbd5e0;
        margin-bottom: 1rem;
      }

      .empty-state p {
        color: #64748b;
        margin: 0;
      }

      .classes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .view-more {
        margin-top: 2rem;
        text-align: center;
      }

      .btn-secondary {
        background: #f8f9fa;
        border: 1px solid #e5e7eb;
        color: #374151;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-secondary:hover {
        background: #e5e7eb;
        transform: translateY(-1px);
      }

      @media (max-width: 768px) {
        .dashboard-home {
          padding: 1rem;
        }

        .stats {
          grid-template-columns: 1fr;
        }

        .classes-grid {
          grid-template-columns: 1fr;
        }

        .section {
          padding: 1.5rem;
        }
      }
    `,
  ],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private keycloak = inject(KeycloakService);
  private classService = inject(ClassService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  user$ = this.keycloak.user$;
  classes$ = this.classService.classes$;
  loading$ = this.classService.loading$;

  ngOnInit() {
    this.loadClasses();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadClasses() {
    this.classService
      .getClasses()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (classes) =>
          console.log('✅ Disciplinas carregadas:', classes.length),
        error: (error) =>
          console.error('❌ Erro ao carregar disciplinas:', error),
      });
  }

  viewAllClasses() {
    this.router.navigate(['/coordinator/classes']);
  }
}
