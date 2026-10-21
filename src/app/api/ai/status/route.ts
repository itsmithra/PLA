import { NextResponse } from "next/server";
import { getAIProvider } from "@/lib/ai/provider";

export async function GET() {
  const provider = getAIProvider();
  return NextResponse.json(
    {
      provider: provider.name,
      isMock: provider.isMock,
      timestamp: new Date().toISOString(),
      modelsSupported: [
        "qwen/qwen3.8-27b",
        "openai/gpt-oss-120b",
        "gemini-1.5-flash",
      ],
      features: [
        "Diagnostic Quiz Generation",
        "Context-Aware Incorrect Answer Explanation",
        "Adaptive Study Recommendations",
        "Topic Summary & Cheatsheet Generation",
      ],
    },
    { status: 200 }
  );
}
