import { Component } from '@angular/core';

@Component({
  standalone: true,
  template: `
    <h2>Painel do Estudante</h2>
    <p>Apenas usuários com role STUDENT podem ver esta página.</p>
  `,
})
export class StudentComponent {}