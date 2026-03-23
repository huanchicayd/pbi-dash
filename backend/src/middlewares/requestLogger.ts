import morgan from "morgan";
import { isDev } from "../config";

// Concise format in dev, combined (Apache-style) in production
export const requestLogger = morgan(isDev ? "dev" : "combined");
