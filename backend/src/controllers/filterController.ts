import { Request, Response, NextFunction } from "express";
import { FilterService } from "../services/filterService";

const service = new FilterService();

export async function getFilters(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await service.getFilters();
    res.json(data);
  } catch (err) {
    next(err);
  }
}
