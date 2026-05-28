import pino from "pino";
import { formatLog } from "./logging/format";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function log(event: any) {
  logger.info(formatLog(event));
}

export function logError(event: any) {
  logger.error(formatLog(event));
}
