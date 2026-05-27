import { v4 as uuidv4 } from "uuid";

export type Trace = {
  requestId: string;
  userId?: string;
  startTime: number;
};

export function createTrace(requestId?: string, userId?: string): Trace {
  return {
    requestId: requestId || uuidv4(),
    userId,
    startTime: Date.now(),
  };
}

export function getLatency(trace: Trace) {
  return Date.now() - trace.startTime;
}
