import { Request, Response, NextFunction } from "express";
import { KpiService } from "../services/kpiService";
import { ActiveFilters } from "../types";

const service = new KpiService();

export async function getKpis(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filters = extractFilters(req.query);
    const data = await service.getKpis(filters);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

function extractFilters(query: Request["query"]): ActiveFilters {
  return {
    period: str(query.period),
    category: strOrArr(query.category),
    region: strOrArr(query.region),
    startDate: str(query.startDate),
    endDate: str(query.endDate),
  };
}

function str(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function strOrArr(v: unknown): string | string[] | undefined {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string") return v;
  return undefined;
}
