import { useQuery } from "@tanstack/react-query";
import {
  ExternalLink, CheckCircle2, XCircle, Database,
  Globe, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { api } from "@/services/api";

export function SettingsPage() {
  const { data: health, isLoading, refetch } = useQuery({
    queryKey: ["health"],
    queryFn: () => api.health(),
    refetchInterval: 30_000,
  });

  const isLive = health?.dataSource === "powerbi";

  return (
    <div className="flex flex-col gap-6 max-w-2xl animate-in">
      {/* Connection status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Status da Conexão</CardTitle>
              <CardDescription>Estado atual da integração com Power BI</CardDescription>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => refetch()}>
              <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Database className="size-4 text-muted-foreground" />
              Fonte de dados
            </div>
            {isLoading ? (
              <Badge variant="outline">Verificando...</Badge>
            ) : (
              <Badge variant={isLive ? "default" : "secondary"} className="gap-1.5">
                {isLive ? (
                  <CheckCircle2 className="size-3" />
                ) : (
                  <XCircle className="size-3" />
                )}
                {isLive ? "Power BI Live" : "Mock Data"}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="size-4 text-muted-foreground" />
              Servidor API
            </div>
            <Badge variant="success" className="gap-1.5">
              <CheckCircle2 className="size-3" />
              Online
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Configuration guide */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configurar Power BI</CardTitle>
          <CardDescription>
            Siga os passos abaixo para conectar à fonte de dados real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <Step
            number={1}
            title="Registrar aplicativo no Azure"
            description="Crie um App Registration no Azure Active Directory e anote o Tenant ID e Client ID."
          />
          <Step
            number={2}
            title="Criar credencial de cliente"
            description="Gere um Client Secret na aba 'Certificados e segredos' do seu App Registration."
          />
          <Step
            number={3}
            title="Conceder permissões no Power BI"
            description="Adicione o aplicativo como membro do workspace no Power BI Service com permissão de leitura."
          />
          <Step
            number={4}
            title="Configurar variáveis de ambiente"
            description="Copie o arquivo backend/.env.example para backend/.env e preencha os valores."
          />
          <Step
            number={5}
            title="Desativar modo mock"
            description="No backend/.env, defina USE_MOCK_DATA=false e reinicie o servidor."
          />

          <Separator />

          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Variáveis necessárias
            </p>
            <div className="rounded-md bg-muted px-4 py-3 font-mono text-xs space-y-1">
              {[
                "TENANT_ID=...",
                "CLIENT_ID=...",
                "CLIENT_SECRET=...",
                "POWERBI_WORKSPACE_ID=...",
                "POWERBI_DATASET_ID=...",
                "USE_MOCK_DATA=false",
              ].map((line) => (
                <div key={line} className="text-muted-foreground">
                  {line}
                </div>
              ))}
            </div>
          </div>

          <a
            href="https://learn.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink className="size-3" />
            Documentação Microsoft: Service Principal no Power BI
          </a>
        </CardContent>
      </Card>

      {/* API Endpoints reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Endpoints da API</CardTitle>
          <CardDescription>
            Referência rápida dos endpoints disponíveis no backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { method: "GET", path: "/api/health", desc: "Status do servidor" },
              { method: "GET", path: "/api/kpis", desc: "Indicadores principais" },
              { method: "GET", path: "/api/charts/revenue", desc: "Receita ao longo do tempo" },
              { method: "GET", path: "/api/charts/category", desc: "Receita por categoria" },
              { method: "GET", path: "/api/table/top-items", desc: "Ranking de produtos" },
              { method: "GET", path: "/api/filters", desc: "Opções de filtro disponíveis" },
              { method: "POST", path: "/api/refresh", desc: "Disparar refresh do dataset" },
            ].map((ep) => (
              <div key={ep.path} className="flex items-center gap-3 text-xs">
                <Badge
                  variant={ep.method === "POST" ? "default" : "secondary"}
                  className="w-12 justify-center shrink-0 font-mono"
                >
                  {ep.method}
                </Badge>
                <code className="text-primary font-mono">{ep.path}</code>
                <span className="text-muted-foreground">{ep.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0 mt-0.5">
        {number}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </div>
  );
}
