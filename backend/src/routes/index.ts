import { Router } from "express";
import { healthCheck } from "../controllers/healthController";
import { getKpis } from "../controllers/kpiController";
import { getRevenueChart, getCategoryChart } from "../controllers/chartController";
import { getTopItems } from "../controllers/tableController";
import { getFilters } from "../controllers/filterController";
import { triggerRefresh } from "../controllers/refreshController";

const router = Router();

// Health
router.get("/health", healthCheck);

// Data endpoints
router.get("/kpis", getKpis);
router.get("/charts/revenue", getRevenueChart);
router.get("/charts/category", getCategoryChart);
router.get("/table/top-items", getTopItems);
router.get("/filters", getFilters);

// Actions
router.post("/refresh", triggerRefresh);

export default router;
