import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../../services/student.service';
import { KeycloakService } from '../../auth/keycloak.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
// Import crucial para evitar o loop infinito de loading
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-student-enrollment',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule],
  template: `
    <div class="enrollment-container">
      <div class="header">
        <h2>Matrícula Online</h2>
        <p>Selecione as disciplinas disponíveis para este semestre.</p>
      </div>

      @if (loading) {
        <div class="state-container">
          <i
            class="pi pi-spin pi-spinner"
            style="font-size: 2rem; color: #10b981;"
          ></i>
          <p>Verificando turmas e elegibilidade...</p>
        </div>
      } @else if (errorMessage) {
        <div class="state-container error">
          <i
            class="pi pi-exclamation-circle"
            style="font-size: 2rem; color: #ef4444;"
          ></i>
          <p>{{ errorMessage }}</p>
          <p-button
            label="Tentar Novamente"
            (onClick)="ngOnInit()"
            styleClass="p-button-outlined p-button-danger"
          ></p-button>
        </div>
      } @else {
        <div class="classes-grid">
          @for (cls of availableClasses; track cls.id) {
            <div
              class="class-card"
              [class.disabled-card]="cls.enrolledStudents >= cls.maxCapacity"
            >
              <div class="card-top">
                <span class="code-badge">{{ cls.subject.code }}</span>
                <p-tag
                  [value]="cls.subject.credits + ' Créditos'"
                  severity="info"
                ></p-tag>
              </div>

              <h3 class="subject-name">{{ cls.subject.name }}</h3>

              <div class="info-row">
                <i class="pi pi-user"></i> <span>{{ cls.professor.name }}</span>
              </div>
              <div class="info-row">
                <i class="pi pi-clock"></i>
                <span
                  >{{ cls.schedule.dayOfWeek }} -
                  {{ cls.schedule.startTime }}</span
                >
              </div>

              <hr class="divider" />

              <div class="card-footer">
                <div class="slots">
                  <span
                    [class.text-red-500]="
                      cls.enrolledStudents >= cls.maxCapacity
                    "
                  >
                    Vagas: {{ cls.enrolledStudents }}/{{ cls.maxCapacity }}
                  </span>
                </div>

                <p-button
                  label="Matricular"
                  icon="pi pi-plus"
                  [loading]="processingClassId === cls.id"
                  [disabled]="
                    cls.enrolledStudents >= cls.maxCapacity ||
                    processingClassId !== null
                  "
                  (onClick)="onEnroll(cls)"
                  styleClass="p-button-sm p-button-success"
                >
                </p-button>
              </div>
            </div>
          } @empty {
            <div class="state-container">
              <i
                class="pi pi-inbox"
                style="font-size: 3rem; color: #94a3b8;"
              ></i>
              <p>Nenhuma turma disponível para matrícula no momento.</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .enrollment-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
      }
      .header {
        text-align: center;
        margin-bottom: 2rem;
      }
      .header h2 {
        color: #064e3b;
        margin: 0;
      }

      .classes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }

      .class-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        transition: all 0.2s;
      }
      .class-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border-color: #10b981;
      }

      .disabled-card {
        opacity: 0.7;
        background-color: #f8fafc;
      }

      .card-top {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
      }
      .code-badge {
        background: #f1f5f9;
        color: #475569;
        padding: 4px 8px;
        border-radius: 6px;
        font-weight: bold;
        font-size: 0.85rem;
      }
      .subject-name {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        color: #1e293b;
      }
      .info-row {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #64748b;
        margin-bottom: 0.5rem;
      }
      .divider {
        border: 0;
        border-top: 1px solid #f1f5f9;
        margin: 1rem 0;
      }
      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
      }
      .slots {
        font-size: 0.9rem;
        font-weight: 600;
        color: #059669;
      }
      .text-red-500 {
        color: #ef4444;
      }

      .state-container {
        text-align: center;
        padding: 3rem;
        color: #64748b;
        grid-column: 1 / -1;
      }
      .state-container.error {
        color: #ef4444;
      }
    `,
  ],
})
export class StudentEnrollmentComponent implements OnInit {
  private studentService = inject(StudentService);
  private keycloak = inject(KeycloakService);

  availableClasses: any[] = [];
  studentId: number | null = null;
  loading = true;
  errorMessage = '';
  processingClassId: number | null = null;

  ngOnInit() {
    this.initPageData();
  }

  initPageData() {
    this.loading = true;
    console.log('1. Iniciando carregamento da página...'); // <--- Debug

    this.keycloak.user$
      .pipe(
        // Vamos ver o que o Keycloak está mandando, mesmo se for null
        tap((user) => console.log('2. Keycloak emitiu:', user)),
        filter((user) => !!user && (!!user.email || !!user.preferred_username)),
      )
      .subscribe({
        next: (user) => {
          console.log('3. Usuário válido encontrado:', user.email); // <--- Debug
          const email = user.email || user.preferred_username;
          this.loadStudentAndClasses(email);
        },
        error: (err) => {
          console.error('ERRO NO KEYCLOAK:', err);
          this.loading = false; // Destrava a tela
        },
      });
  }

  loadStudentAndClasses(email: string) {
    this.studentService.getStudentByEmail(email).subscribe({
      next: (student) => {
        // VALIDAÇÃO 1: Se o backend não retornar aluno ou isActive=false, paramos aqui.
        if (student && student.id) {
          this.studentId = student.id;
          this.loadClasses();
        } else {
          this.loading = false;
          this.errorMessage = 'Perfil de aluno não encontrado ou inativo.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Não foi possível carregar seus dados.';
      },
    });
  }

  loadClasses() {
    this.studentService.getAvailableClasses().subscribe({
      next: (data) => {
        // VALIDAÇÃO 2: O backend (/available) já deve retornar apenas turmas ativas
        this.availableClasses = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Erro ao buscar turmas disponíveis.';
      },
    });
  }

  onEnroll(classItem: any) {
    if (!this.studentId) return;
    this.processingClassId = classItem.id;

    this.studentService.enroll(this.studentId, classItem.id).subscribe({
      next: () => {
        alert(`✅ Sucesso! Matrícula confirmada em ${classItem.subject.name}.`);
        this.processingClassId = null;
        this.loadClasses(); // Atualiza contador de vagas
      },
      error: (err) => {
        this.processingClassId = null;
        this.handleBackendValidations(err);
      },
    });
  }

  // TRADUÇÃO DOS ERROS DO BACKEND PARA O USUÁRIO
  handleBackendValidations(err: any) {
    // 409 Conflict: Usado para Validação 4 (Duplicada) e 5 (Horário)
    if (err.status === 409) {
      // O Backend geralmente manda uma mensagem no body explicando qual foi
      if (err.error && err.error.message) {
        alert(`⚠️ Atenção: ${err.error.message}`);
      } else {
        alert(
          '⚠️ Conflito: Verifique se há choque de horário ou se já está matriculado.',
        );
      }
    }
    // 400 Bad Request: Validação 3 (Turma cheia no momento do clique)
    else if (err.status === 400) {
      alert('⚠️ A turma não possui mais vagas ou está inativa.');
    } else {
      alert('❌ Ocorreu um erro inesperado. Tente novamente.');
    }
  }
}
