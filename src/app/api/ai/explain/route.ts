import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/lib/ai/provider";

const ExplainSchema = z.object({
  questionText: z.string(),
  userAnswer: z.union([z.string(), z.number()]),
  correctAnswer: z.union([z.string(), z.number()]),
  topicTitle: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ExplainSchema.parse(body);

    const provider = getAIProvider();
    const explanation = await provider.explainIncorrectAnswer(validated);

    return NextResponse.json({ explanation }, { status: 200 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid schema", details: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: err.message || "Failed to generate explanation" }, { status: 500 });
  }
}
