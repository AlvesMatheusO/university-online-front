// apps/frontend/src/app/auth/keycloak.service.ts
import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloakInstance: Keycloak;

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
      console.log('Configuração:');
      console.log('  URL:', 'http://localhost:8180');
      console.log('  Realm:', 'academic-system');
      console.log('  Client ID:', 'academic-frontend');
      console.log('  Window origin:', window.location.origin);
      console.log('  Window href:', window.location.href);

      const authenticated = await this.keycloakInstance.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        enableLogging: true,
      });

      console.log('✅ Keycloak inicializado com sucesso');
      console.log('📊 Status de autenticação:', authenticated);

      if (authenticated) {
        console.log('👤 Usuário autenticado!');
        console.log('Token:', this.keycloakInstance.token?.substring(0, 50) + '...');
        console.log('Refresh Token:', this.keycloakInstance.refreshToken ? 'Presente' : 'Ausente');
        console.log('User Profile:', this.keycloakInstance.tokenParsed);
        console.log('Roles:', this.keycloakInstance.realmAccess?.roles);
        
        this.setupTokenRefresh();
      } else {
        console.log('ℹ️ Usuário não autenticado (normal para primeira visita)');
      }

      return authenticated;
    } catch (error: any) {
      console.error('❌ ERRO ao inicializar Keycloak');
      console.error('Tipo do erro:', error?.error);
      console.error('Descrição:', error?.error_description);
      console.error('Stack completo:', error);
      
      // Se for erro de configuração
      if (error?.error === 'invalid_request') {
        console.error('⚠️ Possíveis causas:');
        console.error('1. Client "academic-frontend" não existe no Keycloak');
        console.error('2. Redirect URI não está configurado corretamente');
        console.error('3. Client não está habilitado');
      }
      
      return false;
    }
  }

  login(): Promise<void> {
    console.log('🔑 Iniciando processo de login...');
    console.log('Redirect URI:', window.location.origin);
    
    return this.keycloakInstance.login({
      redirectUri: window.location.origin,
    }).catch(error => {
      console.error('❌ Erro no login:', error);
      throw error;
    });
  }

  logout(): Promise<void> {
    console.log('👋 Fazendo logout...');
    return this.keycloakInstance.logout({
      redirectUri: window.location.origin
    });
  }

  get token(): string | undefined {
    return this.keycloakInstance.token;
  }

  get roles(): string[] {
    return this.keycloakInstance.realmAccess?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  get userProfile(): any {
    return this.keycloakInstance.tokenParsed;
  }

  isLoggedIn(): boolean {
    return !!this.keycloakInstance.authenticated;
  }

  private setupTokenRefresh(): void {
    console.log('⏰ Configurando atualização automática de token...');
    
    setInterval(() => {
      this.keycloakInstance.updateToken(70).then((refreshed) => {
        if (refreshed) {
          console.log('🔄 Token atualizado com sucesso');
        }
      }).catch((error) => {
        console.error('❌ Falha ao atualizar token:', error);
      });
    }, 30000);
  }
}