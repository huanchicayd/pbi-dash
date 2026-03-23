import { Request, Response, NextFunction } from "express";
import { TableService } from "../services/tableService";

const service = new TableService();

export async function getTopItems(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(String(req.query.page ?? "1"), 10);
    const pageSize = parseInt(String(req.query.pageSize ?? "10"), 10);
    const sortBy = typeof req.query.sortBy === "string" ? req.query.sortBy : "revenue";
    const sortDir = req.query.sortDir === "asc" ? "asc" : "desc";
    const period = typeof req.query.period === "string" ? req.query.period : undefined;

    const data = await service.getTopItems({ page, pageSize, sortBy, sortDir, period });
    res.json(data);
  } catch (err) {
    next(err);
  }
}
