import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ClassService } from 'apps/frontend/src/services/class.service';
import { ClassCardComponent } from '../../components/card/class-card.component';
import { ClassFormModalComponent } from '../../components/modal/class-form-modal.component';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-classes-page',
  standalone: true,
  imports: [
    CommonModule,
    ClassCardComponent,
    FormsModule,
    ButtonModule,
    ClassFormModalComponent,
  ],
  template: `
    <div class="classes-page">
      <!-- Barra de pesquisa e filtros -->
      <div class="search-bar">
        <div class="search-header">
          <h2>Turmas</h2>
          <p-button
            label="Nova Turma"
            icon="pi pi-plus"
            [style]="{
              'background-color': '#1e293b',
              'border-color': '#1e293b',
            }"
            (onClick)="showModal = true"
          />
        </div>
        <div class="search-input">
          <i class="pi pi-search"></i>
          <input
            type="text"
            placeholder="Buscar turmas..."
            [(ngModel)]="searchTerm"
            (input)="onSearch()"
          />
        </div>
        <div class="filters">
          <select
            class="filter-select"
            [(ngModel)]="statusFilter"
            (change)="onFilterChange()"
          >
            <option value="">Todos os status</option>
            <option value="ATIVA">Ativas</option>
            <option value="INATIVA">Inativas</option>
            <option value="ENCERRADA">Encerradas</option>
          </select>
          <select
            class="filter-select"
            [(ngModel)]="sortBy"
            (change)="onSortChange()"
          >
            <option value="">Ordenar por</option>
            <option value="subject">Disciplina</option>
            <option value="professor">Professor</option>
            <option value="code">Código</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading$ | async) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Carregando turmas...</p>
        </div>
      } @else if (filteredClasses$ | async; as classes) {
        <!-- Empty State -->
        @if (classes.length === 0) {
          <div class="empty-state">
            <i class="pi pi-inbox"></i>
            <h3>Nenhuma turma encontrada</h3>
            <p>Não há turmas que correspondam aos filtros selecionados</p>
          </div>
        } @else {
          <!-- Grid de Cards -->
          <div class="classes-grid">
            @for (class of classes; track class.id) {
              <app-class-card [class]="class"></app-class-card>
            }
          </div>
        }
      }
    </div>

    <app-class-form-modal
      [(visible)]="showModal"
      (classCreated)="onClassCreated($event)"
    />
  `,
  styles: [
    `
      .classes-page {
        padding: 2rem;
        max-width: 1600px;
        margin: 0 auto;
      }

      .search-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }

      .search-header h2 {
        margin: 0;
      }

      .search-bar {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        margin-bottom: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .search-input {
        position: relative;
        margin-bottom: 1rem;
      }

      .search-input i {
        position: absolute;
        left: 1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
        font-size: 1rem;
      }

      .search-input input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.938rem;
        font-family: 'Roboto', sans-serif;
        transition: border-color 0.2s;
      }

      .search-input input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .filters {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .filter-select {
        padding: 0.5rem 1rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.875rem;
        font-family: 'Roboto', sans-serif;
        cursor: pointer;
        background: white;
        transition: border-color 0.2s;
      }

      .filter-select:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .loading {
        text-align: center;
        padding: 4rem;
        color: #64748b;
      }

      .spinner {
        width: 48px;
        height: 48px;
        margin: 0 auto 1.5rem;
        border: 4px solid #f3f4f6;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .loading p {
        font-size: 1rem;
        font-weight: 500;
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .empty-state i {
        font-size: 4rem;
        color: #cbd5e0;
        margin-bottom: 1.5rem;
      }

      .empty-state h3 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0 0 0.5rem 0;
        color: #1e293b;
      }

      .empty-state p {
        color: #64748b;
        margin: 0;
      }

      .classes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      @media (max-width: 768px) {
        .classes-page {
          padding: 1rem;
        }

        .classes-grid {
          grid-template-columns: 1fr;
        }

        .filters {
          flex-direction: column;
        }

        .filter-select {
          width: 100%;
        }
      }
    `,
  ],
})
export class ClassesListComponent implements OnInit, OnDestroy {
  private classService = inject(ClassService);
  private destroy$ = new Subject<void>();

  classes$ = this.classService.classes$;
  loading$ = this.classService.loading$;
  filteredClasses$ = this.classService.classes$;

  searchTerm = '';
  statusFilter = '';
  sortBy = '';
  showModal = false;

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
        next: (classes) => {
          console.log('✅ Turmas carregadas:', classes.length);
        },
        error: (error) => {
          console.error('❌ Erro ao carregar turmas:', error);
        },
      });
  }

  onClassCreated(newClass: any) {
    console.log('🎉 Nova turma criada:', newClass);
    // A lista será atualizada automaticamente pelo BehaviorSubject no service
  }

  onSearch() {
    // Implementar filtro de busca
    console.log('Buscando:', this.searchTerm);
  }

  onFilterChange() {
    // Implementar filtro de status
    console.log('Filtro de status:', this.statusFilter);
  }

  onSortChange() {
    // Implementar ordenação
    console.log('Ordenar por:', this.sortBy);
  }
}
