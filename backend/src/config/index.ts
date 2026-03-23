import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const config = {
  server: {
    port: parseInt(optional("PORT", "3001"), 10),
    nodeEnv: optional("NODE_ENV", "development"),
    corsOrigin: optional("CORS_ORIGIN", "http://localhost:5173"),
  },

  /**
   * Power BI / Microsoft Entra ID credentials.
   * These throw at startup if not set and USE_MOCK_DATA is false.
   */
  get powerBi() {
    return {
      tenantId: required("TENANT_ID"),
      clientId: required("CLIENT_ID"),
      clientSecret: required("CLIENT_SECRET"),
      workspaceId: required("POWERBI_WORKSPACE_ID"),
      datasetId: required("POWERBI_DATASET_ID"),
    };
  },

  data: {
    useMock: optional("USE_MOCK_DATA", "true") === "true",
    cacheTtlSeconds: parseInt(optional("CACHE_TTL_SECONDS", "60"), 10),
  },
} as const;

export const isDev = config.server.nodeEnv === "development";
