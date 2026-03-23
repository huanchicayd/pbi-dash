import { Request, Response } from "express";
import { config } from "../config";

export function healthCheck(_req: Request, res: Response): void {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
    dataSource: config.data.useMock ? "mock" : "powerbi",
  });
}
