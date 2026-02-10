// apps/frontend/src/app/auth/keycloak.service.ts
import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { BehaviorSubject, Observable, from, interval } from 'rxjs';
import { filter, map, switchMap, catchError } from 'rxjs/operators';

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  roles: string[];
  token: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloakInstance: Keycloak;
  
  // BehaviorSubject para manter o estado de autenticação
  private authState$ = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    roles: [],
    token: null,
  });

  // Observables públicos (readonly)
  readonly isAuthenticated$: Observable<boolean> = this.authState$
    .pipe(map(state => state.isAuthenticated));

  readonly user$: Observable<any | null> = this.authState$
    .pipe(map(state => state.user));

  readonly roles$: Observable<string[]> = this.authState$
    .pipe(map(state => state.roles));

  readonly token$: Observable<string | null> = this.authState$
    .pipe(map(state => state.token));

  constructor() {
    console.log('🔧 Construindo KeycloakService...');
    
    this.keycloakInstance = new Keycloak({
      url: 'http://localhost:8180',
      realm: 'academic-system',
      clientId: 'academic-frontend',
    });

    console.log('✅ Keycloak instance criada');
  }

  async init(): Promise<boolean> {
    try {
      console.log('🔐 Inicializando Keycloak...');

      const authenticated = await this.keycloakInstance.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        enableLogging: true,
      });

      console.log('✅ Keycloak inicializado. Autenticado:', authenticated);

      // Atualizar o estado reativo
      this.updateAuthState();

      if (authenticated) {
        this.setupTokenRefresh();
      }

      return authenticated;
    } catch (error: any) {
      console.error('❌ Erro ao inicializar Keycloak:', error);
      return false;
    }
  }

  login(): Observable<void> {
    console.log('🔑 Iniciando login...');
    return from(
      this.keycloakInstance.login({
        redirectUri: window.location.origin,
      })
    );
  }

  logout(): Observable<void> {
    console.log('👋 Fazendo logout...');
    return from(
      this.keycloakInstance.logout({
        redirectUri: window.location.origin
      })
    ).pipe(
      map(() => {
        this.authState$.next({
          isAuthenticated: false,
          user: null,
          roles: [],
          token: null,
        });
      })
    );
  }

  // Métodos síncronos (para compatibilidade)
  get token(): string | undefined {
    return this.keycloakInstance.token;
  }

  get roles(): string[] {
    return this.keycloakInstance.realmAccess?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  hasRole$(role: string): Observable<boolean> {
    return this.roles$.pipe(
      map(roles => roles.includes(role))
    );
  }

  get userProfile(): any {
    return this.keycloakInstance.tokenParsed;
  }

  isLoggedIn(): boolean {
    return !!this.keycloakInstance.authenticated;
  }

  // Método reativo para verificar autenticação
  checkAuthentication$(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  private updateAuthState(): void {
    const state: AuthState = {
      isAuthenticated: !!this.keycloakInstance.authenticated,
      user: this.keycloakInstance.tokenParsed || null,
      roles: this.keycloakInstance.realmAccess?.roles || [],
      token: this.keycloakInstance.token || null,
    };

    this.authState$.next(state);
    console.log('📊 Estado de autenticação atualizado:', state);
  }

  private setupTokenRefresh(): void {
    console.log('⏰ Configurando atualização automática de token...');
    
    // Usar interval do RxJS
    interval(30000).pipe(
      switchMap(() => from(this.keycloakInstance.updateToken(70))),
      filter(refreshed => refreshed),
    ).subscribe({
      next: () => {
        console.log('🔄 Token atualizado');
        this.updateAuthState();
      },
      error: (error) => {
        console.error('❌ Falha ao atualizar token:', error);
      }
    });
  }
}