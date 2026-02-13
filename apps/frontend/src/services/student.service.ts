import { Injectable, inject } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Class } from '../app/models/class.model';
import { KeycloakService } from '../app/auth/keycloak.service';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private keycloak = inject(KeycloakService);

  // URL base da API (ajuste se necessário)
  private apiUrl = 'http://localhost:8080';

  private enrolledClassesSubject$ = new BehaviorSubject<Class[]>([]);
  enrolledClasses$ = this.enrolledClassesSubject$.asObservable();

  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject$.asObservable();

  private getHeaders(): HttpHeaders {
    const token = this.keycloak.token;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // --- MÉTODOS DE CONSULTA DE DADOS ---

  /**
   * Busca o perfil do aluno pelo e-mail (Keycloak -> Backend ID bridge)
   */
  getStudentByEmail(email: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/students/email/${email}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('❌ Erro ao buscar aluno por email:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Busca as turmas em que o aluno JÁ está matriculado
   */
  getEnrolledClasses(studentId: string): Observable<Class[]> {
    this.loadingSubject$.next(true);
    // Endpoint ajustado para listar turmas ativas
    const url = `${this.apiUrl}/enrollments/student/${studentId}/active`;

    return this.http.get<any[]>(url, { headers: this.getHeaders() }).pipe(
      map((enrollments) => enrollments.map((e) => e.classEntity)), // Extrai a turma do objeto Enrollment
      tap((classes) => {
        this.enrolledClassesSubject$.next(classes);
        this.loadingSubject$.next(false);
      }),
      catchError((err) => {
        this.loadingSubject$.next(false);
        return throwError(() => err);
      }),
    );
  }

  /**
   * Busca TODAS as turmas disponíveis para matrícula (GET /classes)
   */
  getAvailableClasses(): Observable<Class[]> {
    return this.http
      .get<Class[]>(`${this.apiUrl}/classes`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('❌ Erro ao buscar turmas disponíveis:', error);
          return throwError(() => error);
        }),
      );
  }

  // --- MÉTODOS DE AÇÃO ---

  /**
   * Realiza a matrícula (POST /enrollments)
   */
  enroll(studentId: number, classId: number): Observable<any> {
    const body = {
      studentId: studentId,
      classId: classId,
    };

    return this.http
      .post(`${this.apiUrl}/enrollments`, body, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => {
          console.log(
            `✅ Matrícula realizada: Aluno ${studentId} na Turma ${classId}`,
          );
          // Atualiza a lista de "Minhas Disciplinas" automaticamente após matricular
          this.getEnrolledClasses(studentId.toString()).subscribe();
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('❌ Erro na matrícula:', error);
          return throwError(() => error);
        }),
      );
  }
}
