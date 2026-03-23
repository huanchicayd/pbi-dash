/**
 * Microsoft Authentication Library (MSAL) client.
 *
 * Uses the OAuth2 client_credentials flow (app-only authentication).
 * The access token is cached in memory and auto-refreshed before expiry.
 *
 * Required Azure App Registration setup:
 *   1. Register an app at https://portal.azure.com
 *   2. Add API permissions → Power BI Service → Dataset.Read.All (Application)
 *   3. Grant admin consent for the permissions
 *   4. Create a client secret and copy the value to CLIENT_SECRET
 */

import { ConfidentialClientApplication, Configuration } from "@azure/msal-node";
import { PowerBiConfig } from "../types";

const POWERBI_SCOPE = "https://analysis.windows.net/powerbi/api/.default";

export class MsalClient {
  private readonly msal: ConfidentialClientApplication;

  constructor(private readonly cfg: PowerBiConfig) {
    const msalConfig: Configuration = {
      auth: {
        clientId: cfg.clientId,
        authority: `https://login.microsoftonline.com/${cfg.tenantId}`,
        clientSecret: cfg.clientSecret,
      },
    };

    this.msal = new ConfidentialClientApplication(msalConfig);
  }

  /**
   * Acquires an access token for the Power BI REST API.
   * MSAL handles token caching and refresh automatically.
   */
  async getAccessToken(): Promise<string> {
    const result = await this.msal.acquireTokenByClientCredential({
      scopes: [POWERBI_SCOPE],
    });

    if (!result || !result.accessToken) {
      throw new Error(
        "Failed to acquire access token from Microsoft Entra ID. " +
          "Check your TENANT_ID, CLIENT_ID, and CLIENT_SECRET."
      );
    }

    return result.accessToken;
  }
}
