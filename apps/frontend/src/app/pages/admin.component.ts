// apps/frontend/src/app/pages/admin.component.ts
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, User } from '../../services/user.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Painel do Administrador</h2>
    <p>Apenas usuários com role ADMIN podem ver esta página.</p>

    <button (click)="loadUsers()" class="btn-primary">Carregar Usuários</button>

    @if (users$ | async; as users) {
      <div class="users-list">
        <h3>Usuários ({{ users.length }})</h3>
        <ul>
          @for (user of users; track user.id) {
            <li>
              <strong>{{ user.name }}</strong> - {{ user.email }} ({{
                user.role
              }})
            </li>
          }
        </ul>
      </div>
    }
  `,
  styles: [
    `
      .btn-primary {
        background: #007bff;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 20px;
      }

      .btn-primary:hover {
        opacity: 0.8;
      }

      .users-list {
        margin-top: 20px;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        padding: 10px;
        margin: 5px 0;
        background: #f5f5f5;
        border-radius: 4px;
      }
    `,
  ],
})
export class AdminComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private destroy$ = new Subject<void>();

  users$!: Observable<User[]>;

  ngOnInit() {
    // Inicializar o observable
    this.users$ = this.userService.users$;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers() {
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => console.log('Usuários carregados:', users),
        error: (error) => console.error('Erro:', error),
      });
  }
}
