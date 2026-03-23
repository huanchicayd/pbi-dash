import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { PowerBiClient } from "../clients/powerBiClient";

export async function triggerRefresh(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (config.data.useMock) {
      // In mock mode, simulate a refresh
      await new Promise((r) => setTimeout(r, 500));
      res.json({ success: true, message: "Refresh simulado (modo mock ativo)", refreshId: undefined });
      return;
    }

    const pbi = new PowerBiClient(config.powerBi);
    const refreshId = await pbi.triggerRefresh();

    res.json({
      success: true,
      message: "Refresh do dataset iniciado com sucesso.",
      refreshId,
    });
  } catch (err) {
    next(err);
  }
}
