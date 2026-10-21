import { NextRequest, NextResponse } from "next/server";
import { repository } from "@/lib/storage";
import { getAIProvider } from "@/lib/ai/provider";
import { SEED_TOPICS } from "@/data/seed-data";

export async function GET(req: NextRequest) {
  try {
    const user = await repository.getUserProfile();
    const masteryList = await repository.getAllMastery();
    const attempts = await repository.getQuizAttempts();

    const provider = getAIProvider();
    const recommendation = await provider.generateStudyRecommendations({
      profile: user,
      masteryList,
      recentAttempts: attempts,
      topics: SEED_TOPICS,
    });

    return NextResponse.json(recommendation, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate AI recommendation" }, { status: 500 });
  }
}
