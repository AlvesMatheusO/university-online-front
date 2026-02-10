// apps/frontend/src/app/pages/unauthorized.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  template: `
    <div style="text-align: center; padding: 50px;">
      <h2>Acesso Negado</h2>
      <p>Você não tem permissão para acessar esta página.</p>
      <button (click)="goBack()" style="padding: 10px 20px; cursor: pointer;">
        Voltar
      </button>
    </div>
  `,
})
export class UnauthorizedComponent {
  private router = inject(Router);

  goBack() {
    this.router.navigate(['/public']);
  }
}