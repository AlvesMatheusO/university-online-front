import Keycloak from 'keycloak-js';

export class KeycloakService {
  private keycloak!: Keycloak;

  async init() {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8180',
      realm: 'academic-system',
      clientId: 'academic-api',
    });

    await this.keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
      checkLoginIframe: false,
    });
  }

  get token(): string | undefined {
    return this.keycloak.token;
  }

  hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }

  logout() {
    this.keycloak.logout({
      redirectUri: 'http://localhost:4200',
    });
  }
}
