
# 🎓 University Online - Frontend Monorepo

Este repositório contém o **front-end do Sistema de Gestão Acadêmica University Online**.
O projeto foi construído utilizando **Nx** para gerenciamento do monorepo e **Angular (Standalone Components)** com arquitetura moderna baseada em Signals.

---

## 🛠️ Stack Tecnológico & Versões

Para garantir compatibilidade e evitar erros de ambiente, utilize as versões abaixo:

* **Node.js:** v20.10.0 (LTS Iron) ou superior
* **NPM:** v10.x ou superior
* **Angular:** v17+ (uso extensivo de Standalone Components e Signals)
* **Nx Workspace:** v18+
* **UI Library:** PrimeNG v17+
* **Autenticação:** Keycloak (OIDC)

---

# 🚀 Primeiros Passos (Setup)

## 1️⃣ Pré-requisitos

Antes de rodar o front-end, certifique-se de que os serviços de apoio estão rodando via Docker:

* **Backend (Quarkus):**
  `http://localhost:8080`

* **Keycloak:**
  `http://localhost:8180`

---

## 2️⃣ Configuração do Keycloak

Para que o login funcione corretamente, verifique se o **Realm `academic-system`** foi importado no Keycloak.

### Configuração esperada:

* **Realm:** `academic-system`
* **Client Frontend:** `academic-frontend` (porta 4200)
* **Client Backend:** `academic-api` (porta 8080)

---

## 3️⃣ Instalação

Clone o repositório e instale as dependências:

```bash
git clone <url-do-repo>
cd university-online-front
npm install
```

---

## 4️⃣ Rodando a Aplicação

Para iniciar o servidor de desenvolvimento:

```bash
npx nx serve frontend
```

Acesse:

```
http://localhost:4200
```

---

# 🔐 Acesso & Credenciais de Teste

O sistema possui usuários pré-configurados para diferentes perfis:

| Perfil                | Usuário (E-mail)                                        | Senha | Permissões                                         |
| --------------------- | ------------------------------------------------------- | ----- | -------------------------------------------------- |
| 👨‍🎓 **Aluno**       | [joao.almeida@unifor.br](mailto:joao.almeida@unifor.br) | 1234  | Matrícula Online, Visualização de Grade, Histórico |
| 🧑‍🏫 **Coordenador** | [coord.silva@unifor.br](mailto:coord.silva@unifor.br)   | 1234  | Gestão de Turmas, Professores e Relatórios         |
| 🔑 **Admin**          | [admin@unifor.br](mailto:admin@unifor.br)               | admin | Acesso total ao sistema                            |

> ⚠️ Caso não consiga logar:
>
> * Verifique se o container do Keycloak está rodando
> * Confirme se o Realm `academic-system` foi criado corretamente
> * Verifique se as roles `STUDENT`, `COORDINATOR` e `ADMIN` estão configuradas

---

# 📂 Arquitetura do Projeto

A estrutura foi organizada para separar responsabilidades por domínio e papel do usuário:

```
apps/frontend/src/app/
├── admin/            # 🔐 Área administrativa
├── auth/             # 🛡️ Guardas de rotas, Interceptors e Config Keycloak
├── components/       # 🧩 Componentes reutilizáveis (Dumb Components)
│   ├── card/
│   ├── header/
│   └── modal/
├── models/           # 📦 Interfaces TypeScript
├── pages/            # 📱 Telas principais (Smart Components)
│   ├── coordinator/
│   └── student/
└── services/         # 📡 Comunicação HTTP com API Quarkus
```

---

## 🏗️ Decisões Arquiteturais

### ✔ Standalone Components

Não utilizamos `NgModules`.
Cada componente importa suas dependências diretamente:

```ts
imports: [CommonModule, ButtonModule]
```

---

### ✔ Services

Toda regra de negócio e chamadas HTTP ficam em:

```
src/app/services
```

Os componentes apenas consomem os dados via **Observables**.

---

### ✔ Auth Guard

A proteção de rotas é feita via `KeycloakService` na pasta:

```
src/app/auth
```

---

# 🔧 Guia de Manutenção

## ➕ Criar uma nova Tela (Page)

Exemplo: Histórico Escolar no módulo do aluno.

### 1️⃣ Gerar componente standalone:

```bash
npx nx g @nx/angular:component pages/student/student-history --project=frontend --standalone
```

### 2️⃣ Adicionar rota em `app.routes.ts`:

```ts
{
  path: 'history',
  loadComponent: () =>
    import('./pages/student/student-history/student-history.component')
      .then(m => m.StudentHistoryComponent)
}
```

---

## ➕ Criar um novo Serviço de Integração

Se criou um novo Controller no backend (ex: `FinanceController`):

```bash
npx nx g @nx/angular:service services/finance --project=frontend
```

> 💡 Sempre injete `HttpClient`
> 💡 Utilize a URL base configurada
> ❌ Evite URLs hardcoded

---

## ➕ Adicionar Componentes do PrimeNG

Não importe módulos globalmente no `app.config.ts`.

Importe apenas no componente que utilizar:

```ts
import { CalendarModule } from 'primeng/calendar';

@Component({
  imports: [CalendarModule],
})
export class StudentHistoryComponent {}
```

---

# 🐛 Troubleshooting (Erros Comuns)

## 1️⃣ Loop Infinito de Loading / Tela Branca

**Causa:** Keycloak ainda não inicializou e o componente tenta acessar usuário `null`.

**Solução:**

```ts
this.keycloak.user$
  .pipe(filter(user => !!user))
  .subscribe(...)
```

---

## 2️⃣ Erro de CORS

**Sintoma:**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solução:**
O problema está no backend (Quarkus).
Verifique no `application.properties`:

```
quarkus.http.cors.origins=http://localhost:4200
```

---

## 3️⃣ Erro 403 Forbidden

**Sintoma:** Usuário loga mas não carrega dados.

**Solução:**

* Verifique as roles no Keycloak
* Usuário deve ter `STUDENT` ou `COORDINATOR`
* Endpoint Java deve ter:

```java
@RolesAllowed("STUDENT")
```

---

# 🧪 Testes

O projeto utiliza **Vitest** para testes unitários.

Para executar:

```bash
npx nx test frontend
```

---

