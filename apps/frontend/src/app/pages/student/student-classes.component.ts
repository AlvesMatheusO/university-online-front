import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { StudentService } from 'apps/frontend/src/services/student.service';
import { KeycloakService } from '../../auth/keycloak.service';
import { ClassCardComponent } from '../../components/card/class-card.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserService } from 'apps/frontend/src/services/user.service';

@Component({
  selector: 'app-student-classes',
  standalone: true,
  imports: [CommonModule, ClassCardComponent],
  template: `
    <div class="student-dashboard">
      <div class="header-section">
        <h2>Minhas Disciplinas</h2>
        <p>Acompanhe suas turmas e horários para o semestre atual.</p>
      </div>

      @if (loading$ | async) {
        <div class="loading-container">
          <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
          <p>Carregando sua grade horária...</p>
        </div>
      } @else {
        <div class="classes-grid">
          @for (class of classes$ | async; track class.id) {
            <app-class-card [class]="class"></app-class-card>
          } @empty {
            <div class="empty-state">
              <i class="pi pi-search"></i>
              <h3>Nenhuma matrícula encontrada</h3>
              <p>Você ainda não se matriculou em nenhuma disciplina.</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .student-dashboard {
        max-width: 1200px; /* Limita a largura para não espalhar demais em telas ultra-wide */
        margin: 0 auto; /* Centraliza o container na página */
        padding: 1rem;
      }

      .header-section {
        text-align: center; /* Centraliza o título e a descrição */
        margin-bottom: 3rem;
      }

      .header-section h2 {
        color: #064e3b;
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .header-section p {
        color: #64748b;
        font-size: 1.1rem;
      }

      .classes-grid {
        display: grid;
        /* auto-fit faz com que os cards tentem preencher o espaço, 
           mas o justify-content centraliza o grupo todo */
        grid-template-columns: repeat(auto-fit, minmax(320px, 350px));
        gap: 2rem;
        justify-content: center;
      }

      .loading-container,
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 5rem;
        background: white;
        border-radius: 16px;
        color: #10b981;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }

      .empty-state i {
        font-size: 4rem;
        color: #cbd5e0;
        margin-bottom: 1.5rem;
      }

      .empty-state h3 {
        color: #1e293b;
        margin-bottom: 0.5rem;
      }

      .pi-spinner {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class StudentClassesComponent implements OnInit {
  private studentService = inject(StudentService);
  private keycloak = inject(KeycloakService);
  private userService = inject(UserService); // Injetando o service de usuário

  classes$ = this.studentService.enrolledClasses$;
  loading$ = this.studentService.loading$;

  ngOnInit() {
    this.keycloak.user$.subscribe((user) => {
      if (user && (user.email || user.preferred_username)) {
        const email = user.email || user.preferred_username;

        this.studentService.getStudentByEmail(email).subscribe({
          next: (dbStudent) => {
            if (dbStudent && dbStudent.id) {
              console.log('✅ ID numérico (Long) localizado:', dbStudent.id);

              this.studentService
                .getEnrolledClasses(dbStudent.id.toString())
                .subscribe();
            }
          },
          error: (err) => {
            console.error(
              '❌ Não foi possível vincular o usuário do Keycloak ao aluno no banco:',
              err,
            );
          },
        });
      }
    });
  }
}
