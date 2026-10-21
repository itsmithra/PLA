import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/lib/ai/provider";
import { SEED_TOPICS } from "@/data/seed-data";

const TutorDialogueSchema = z.object({
  topicId: z.string(),
  userMessage: z.string().min(1),
  conversationHistory: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ).default([]),
  studentMasteryScore: z.number().min(0).max(100).optional().default(50),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topicId, userMessage, conversationHistory, studentMasteryScore } = TutorDialogueSchema.parse(body);

    const topic = SEED_TOPICS.find((t) => t.id === topicId);
    if (!topic) {
      return NextResponse.json({ error: `Topic '${topicId}' not found.` }, { status: 404 });
    }

    const provider = getAIProvider();
    const socraticResult = await provider.conductSocraticDialogue({
      topic,
      userMessage,
      conversationHistory,
      studentMasteryScore,
    });

    return NextResponse.json(
      {
        provider: provider.name,
        is_mock: provider.isMock,
        ...socraticResult,
      },
      { status: 200 }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload", details: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || "Failed to process Socratic tutor turn" },
      { status: 500 }
    );
  }
}
