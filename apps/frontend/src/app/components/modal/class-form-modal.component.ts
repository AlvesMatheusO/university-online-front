/* eslint-disable @angular-eslint/template/label-has-associated-control */
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ClassService } from '../../../services/class.service';
import { Class } from '../../models/class.model';
import { KeycloakService } from '../../auth/keycloak.service';

@Component({
  selector: 'app-class-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    AutoCompleteModule,
  ],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="'Nova Turma'"
      [modal]="true"
      [style]="{ width: '50vw' }"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onCancel()"
    >
      <form [formGroup]="classForm" (ngSubmit)="onSubmit()">
        <div class="form-grid">
          <div class="form-section">
            <h3>Disciplina</h3>
            <div class="form-field search-container">
              <label>Disciplina *</label>
              <p-autoComplete
                [suggestions]="filteredSubjects"
                (completeMethod)="searchSubject($event)"
                field="name"
                optionLabel="name"
                [dropdown]="true"
                [minQueryLength]="0"
                (onFocus)="searchSubject($any({ query: '' }))"
                placeholder="Selecione ou digite..."
                (onSelect)="onSubjectSelect($event)"
                styleClass="w-full"
              ></p-autoComplete>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="subjectCode">Código</label>
                <input pInputText id="subjectCode" formControlName="subjectCode" />
              </div>
              <div class="form-field">
                <label for="subjectName">Nome</label>
                <input pInputText id="subjectName" formControlName="subjectName" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Professor</h3>
            <div class="form-field search-container">
              <label>Professor *</label>
              <p-autoComplete
                [suggestions]="filteredProfessors"
                (completeMethod)="searchProfessor($event)"
                field="name"
                optionLabel="name"
                [dropdown]="true"
                [minQueryLength]="0"
                (onFocus)="searchProfessor($any({ query: '' }))"
                placeholder="Selecione ou digite..."
                (onSelect)="onProfessorSelect($event)"
                styleClass="w-full"
              ></p-autoComplete>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="professorRegistration">Matrícula</label>
                <input pInputText id="professorRegistration" formControlName="professorRegistration" />
              </div>
              <div class="form-field">
                <label for="professorName">Nome</label>
                <input pInputText id="professorName" formControlName="professorName" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Horário e Local</h3>
            <div class="form-field">
              <label>Horário Disponível *</label>
              <select class="form-select" formControlName="scheduleId" (change)="onScheduleSelect($event)">
                <option [value]="null" disabled>Selecione um horário...</option>
                <option *ngFor="let s of schedules" [value]="s.id">
                  {{ s.dayOfWeek }} | {{ s.period }} ({{ s.startTime }} - {{ s.endTime }})
                </option>
              </select>
            </div>
          </div>

          <div class="form-section">
            <h3>Detalhes da Turma</h3>
            <div class="form-row">
              <div class="form-field">
                <label for="semester">Semestre *</label>
                <input pInputText id="semester" formControlName="semester" placeholder="2024.1" />
              </div>
              <div class="form-field">
                <label>Código da Turma (Gerado)</label>
                <input pInputText [disabled]="true" [value]="classForm.get('code')?.value" class="auto-code-input" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                <label for="maxCapacity">Capacidade Máxima *</label>
                <p-inputNumber id="maxCapacity" formControlName="maxCapacity" [min]="1" [max]="100" />
              </div>
              <div class="form-field">
                <label for="status">Status *</label>
                <select id="status" class="form-select" formControlName="status">
                  <option value="ATIVA">Ativa</option>
                  <option value="CANCELADA">Cancelada</option>
                  <option value="CONCLUIDA">Concluída</option>
                  <option value="SUSPENSA">Suspensa</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>

      <ng-template pTemplate="footer">
        <div class="modal-actions">
          <p-button label="Cancelar" icon="pi pi-times" (onClick)="onCancel()" styleClass="p-button-text p-button-danger" />
          <p-button label="Criar Turma" icon="pi pi-check" (onClick)="onSubmit()" [disabled]="classForm.invalid || loading" [loading]="loading" styleClass="p-button-success" />
        </div>
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      .form-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1rem 0;
        .form-section {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          background: #f8f9fa;
          h3 {
            margin: 0 0 1rem 0;
            font-size: 1.125rem;
            color: #1e293b;
            font-weight: 600;
          }
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          label {
            font-weight: 500;
            font-size: 0.875rem;
            color: #475569;
          }
          .auto-code-input {
            background-color: #f1f5f9;
            font-weight: bold;
            color: #6366f1;
          }
        }
        .search-container {
          margin-bottom: 1rem;
          border-bottom: 1px dashed #cbd5e0;
          padding-bottom: 1rem;
        }
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          background-color: white;
          color: #1e293b;
          &:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
          }
        }
      }
      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        padding-top: 1rem;
      }
      :host ::ng-deep {
        .p-dialog .p-dialog-content {
          max-height: 75vh;
          padding: 1.5rem;
        }
        .p-inputtext,
        .p-inputnumber {
          width: 100%;
        }
        .p-button-success {
          background: #22c55e !important;
          border-color: #22c55e !important;
        }
        .p-button-danger {
          color: #ef4444 !important;
        }
      }
    `,
  ],
})
export class ClassFormModalComponent implements OnInit {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() classCreated = new EventEmitter<Class>();

  private fb = inject(FormBuilder);
  private classService = inject(ClassService);
  private keycloak = inject(KeycloakService);

  subjects: any[] = [];
  schedules: any[] = [];
  filteredSubjects: any[] = [];
  professors: any[] = [];
  filteredProfessors: any[] = [];
  loading = false;
  classForm: FormGroup;

  constructor() {
    this.classForm = this.fb.group({
      code: [{ value: '', disabled: true }, Validators.required],
      semester: ['', Validators.required],
      maxCapacity: [40, [Validators.required, Validators.min(1)]],
      status: ['ATIVA', Validators.required],
      subjectId: [null, Validators.required],
      subjectCode: ['', Validators.required],
      subjectName: ['', Validators.required],
      subjectWorkload: [60],
      subjectCredits: [4],
      subjectDescription: [''],
      professorId: [null, Validators.required],
      professorRegistration: ['', Validators.required],
      professorName: ['', Validators.required],
      professorEmail: [''],
      professorTitle: [''],
      professorDepartment: [''],
      scheduleId: [null, Validators.required],
      scheduleDayOfWeek: [''],
      schedulePeriod: [''],
      scheduleStartTime: [''],
      scheduleEndTime: [''],
      courseCode: ['C01'],
      courseName: ['Curso Geral'],
      courseDepartment: ['Depto'],
      courseDuration: [8],
      courseId: [1],
    });
    this.setupAutoCode();
  }

  ngOnInit() {
    this.classService.getUniqueSubjects().subscribe((data) => (this.subjects = data));
    this.classService.getUniqueProfessors().subscribe((data) => (this.professors = data));
    this.classService.getSchedules().subscribe((data) => (this.schedules = data));
  }

  private setupAutoCode() {
    this.classForm.valueChanges.subscribe((val) => {
      const sCode = val.subjectCode || '';
      const sem = val.semester || '';
      if (sCode && sem) {
        const generated = `${sCode.toUpperCase()}-${sem}`;
        this.classForm.get('code')?.setValue(generated, { emitEvent: false });
      }
    });
  }

  onScheduleSelect(event: any) {
    const selectedId = Number(event.target.value);
    const schedule = this.schedules.find((s) => s.id === selectedId);
    if (schedule) {
      this.classForm.patchValue({
        scheduleDayOfWeek: schedule.dayOfWeek,
        schedulePeriod: schedule.period,
        scheduleStartTime: schedule.startTime,
        scheduleEndTime: schedule.endTime,
      });
    }
  }

  searchSubject(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredSubjects = this.subjects.filter(
      (s) => s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query)
    );
  }

  onSubjectSelect(event: any) {
    const s = event.value;
    this.classForm.patchValue({
      subjectId: s.id,
      subjectCode: s.code,
      subjectName: s.name,
      subjectWorkload: s.workload,
      subjectCredits: s.credits,
      subjectDescription: s.description,
    });
  }

  searchProfessor(event: any) {
    const query = event.query?.toLowerCase() || '';
    this.filteredProfessors = this.professors.filter(
      (p) => p.name.toLowerCase().includes(query) || p.registration.toLowerCase().includes(query)
    );
  }

  onProfessorSelect(event: any) {
    const p = event.value;
    this.classForm.patchValue({
      professorId: p.id,
      professorRegistration: p.registration,
      professorName: p.name,
      professorEmail: p.email,
      professorTitle: p.title,
      professorDepartment: p.department,
    });
  }

  onSubmit() {
    if (this.classForm.invalid) {
      this.classForm.markAllAsTouched();
      return;
    }

    const coordinatorId = this.keycloak.userId || this.keycloak.tokenParsed?.sub;
    if (!coordinatorId) return;

    this.loading = true;
    const formValue = this.classForm.getRawValue();

    const payload: Partial<Class> = {
      code: formValue.code,
      semester: formValue.semester,
      maxCapacity: formValue.maxCapacity,
      status: formValue.status,
      enrolledStudents: 0,
      availableSlots: formValue.maxCapacity,
      subject: {
        id: formValue.subjectId,
        code: formValue.subjectCode,
        name: formValue.subjectName,
        workload: formValue.subjectWorkload,
        credits: formValue.subjectCredits,
        description: formValue.subjectDescription,
      },
      professor: {
        id: formValue.professorId,
        registration: formValue.professorRegistration,
        name: formValue.professorName,
        email: formValue.professorEmail,
        title: formValue.professorTitle,
        department: formValue.professorDepartment,
      },
      schedule: {
        id: formValue.scheduleId, // ID REAL SELECIONADO
        dayOfWeek: formValue.scheduleDayOfWeek,
        period: formValue.schedulePeriod,
        startTime: formValue.scheduleStartTime,
        endTime: formValue.scheduleEndTime,
      },
      course: {
        id: formValue.courseId,
        code: formValue.courseCode,
        name: formValue.courseName,
        department: formValue.courseDepartment,
        duration: formValue.courseDuration,
        active: true,
      },
    };

    this.classService.createClass(coordinatorId, formValue.courseId, payload).subscribe({
      next: (res) => {
        this.classCreated.emit(res);
        this.close();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro no Backend:', err.error);
      },
    });
  }

  onCancel() {
    this.close();
  }

  private close() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.classForm.reset({
      maxCapacity: 40,
      status: 'ATIVA',
      courseId: 1,
    });
  }
}