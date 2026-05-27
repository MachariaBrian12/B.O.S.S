import { callLLM } from "@/services/ai/llm";

export async function chatHandler(req: any, res: any) {
  const requestId =
    req.headers?.["x-request-id"] || "unknown";

  const body = req.body;

  try {
    const result = await callLLM({
      messages: body.messages,
      requestId,
    });

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || "chat_failed",
      requestId,
    });
  }
}
