export async function runAI(prompt: string, context: any) {
  // Placeholder engine (we will upgrade later to real LLM)
  return {
    output: `AI processed: ${prompt}`,
    context,
  };
}
