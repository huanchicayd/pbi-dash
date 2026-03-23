# PBI Dashboard

Dashboard analítico corporativo que espelha um modelo semântico do Power BI em uma aplicação web moderna — React no frontend, Node.js/Express no backend.

O Power BI atua **apenas como camada de dados e modelagem de negócio**. A interface é completamente independente e muito mais moderna do que o relatório nativo.

---

## Visão Geral da Arquitetura

```
Browser (React)
    │   HTTP /api/*
    ▼
Backend (Express + TypeScript)        ← único ponto de acesso às credenciais
    │   OAuth2 client_credentials
    ▼
Microsoft Entra ID (Azure AD)
    │   Bearer token
    ▼
Power BI REST API
    │   DAX ExecuteQueries
    ▼
Semantic Model (Dataset)
```

**O frontend nunca vê credenciais.** Toda autenticação e acesso ao Power BI acontece exclusivamente no backend.

---

## Stack

| Camada     | Tecnologia                                                        |
|------------|-------------------------------------------------------------------|
| Frontend   | React 18, Vite, TypeScript, Tailwind CSS v3, shadcn/ui, Recharts |
| State      | TanStack Query v5 (cache + auto-refresh)                          |
| Roteamento | React Router v6                                                   |
| Backend    | Node.js, Express 4, TypeScript                                    |
| Auth       | `@azure/msal-node` — client credentials flow                      |
| API        | Power BI REST API (DAX ExecuteQueries)                            |

---

## Estrutura de Pastas

```
pbi-dashboard/
├── backend/
│   └── src/
│       ├── clients/         # MsalClient + PowerBiClient
│       ├── config/          # Centraliza variáveis de ambiente
│       ├── controllers/     # Handlers HTTP (finos, sem lógica)
│       ├── middlewares/     # errorHandler, requestLogger
│       ├── mocks/           # Dados fake com o mesmo contrato da API real
│       ├── routes/          # Registro de todas as rotas
│       ├── services/        # Lógica de negócio + DAX queries
│       ├── types/           # Interfaces TypeScript compartilhadas
│       ├── app.ts           # Express app (middlewares + rotas)
│       └── server.ts        # Entry point HTTP
└── frontend/
    └── src/
        ├── components/
        │   ├── charts/      # AreaChartCard, BarChartCard, LineChartCard, DonutChartCard
        │   ├── dashboard/   # KpiCard, FilterBar
        │   ├── layout/      # AppShell, Sidebar, Header
        │   ├── shared/      # DataTableCard, ErrorState, EmptyState, LoadingSkeleton
        │   └── ui/          # Componentes base (shadcn/ui)
        ├── hooks/           # useKpis, useCharts, useFilters, useTable
        ├── lib/             # utils.ts, queryClient.ts
        ├── pages/           # Dashboard, KPIs, Analysis, Details, Settings
        ├── services/        # api.ts — axios wrapper
        └── types/           # Interfaces TypeScript
```

---

## Como Rodar Localmente

### Pré-requisitos

- Node.js 20+

### 1. Instalar dependências

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurar variáveis de ambiente

```bash
# Backend
cp backend/.env.example backend/.env
# Edite backend/.env (veja seção abaixo)

# Frontend — não precisa de .env em desenvolvimento
# O Vite proxy já redireciona /api → localhost:3001
```

### 3. Iniciar (modo mock — sem credenciais necessárias)

```bash
# Terminal 1 — backend
cd backend
npm run dev

# Terminal 2 — frontend
cd frontend
npm run dev
```

Acesse: **http://localhost:5173**

---

## Variáveis de Ambiente

### `backend/.env`

| Variável                | Obrigatória para PBI | Descrição                              |
|-------------------------|----------------------|----------------------------------------|
| `PORT`                  | Não                  | Porta do servidor (default: 3001)      |
| `NODE_ENV`              | Não                  | `development` ou `production`          |
| `TENANT_ID`             | **Sim**              | ID do tenant do Azure AD               |
| `CLIENT_ID`             | **Sim**              | ID do App Registration                 |
| `CLIENT_SECRET`         | **Sim**              | Secret do App Registration             |
| `POWERBI_WORKSPACE_ID`  | **Sim**              | ID do workspace no Power BI Service    |
| `POWERBI_DATASET_ID`    | **Sim**              | ID do dataset/semantic model           |
| `USE_MOCK_DATA`         | Não                  | `true` para mock, `false` para PBI real |
| `CACHE_TTL_SECONDS`     | Não                  | TTL do cache (default: 60s)            |
| `CORS_ORIGIN`           | Não                  | Origem do frontend (default: localhost:5173) |

