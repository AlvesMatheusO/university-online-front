import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from './keycloak.service';
import { take } from 'rxjs/operators';

@Component({
  standalone: true,
  template: `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
      <div style="text-align: center;">
        <h2>Redirecionando...</h2>
        <p>Aguarde enquanto carregamos sua área</p>
      </div>
    </div>
  `,
})
export class AuthRedirectComponent implements OnInit {
  private keycloak = inject(KeycloakService);
  private router = inject(Router);

  ngOnInit() {
    console.log('🔄 AuthRedirect - Verificando autenticação...');

    // Aguardar um pouco para garantir que o Keycloak inicializou
    setTimeout(() => {
      this.redirectUser();
    }, 100);
  }

  private redirectUser() {
    this.keycloak.isAuthenticated$
      .pipe(take(1))
      .subscribe(isAuth => {
        console.log('📊 Autenticado:', isAuth);

        if (!isAuth) {
          console.log('➡️ Não autenticado, indo para /public');
          this.router.navigate(['/public']);
          return;
        }

        const roles = this.keycloak.roles;
        console.log('🎭 Roles do usuário:', roles);

        // Prioridade: ADMIN > COORDINATOR > STUDENT
        if (roles.includes('ADMIN')) {
          console.log('➡️ Redirecionando para /admin');
          this.router.navigate(['/admin']);
        } else if (roles.includes('COORDINATOR')) {
          console.log('➡️ Redirecionando para /coordinator');
          this.router.navigate(['/coordinator']);
        } else if (roles.includes('STUDENT')) {
          console.log('➡️ Redirecionando para /student');
          this.router.navigate(['/student']);
        } else {
          console.log('⚠️ Nenhuma role conhecida, indo para /unauthorized');
          this.router.navigate(['/unauthorized']);
        }
      });
  }
}