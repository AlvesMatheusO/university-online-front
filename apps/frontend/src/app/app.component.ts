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