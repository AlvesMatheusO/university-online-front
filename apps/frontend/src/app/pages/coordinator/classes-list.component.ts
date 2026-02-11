// apps/frontend/src/app/pages/coordinator/classes-list.component.ts
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ClassService } from 'apps/frontend/src/services/class.service';
import { ClassCardComponent } from '../../components/card/class-card.component';
import { Class } from '../../models/class.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-classes-list',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
    ClassCardComponent,
  ],
  template: `
    <div class="classes-container">
      <div class="page-header">
        <div>
          <h1>Disciplinas</h1>
          <p class="subtitle">Gerencie as disciplinas do curso</p>
        </div>
        <p-button
          label="Nova Disciplina"
          icon="pi pi-plus"
          (onClick)="createClass()"
        >
        </p-button>
      </div>

      @if (loading$ | async) {
        <div class="loading-container">
          <p-progressSpinner></p-progressSpinner>
          <p>Carregando disciplinas...</p>
        </div>
      } @else if (classes$ | async; as classes) {
        @if (classes.length === 0) {
          <div class="empty-state">
            <i class="pi pi-inbox"></i>
            <h3>Nenhuma disciplina cadastrada</h3>
            <p>Comece criando sua primeira disciplina</p>
            <p-button
              label="Criar Disciplina"
              icon="pi pi-plus"
              (onClick)="createClass()"
            >
            </p-button>
          </div>
        } @else {
          <div class="classes-grid">
            @for (class of classes; track class.id) {
              <app-class-card
                [class]="class"
                (view)="viewClass($event)"
                (edit)="editClass($event)"
                (delete)="deleteClass($event)"
              >
              </app-class-card>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .classes-container {
        padding: 2rem;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .page-header h1 {
        font-size: 2rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: #2d3748;
      }

      .subtitle {
        color: #718096;
        margin: 0;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem;
        gap: 1rem;
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
      }

      .empty-state i {
        font-size: 4rem;
        color: #cbd5e0;
        margin-bottom: 1rem;
      }

      .empty-state h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: #2d3748;
      }

      .empty-state p {
        color: #718096;
        margin-bottom: 1.5rem;
      }

      .classes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      @media (max-width: 768px) {
        .classes-container {
          padding: 1rem;
        }

        .page-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        .classes-grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ClassesListComponent implements OnInit, OnDestroy {
  private classService = inject(ClassService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

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
        next: () => console.log('Disciplinas carregadas'),
        error: (error) => console.error('Erro ao carregar:', error),
      });
  }

  createClass() {
    this.router.navigate(['/coordinator/classes/new']);
  }

  viewClass(classData: Class) {
    console.log('Visualizar:', classData);
    this.router.navigate(['/coordinator/classes', classData.id]);
  }

  editClass(classData: Class) {
    console.log('Editar:', classData);
    this.router.navigate(['/coordinator/classes', classData.id, 'edit']);
  }

  deleteClass(classData: Class) {
    if (confirm(`Deseja realmente excluir a disciplina "${classData.name}"?`)) {
      this.classService
        .deleteClass(classData.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('Disciplina excluída com sucesso');
          },
          error: (error) => {
            console.error('Erro ao excluir:', error);
            alert('Erro ao excluir disciplina');
          },
        });
    }
  }
}
