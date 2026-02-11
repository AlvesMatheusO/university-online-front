// apps/frontend/src/app/services/class.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap, shareReplay } from 'rxjs/operators';
import { Class } from '../app/models/class.model';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080';

  private classesCache$ = new BehaviorSubject<Class[]>([]);
  classes$ = this.classesCache$.asObservable();

  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject$.asObservable();

  getClasses(): Observable<Class[]> {
    this.loadingSubject$.next(true);

    return this.http.get<Class[]>(`${this.apiUrl}/classes`).pipe(
      tap((classes) => {
        console.log('📚 Disciplinas carregadas:', classes);
        this.classesCache$.next(classes);
        this.loadingSubject$.next(false);
      }),
      catchError((error) => {
        console.error('❌ Erro ao carregar disciplinas:', error);
        this.loadingSubject$.next(false);
        return throwError(() => error);
      }),
      shareReplay(1),
    );
  }
}
