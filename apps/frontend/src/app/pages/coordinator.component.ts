import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <h2>Painel do Coordenador</h2>
    <p>Apenas usuários com role COORDINATOR podem ver esta página.</p>
  `,
})
export class CoordinatorComponent {}