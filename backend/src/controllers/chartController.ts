import { Request, Response, NextFunction } from "express";
import { ChartService } from "../services/chartService";
import { ActiveFilters } from "../types";

const service = new ChartService();

export async function getRevenueChart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filters = extractFilters(req.query);
    const data = await service.getRevenueChart(filters);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getCategoryChart(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const filters = extractFilters(req.query);
    const data = await service.getCategoryChart(filters);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

function extractFilters(query: Request["query"]): ActiveFilters {
  return {
    period: typeof query.period === "string" ? query.period : undefined,
    category: typeof query.category === "string" ? query.category : undefined,
    region: typeof query.region === "string" ? query.region : undefined,
  };
}
