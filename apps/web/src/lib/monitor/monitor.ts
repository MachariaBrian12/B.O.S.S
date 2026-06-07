type Event = {
  requestId?: string;
  route?: string;
  latency?: number;
  error?: boolean;
  tokens?: number;
};

const window: Event[] = [];

const MAX_WINDOW = 50;

// store events temporarily
export function trackEvent(event: Event) {
  window.push(event);
  if (window.length > MAX_WINDOW) window.shift();

  evaluate(event);
}

// simple anomaly detection
function evaluate(event: Event) {
  const recent = window.slice(-20);

  const avgLatency =
    recent.reduce((acc, e) => acc + (e.latency || 0), 0) /
    (recent.length || 1);

  const errorRate =
    recent.filter(e => e.error).length / (recent.length || 1);

  // 🚨 latency spike
  if (event.latency && event.latency > avgLatency * 2) {
    console.warn("[ALERT] HIGH_LATENCY_DETECTED", {
      requestId: event.requestId,
      latency: event.latency,
      avgLatency,
    });
  }

  // 🚨 error spike
  if (errorRate > 0.2) {
    console.warn("[ALERT] HIGH_ERROR_RATE", {
      errorRate,
    });
  }

  // 🚨 heavy AI usage
  if (event.tokens && event.tokens > 2000) {
    console.warn("[ALERT] HIGH_TOKEN_USAGE", {
      requestId: event.requestId,
      tokens: event.tokens,
    });
  }
}
