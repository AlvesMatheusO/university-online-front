import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <h2>Página Pública</h2>
    <p>Esta página não requer autenticação.</p>
  `,
})
export class PublicComponent {}