import { callLLM } from "@/services/ai/llm";
import { logger } from "@/lib/logger";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const body = await req.json();

  const requestId =
    req.headers.get("x-request-id") || uuidv4();

  const start = Date.now();

  logger.info({
    message: "Chat request started",
    requestId,
  });

  try {
    const result = await callLLM({
      messages: body.messages,
      requestId,
    });

    logger.info({
      message: "Chat request success",
      requestId,
      latency: Date.now() - start,
    });

    return Response.json(result);
  } catch (err: any) {
    logger.error({
      message: "Chat request failed",
      requestId,
      error: err.message,
    });

    return Response.json(
      { error: "failed", requestId },
      { status: 500 }
    );
  }
}
