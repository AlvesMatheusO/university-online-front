// apps/frontend/src/app/services/class.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';
import { Class } from '../app/models/class.model';
import { KeycloakService } from '../app/auth/keycloak.service';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private http = inject(HttpClient);
  private keycloak = inject(KeycloakService);
  private apiUrl = 'http://localhost:8080';

  private classesCache$ = new BehaviorSubject<Class[]>([]);
  classes$ = this.classesCache$.asObservable();

  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject$.asObservable();

  private getHeaders(): HttpHeaders {
    const token = this.keycloak.token;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getClasses(): Observable<Class[]> {
    this.loadingSubject$.next(true);

    return this.http
      .get<Class[]>(`${this.apiUrl}/classes`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((classes) => {
          console.log('📚 Turmas carregadas:', classes);
          this.classesCache$.next(classes);
          this.loadingSubject$.next(false);
        }),
        catchError((error: unknown) => {
          console.error('❌ Erro ao carregar turmas:', error);
          this.loadingSubject$.next(false);
          return throwError(() => error);
        }),
        shareReplay(1),
      );
  }

  getClassById(id: number): Observable<Class> {
    return this.http
      .get<Class>(`${this.apiUrl}/classes/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(
        catchError((error: unknown) => {
          console.error(`❌ Erro ao carregar turma ${id}:`, error);
          return throwError(() => error);
        }),
      );
  }
}
