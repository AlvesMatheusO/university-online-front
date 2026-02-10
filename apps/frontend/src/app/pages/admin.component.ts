// apps/frontend/src/app/pages/admin.component.ts
import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <h2>Painel do Administrador</h2>
    <p>Apenas usuários com role ADMIN podem ver esta página.</p>
  `,
})
export class AdminComponent {}