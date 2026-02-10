// apps/frontend/src/app/services/user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  // Cache de usuários
  private usersCache$ = new BehaviorSubject<User[]>([]);
  
  // Observable público
  users$: Observable<User[]> = this.usersCache$.asObservable();

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      tap(users => {
        console.log('👥 Usuários carregados:', users.length);
        this.usersCache$.next(users);
      }),
      catchError(error => {
        console.error('❌ Erro ao carregar usuários:', error);
        return throwError(() => error);
      }),
      shareReplay(1) // Cache a última emissão
    );
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(error => {
        console.error(`❌ Erro ao carregar usuário ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user).pipe(
      tap(newUser => {
        console.log('✅ Usuário criado:', newUser);
        // Atualizar cache
        const currentUsers = this.usersCache$.value;
        this.usersCache$.next([...currentUsers, newUser]);
      }),
      catchError(error => {
        console.error('❌ Erro ao criar usuário:', error);
        return throwError(() => error);
      })
    );
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user).pipe(
      tap(updatedUser => {
        console.log('✅ Usuário atualizado:', updatedUser);
        // Atualizar cache
        const currentUsers = this.usersCache$.value;
        const index = currentUsers.findIndex(u => u.id === id);
        if (index !== -1) {
          currentUsers[index] = updatedUser;
          this.usersCache$.next([...currentUsers]);
        }
      }),
      catchError(error => {
        console.error('❌ Erro ao atualizar usuário:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`).pipe(
      tap(() => {
        console.log('✅ Usuário deletado:', id);
        // Atualizar cache
        const currentUsers = this.usersCache$.value;
        this.usersCache$.next(currentUsers.filter(u => u.id !== id));
      }),
      catchError(error => {
        console.error('❌ Erro ao deletar usuário:', error);
        return throwError(() => error);
      })
    );
  }
}