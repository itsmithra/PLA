import { describe, it, expect } from "vitest";
import { MockAIProvider, QuizGenerationSchema, RecommendationSchema } from "../provider";
import { SEED_TOPICS } from "@/data/seed-data";

describe("AI Service and Mock Provider", () => {
  const provider = new MockAIProvider();
  const sampleTopic = SEED_TOPICS[0];

  it("identifies explicitly as a demo provider", () => {
    expect(provider.isMock).toBe(true);
    expect(provider.name).toContain("Demo Mode");
  });

  it("generates structured questions that pass Zod validation", async () => {
    const questions = await provider.generateDiagnosticQuiz(sampleTopic, 2);
    expect(questions.length).toBe(2);

    const validated = QuizGenerationSchema.parse(questions);
    expect(validated.length).toBe(2);
    expect(validated[0].topic_id).toBe(sampleTopic.id);
    expect(validated[0].options).toBeDefined();
    expect(validated[0].explanation).toBeDefined();
  });

  it("generates validated recommendations", async () => {
    const rec = await provider.generateStudyRecommendations({
      profile: {
        id: "demo-user",
        email: "demo@knowvexa.ai",
        display_name: "Alex Rivera",
        education_level: "College Junior",
        course_track: "Computer Science & AI",
        selected_subjects: ["python", "sql"],
        target_exam_date: "2026-12-15",
        target_goal: "Score > 90%",
        daily_minutes: 60,
        preferred_format: "problem_solving",
        confidence_levels: { python: 4, sql: 2 },
        onboarding_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      masteryList: [
        {
          id: "m1",
          user_id: "demo-user",
          topic_id: "py-control-flow",
          mastery_score: 85,
          evidence_count: 3,
          last_assessed_at: new Date().toISOString(),
          band: "mastered",
          recommendation: "Mastered",
        },
        {
          id: "m2",
          user_id: "demo-user",
          topic_id: "sql-select-filtering",
          mastery_score: 35,
          evidence_count: 2,
          last_assessed_at: new Date().toISOString(),
          band: "relearn",
          recommendation: "Relearn",
        },
      ],
      recentAttempts: [],
      topics: SEED_TOPICS,
    });

    expect(rec.is_mock).toBe(true);
    expect(rec.knowledge_gaps.length).toBeGreaterThan(0);
    expect(rec.recommended_actions.length).toBeGreaterThan(0);
    expect(RecommendationSchema.parse(rec)).toBeDefined();
  });

  it("provides informative explanation for incorrect answers", async () => {
    const explanation = await provider.explainIncorrectAnswer({
      questionText: "What is the time complexity of set lookup?",
      userAnswer: "O(N)",
      correctAnswer: "O(1)",
      topicTitle: "Data Structures",
    });

    expect(explanation).toContain("O(N)");
    expect(explanation).toContain("O(1)");
    expect(explanation).toContain("Data Structures");
  });
});
