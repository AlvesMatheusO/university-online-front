import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { StudentService } from '../../../services/student.service';
import { KeycloakService } from '../../auth/keycloak.service';
import { StudentEnrollmentComponent } from './student-enrollment.component';
// IMPORTANTE: Se o seu Vitest não estiver com 'globals: true', descomente a linha abaixo:
// import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('StudentEnrollmentComponent', () => {
  let component: StudentEnrollmentComponent;
  let fixture: ComponentFixture<StudentEnrollmentComponent>;
  let studentServiceMock: any;
  let keycloakServiceMock: any;
  
  let userSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    userSubject = new BehaviorSubject<any>({ email: 'joao@teste.com', name: 'João' });
    
    keycloakServiceMock = {
      user$: userSubject.asObservable()
    };

    // VITEST: Usamos vi.fn() em vez de jest.fn()
    studentServiceMock = {
      getStudentByEmail: vi.fn().mockReturnValue(of({ id: 123, name: 'João' })),
      getAvailableClasses: vi.fn().mockReturnValue(of([
        { 
          id: 1, 
          subject: { name: 'Matemática', code: 'MAT101', credits: 4 }, 
          professor: { name: 'Prof. X' },
          schedule: { dayOfWeek: 'SEG', startTime: '08:00' },
          enrolledStudents: 10,
          maxCapacity: 30
        }
      ])),
      enroll: vi.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [StudentEnrollmentComponent], 
      providers: [
        { provide: StudentService, useValue: studentServiceMock },
        { provide: KeycloakService, useValue: keycloakServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentEnrollmentComponent);
    component = fixture.componentInstance;
    
    // VITEST: Usamos vi.spyOn()
    // Mockamos a implementação para o alert não aparecer na tela
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    fixture.detectChanges(); 
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar turmas ao iniciar (ngOnInit)', () => {
    expect(studentServiceMock.getStudentByEmail).toHaveBeenCalledWith('joao@teste.com');
    expect(component.studentId).toBe(123);
    
    expect(studentServiceMock.getAvailableClasses).toHaveBeenCalled();
    expect(component.availableClasses.length).toBe(1);
    
    // VITEST: Usa toBe(false), igual ao Jest
    expect(component.loading).toBe(false);
  });

  it('deve exibir mensagem de erro se o aluno não for encontrado', () => {
    // Simula retorno nulo
    studentServiceMock.getStudentByEmail.mockReturnValue(of(null));
    component.ngOnInit(); 

    expect(component.errorMessage).toContain('Perfil de aluno não encontrado');
    expect(component.loading).toBe(false);
  });

  it('deve chamar enroll() quando clicar no botão Matricular', () => {
    expect(component.availableClasses.length).toBe(1);
    fixture.detectChanges();

    component.onEnroll(component.availableClasses[0]);

    expect(studentServiceMock.enroll).toHaveBeenCalledWith(123, 1);
    
    // VITEST: Suporta expect.stringMatching igual ao Jest
    expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Sucesso/));
  });

  it('deve tratar erro 409 (Conflito) na matrícula', () => {
    // Simula erro do backend
    studentServiceMock.enroll.mockReturnValue(throwError(() => ({ status: 409 })));

    component.onEnroll(component.availableClasses[0]);

    expect(window.alert).toHaveBeenCalledWith(expect.stringMatching(/Conflito/));
  });

  it('deve desabilitar botão visualmente se turma estiver cheia', () => {
    component.availableClasses = [{
      id: 2,
      subject: { name: 'Cheia', code: 'FULL', credits: 2 },
      professor: { name: 'Y' },
      schedule: { dayOfWeek: 'TER', startTime: '10:00' },
      enrolledStudents: 30, // Igual à capacidade
      maxCapacity: 30
    }];
    
    fixture.detectChanges(); 

    const buttonComponent = fixture.debugElement.query(By.css('p-button'));
    expect(buttonComponent.attributes['ng-reflect-disabled']).toBe('true');
  });
});