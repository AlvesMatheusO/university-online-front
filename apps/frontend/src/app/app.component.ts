// apps/frontend/src/app/app.component.ts
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { KeycloakService } from './auth/keycloak.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
})
export class AppComponent {}

// @Component({
//   standalone: true,
//   imports: [RouterModule, CommonModule],
//   selector: 'app-root',
//   template: `
//     <div class="container">
//       <header>
//         <h1>Universidade</h1>

//         @if ((isAuthenticated$ | async) === false) {
//           <div class="auth-section">
//             <p>Você não está autenticado</p>
//             <button (click)="login()" class="btn-primary">Login</button>
//           </div>
//         }

//         @if (isAuthenticated$ | async) {
//           <div class="auth-section">
//             <p>Bem-vindo, {{ (user$ | async)?.['name'] || 'N/A' }}</p>
//             <!-- Para teste!!!! remover -->
//             <p>Roles: {{ (roles$ | async)?.join(', ') }}</p>
//             <button (click)="logout()" class="btn-secondary">Logout</button>
//           </div>
//         }
//       </header>

//       @if (isAuthenticated$ | async) {
//         <nav>
//           <h2>Navegação por Role:</h2>
//           <ul>
//             <li>
//               <a routerLink="/admin" routerLinkActive="active">
//                 Admin (precisa role ADMIN)
//               </a>
//             </li>
//             <li>
//               <a routerLink="/coordinator" routerLinkActive="active">
//                 Coordenador (precisa role COORDINATOR)
//               </a>
//             </li>
//             <li>
//               <a routerLink="/student" routerLinkActive="active">
//                 Estudante (precisa role STUDENT)
//               </a>
//             </li>
//             <li>
//               <a routerLink="/public" routerLinkActive="active">
//                 Público (sem proteção)
//               </a>
//             </li>
//           </ul>
//         </nav>
//       }

//       <main>
//         <router-outlet></router-outlet>
//       </main>
//     </div>
//   `,
//   styles: [
//     `
//       .container {
//         max-width: 1200px;
//         margin: 0 auto;
//         padding: 20px;
//         font-family:
//           system-ui,
//           -apple-system,
//           sans-serif;
//       }

//       header {
//         background: #f5f5f5;
//         padding: 20px;
//         border-radius: 8px;
//         margin-bottom: 20px;
//       }

//       h1 {
//         margin: 0 0 10px 0;
//         color: #333;
//       }

//       .auth-section {
//         margin-top: 10px;
//       }

//       .auth-section p {
//         margin: 5px 0;
//       }

//       nav {
//         background: #e0e0e0;
//         padding: 15px;
//         border-radius: 8px;
//         margin-bottom: 20px;
//       }

//       nav h2 {
//         margin-top: 0;
//         font-size: 1.2em;
//       }

//       nav ul {
//         list-style: none;
//         padding: 0;
//         margin: 10px 0 0 0;
//       }

//       nav li {
//         margin: 10px 0;
//       }

//       nav a {
//         color: #333;
//         text-decoration: none;
//         padding: 8px 12px;
//         display: inline-block;
//         border-radius: 4px;
//         transition: background 0.2s;
//       }

//       nav a:hover {
//         background: #ccc;
//       }

//       nav a.active {
//         background: #007bff;
//         color: white;
//       }

//       button {
//         padding: 10px 20px;
//         border: none;
//         border-radius: 4px;
//         cursor: pointer;
//         font-size: 14px;
//         transition: opacity 0.2s;
//       }

//       .btn-primary {
//         background: #007bff;
//         color: white;
//       }

//       .btn-secondary {
//         background: #6c757d;
//         color: white;
//       }

//       button:hover {
//         opacity: 0.8;
//       }

//       main {
//         background: white;
//         padding: 20px;
//         border-radius: 8px;
//         min-height: 300px;
//         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//       }
//     `,
//   ],
// })
// export class AppComponent implements OnInit, OnDestroy {
//   private keycloak = inject(KeycloakService);
//   private destroy$ = new Subject<void>();

//   // Observables públicos
//   isAuthenticated$: Observable<boolean>;
//   user$: Observable<any>;
//   roles$: Observable<string[]>;

//   constructor() {
//     this.isAuthenticated$ = this.keycloak.isAuthenticated$;
//     this.user$ = this.keycloak.user$;
//     this.roles$ = this.keycloak.roles$;
//   }

//   ngOnInit() {
//     console.log('🚀 App initialized');

//     // Subscrever para logs (opcional)
//     this.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe((isAuth) => {
//       console.log('📝 Autenticado:', isAuth);
//     });

//     this.roles$.pipe(takeUntil(this.destroy$)).subscribe((roles) => {
//       console.log('👤 Roles:', roles);
//     });
//   }

//   ngOnDestroy() {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   login(): void {
//     this.keycloak.login().subscribe({
//       next: () => console.log('Login iniciado'),
//       error: (error) => console.error('Erro no login:', error),
//     });
//   }

//   logout(): void {
//     this.keycloak.logout().subscribe({
//       next: () => console.log('Logout realizado'),
//       error: (error) => console.error('Erro no logout:', error),
//     });
//   }
// }
