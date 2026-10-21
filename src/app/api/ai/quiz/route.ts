import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/lib/ai/provider";
import { repository } from "@/lib/storage";
import { SEED_TOPICS } from "@/data/seed-data";

const GenerateQuizSchema = z.object({
  topicId: z.string(),
  count: z.number().int().min(1).max(10).optional().default(3),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topicId, count } = GenerateQuizSchema.parse(body);

    const topic = SEED_TOPICS.find((t) => t.id === topicId);
    if (!topic) {
      return NextResponse.json({ error: `Topic with id '${topicId}' not found.` }, { status: 404 });
    }

    const provider = getAIProvider();
    const questions = await provider.generateDiagnosticQuiz(topic, count);

    return NextResponse.json(
      {
        topic_id: topicId,
        topic_title: topic.title,
        provider: provider.name,
        is_mock: provider.isMock,
        questions,
      },
      { status: 200 }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || "Failed to generate AI quiz" },
      { status: 500 }
    );
  }
}
