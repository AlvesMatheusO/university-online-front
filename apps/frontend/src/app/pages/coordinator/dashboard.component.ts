import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-coordinator-dashboard',
  template: `
    <h2>Dashboard do Coordenador</h2>

    <p>Gerencie a matriz curricular do seu curso</p>

    <ul>
      <li>
        <a routerLink="classes">📚 Ver matriz curricular</a>
      </li>
      <li>
        <a routerLink="classes/new">➕ Criar nova aula</a>
      </li>
    </ul>

    <router-outlet></router-outlet>
  `,
})
export class CoordinatorDashboardComponent {}
