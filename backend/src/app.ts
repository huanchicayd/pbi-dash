import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import { config } from "./config";
import { requestLogger } from "./middlewares/requestLogger";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";
import routes from "./routes";

const app = express();

// ─── Security ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.server.corsOrigin,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Rate limiting ────────────────────────────────────────────────────────────
app.use(
  rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 120,            // max requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ─── Parsing & compression ────────────────────────────────────────────────────
app.use(compression());
app.use(express.json());

// ─── Logging ─────────────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api", routes);

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
