import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KeycloakService } from '../app/auth/keycloak.service';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  // Mock simples do Keycloak apenas para fornecer o token
  const mockKeycloakService = {
    token: 'fake-token-123'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StudentService,
        { provide: KeycloakService, useValue: mockKeycloakService }
      ]
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Garante que não há requisições pendentes ao fim de cada teste
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('getAvailableClasses deve fazer um GET para /classes/available', () => {
    const dummyClasses = [
      { id: 1, subject: { name: 'Matemática' } },
      { id: 2, subject: { name: 'História' } }
    ];


    service.getAvailableClasses().subscribe(classes => {
      expect(classes.length).toBe(2);
      expect(classes).toEqual(dummyClasses as any);
    });

    const req = httpMock.expectOne('http://localhost:8080/classes/available');
    
  
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token-123');

    req.flush(dummyClasses);
  });

  it('enroll deve fazer um POST para /enrollments com o corpo correto', () => {
    const studentId = 10;
    const classId = 5;


    service.enroll(studentId, classId).subscribe(response => {
      expect(response).toBeTruthy();
    });

   
    const req = httpMock.expectOne('http://localhost:8080/enrollments');
    
  
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ studentId, classId });

   
    req.flush({ id: 99, status: 'ATIVA' });
  });
});