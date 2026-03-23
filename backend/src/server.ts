import app from "./app";
import { config } from "./config";

const { port, nodeEnv } = config.server;

app.listen(port, () => {
  console.log(`\n  ✦ API running  →  http://localhost:${port}/api`);
  console.log(`  ✦ Environment  →  ${nodeEnv}`);
  console.log(`  ✦ Data source  →  ${config.data.useMock ? "mock data" : "Power BI Live"}`);
  console.log(`\n  Endpoints:`);
  console.log(`    GET  /api/health`);
  console.log(`    GET  /api/kpis`);
  console.log(`    GET  /api/charts/revenue`);
  console.log(`    GET  /api/charts/category`);
  console.log(`    GET  /api/table/top-items`);
  console.log(`    GET  /api/filters`);
  console.log(`    POST /api/refresh\n`);
});
