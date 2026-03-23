/**
 * Power BI REST API client.
 *
 * Wraps the Power BI REST API for executing DAX queries against
 * a semantic model (dataset) in the Power BI Service.
 *
 * API reference:
 *   https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/execute-queries
 *
 * Usage:
 *   const client = new PowerBiClient(config);
 *   const rows = await client.executeDax("EVALUATE VALUES('Dim Date'[Year])");
 */

import axios, { AxiosInstance } from "axios";
import { DaxQueryRequest, DaxQueryResponse, PowerBiConfig } from "../types";
import { MsalClient } from "./msalClient";

const POWERBI_API_BASE = "https://api.powerbi.com/v1.0/myorg";

export class PowerBiClient {
  private readonly http: AxiosInstance;
  private readonly msal: MsalClient;

  constructor(private readonly cfg: PowerBiConfig) {
    this.msal = new MsalClient(cfg);
    this.http = axios.create({
      baseURL: POWERBI_API_BASE,
      timeout: 30_000,
    });

    // Attach Bearer token to every request
    this.http.interceptors.request.use(async (request) => {
      const token = await this.msal.getAccessToken();
      request.headers.Authorization = `Bearer ${token}`;
      return request;
    });
  }

  /**
   * Executes a DAX query against the configured dataset.
   *
   * @param dax - A valid DAX EVALUATE expression.
   *              Must start with EVALUATE (or DEFINE ... EVALUATE).
   * @returns An array of row objects, where keys are column names
   *          in the format "TableName[ColumnName]" or as aliased in the query.
   *
   * @example
   * const rows = await client.executeDax(`
   *   EVALUATE
   *   SUMMARIZECOLUMNS(
   *     'Dim Date'[Month],
   *     "Revenue", SUM('Fact Sales'[Revenue])
   *   )
   * `);
   */
  async executeDax(dax: string): Promise<Array<Record<string, unknown>>> {
    const url = `/groups/${this.cfg.workspaceId}/datasets/${this.cfg.datasetId}/executeQueries`;

    const body: DaxQueryRequest = {
      queries: [{ query: dax }],
      serializerSettings: { includeNulls: true },
    };

    const response = await this.http.post<DaxQueryResponse>(url, body);
    const table = response.data?.results?.[0]?.tables?.[0];

    if (!table) {
      return [];
    }

    return table.rows ?? [];
  }

  /**
   * Triggers an on-demand refresh of the dataset in the Power BI Service.
   * Requires Dataset.ReadWrite.All permission in the app registration.
   *
   * @returns The refresh request ID (from the response Location header).
   */
  async triggerRefresh(): Promise<string | undefined> {
    const url = `/groups/${this.cfg.workspaceId}/datasets/${this.cfg.datasetId}/refreshes`;
    const response = await this.http.post(url, {
      notifyOption: "NoNotification",
    });
    // The refresh ID is returned in the Location header
    const location = response.headers?.location as string | undefined;
    return location?.split("/").pop();
  }

  /**
   * Retrieves the current refresh history for the dataset.
   * Useful for monitoring refresh status.
   */
  async getRefreshHistory(): Promise<unknown[]> {
    const url = `/groups/${this.cfg.workspaceId}/datasets/${this.cfg.datasetId}/refreshes?$top=5`;
    const response = await this.http.get(url);
    return response.data?.value ?? [];
  }
}
