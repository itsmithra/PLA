import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAIProvider } from "@/lib/ai/provider";
import { SEED_TOPICS } from "@/data/seed-data";

const TopicSummaryRequestSchema = z.object({
  topicId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topicId } = TopicSummaryRequestSchema.parse(body);

    const topic = SEED_TOPICS.find((t) => t.id === topicId);
    if (!topic) {
      return NextResponse.json({ error: `Topic '${topicId}' not found` }, { status: 404 });
    }

    const provider = getAIProvider();
    const summary = await provider.generateTopicSummary(topic);

    return NextResponse.json(
      {
        topic_id: topicId,
        topic_title: topic.title,
        provider: provider.name,
        is_mock: provider.isMock,
        ...summary,
      },
      { status: 200 }
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload", details: err.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: err.message || "Failed to generate topic summary" },
      { status: 500 }
    );
  }
}
