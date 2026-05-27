import { log, logError } from "@/lib/logger";
import { trackEvent } from "@/lib/monitor/monitor";

export async function callLLM({
  messages,
  model = "gpt-4.1",
  requestId,
  userId,
}: any) {
  const start = Date.now();

  log({
    message: "LLM call started",
    requestId,
    userId,
    model,
    status: "info",
  });

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages,
        }),
      }
    );

    const data = await response.json();

    const latency = Date.now() - start;

    log({
      message: "LLM call success",
      requestId,
      userId,
      model,
      latency,
      tokens: data?.usage?.total_tokens,
      status: "success",
    });

    trackEvent({
      requestId,
      latency,
      tokens: data?.usage?.total_tokens,
    });

    return data;
  } catch (error: any) {
    const latency = Date.now() - start;

    logError({
      message: "LLM call failed",
      requestId,
      userId,
      latency,
      error: error.message,
      status: "error",
    });

    trackEvent({
      requestId,
      latency,
      error: true,
    });

    throw error;
  }
}
