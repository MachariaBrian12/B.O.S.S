export type LogEvent = {
  message: string;
  requestId?: string;
  userId?: string;
  route?: string;
  latency?: number;
  status?: "success" | "error" | "info";
  model?: string;
  tokens?: number;
  error?: string;
  meta?: any;
};

export function formatLog(event: LogEvent) {
  return {
    timestamp: new Date().toISOString(),
    service: "BOSS",
    env: process.env.NODE_ENV,
    ...event,
  };
}
