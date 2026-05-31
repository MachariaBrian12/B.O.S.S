export const runtime = "edge";

export async function GET() {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
    return new Response("ok");
  } catch {
    return new Response("backend unreachable", { status: 503 });
  }
}