---

## Como Funciona a Integração com Power BI

### Autenticação

O backend usa o fluxo **OAuth2 Client Credentials** (app-only, sem usuário):

1. `MsalClient` usa `@azure/msal-node` para obter um token Bearer da Microsoft
2. O token é cacheado automaticamente pelo MSAL e renovado antes de expirar
3. Cada requisição ao Power BI API inclui o header `Authorization: Bearer <token>`

### Consultas DAX

O `PowerBiClient.executeDax()` usa o endpoint:
```
POST /v1.0/myorg/groups/{workspaceId}/datasets/{datasetId}/executeQueries
```

Com o body:
```json
{
  "queries": [{ "query": "EVALUATE ..." }]
}
```

### Onde Colocar as Queries DAX

Cada service tem sua query DAX bem comentada:

- `backend/src/services/kpiService.ts` → `buildKpiDax()` e `mapRowsToKpis()`
- `backend/src/services/chartService.ts` → `fetchRevenuFromPowerBi()` e `fetchCategoryFromPowerBi()`
- `backend/src/services/tableService.ts` → `fetchFromPowerBi()`
- `backend/src/services/filterService.ts` → `fetchFromPowerBi()`

### Onde Trocar Mock por Real

1. Em `backend/.env`, defina `USE_MOCK_DATA=false`
2. Preencha as credenciais (`TENANT_ID`, `CLIENT_ID`, etc.)
3. Adapte as queries DAX em cada service para os nomes reais do seu modelo
4. Adapte os mappers (`mapRowsToKpis`, etc.) para os nomes de coluna retornados

---

## Atualização Automática dos Dados

TanStack Query auto-refaz as queries nos seguintes cenários:

| Evento                   | Comportamento                        |
|--------------------------|--------------------------------------|
| `staleTime = 30s`        | Dados considerados frescos por 30s   |
| `refetchInterval = 60s`  | KPIs e gráficos recarregados a cada 1 min |
| Janela volta ao foco     | Re-fetch automático                  |
| Botão refresh no header  | Invalida e recarrega tudo            |
| `POST /api/refresh`      | Dispara refresh no Power BI Service  |

O intervalo de 60s está centralizado nos hooks (`useKpis.ts`, `useCharts.ts`) e pode ser ajustado facilmente.

---

## Configurando o App Registration no Azure

1. Portal Azure → **Azure Active Directory** → **App registrations** → **New registration**
2. Name: `pbi-dashboard-api` (qualquer nome)
3. Em **API permissions** → Add → **Power BI Service** → `Dataset.Read.All` (Application)
4. **Grant admin consent** para as permissões
5. Em **Certificates & secrets** → New client secret → copie o valor para `CLIENT_SECRET`
6. No workspace do Power BI Service → **Access** → adicione o app como **Member**

---

## Próximos Passos

- [ ] Adaptar queries DAX para o modelo semântico real
- [ ] Adicionar autenticação de usuário (ex: Azure AD SSO via MSAL Browser)
- [ ] Implementar cache Redis no backend para maior performance
- [ ] Adicionar testes unitários (Jest) nos services e controllers
- [ ] Configurar deploy (ex: Azure App Service + Static Web Apps)
- [ ] Adicionar modo dark
- [ ] Expandir filtros para multi-seleção completa
- [ ] Adicionar drill-down nos gráficos
- [ ] Exportar dados como CSV/Excel

---

## Endpoints da API

| Método | Endpoint                  | Descrição                           |
|--------|---------------------------|-------------------------------------|
| `GET`  | `/api/health`             | Status do servidor e fonte de dados |
| `GET`  | `/api/kpis`               | KPIs com variação vs. período anterior |
| `GET`  | `/api/charts/revenue`     | Série temporal de receita           |
| `GET`  | `/api/charts/category`    | Receita por categoria               |
| `GET`  | `/api/table/top-items`    | Tabela paginada de produtos         |
| `GET`  | `/api/filters`            | Opções disponíveis para filtros     |
| `POST` | `/api/refresh`            | Dispara refresh do dataset no PBI   |

Todos os endpoints de dados aceitam query params de filtro: `?period=2024-Q4&category=electronics&region=southeast`
