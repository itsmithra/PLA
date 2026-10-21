import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/lib/ai/provider";

const DiagnoseSchema = z.object({
  questionText: z.string(),
  userAnswer: z.union([z.string(), z.number()]),
  correctAnswer: z.union([z.string(), z.number()]),
  topicTitle: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = DiagnoseSchema.parse(body);

    const provider = getAIProvider();
    const diagnosis = await provider.diagnoseCognitiveMisconception(validated);

    return NextResponse.json(
      {
        provider: provider.name,
        is_mock: provider.isMock,
        diagnosis,
      },
      { status: 200 }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid schema", details: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || "Failed to diagnose misconception" },
      { status: 500 }
    );
  }
}
