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

  it("selects GroqProvider when GROQ_API or GROQ_API_KEY is present", async () => {
    const { getAIProvider, GroqProvider } = await import("../provider");
    const prev = process.env.GROQ_API;
    try {
      process.env.GROQ_API = "gsk_test_key_mock_12345";
      const p = getAIProvider();
      expect(p).toBeInstanceOf(GroqProvider);
      expect(p.isMock).toBe(false);
      expect(p.name).toContain("Groq");
    } finally {
      process.env.GROQ_API = prev;
    }
  });

  it("diagnoses cognitive misconceptions with mental model fix and memory anchors", async () => {
    const { CognitiveDiagnosisSchema } = await import("../provider");
    const diagnosis = await provider.diagnoseCognitiveMisconception({
      questionText: "What does list.sort() return in Python?",
      userAnswer: "The sorted list",
      correctAnswer: "None (modifies in-place)",
      topicTitle: "Python In-Place Mutation",
    });

    expect(diagnosis.misconception_type).toBeDefined();
    expect(diagnosis.root_cause_analysis).toBeDefined();
    expect(diagnosis.mental_model_fix).toBeDefined();
    expect(diagnosis.memory_anchor).toBeDefined();
    expect(diagnosis.immediate_challenge).toBeDefined();

    const parsed = CognitiveDiagnosisSchema.parse(diagnosis);
    expect(parsed.misconception_type.length).toBeGreaterThan(0);
  });

  it("conducts Socratic dialogue with guiding questions", async () => {
    const { SocraticTurnSchema } = await import("../provider");
    const turn = await provider.conductSocraticDialogue({
      topic: sampleTopic,
      userMessage: "Can I use break inside an if statement without a loop?",
      conversationHistory: [],
      studentMasteryScore: 40,
    });

    expect(turn.reply).toBeDefined();
    expect(turn.pedagogical_goal).toBeDefined();
    expect(turn.guiding_question).toBeDefined();

    const parsed = SocraticTurnSchema.parse(turn);
    expect(parsed.guiding_question.length).toBeGreaterThan(0);
  });

  it("generates adaptive quizzes aligned with mastery bands", async () => {
    const beginnerQuiz = await provider.generateAdaptiveQuiz(sampleTopic, 30, 2);
    expect(beginnerQuiz.length).toBe(2);
    expect(beginnerQuiz[0].difficulty).toBe("beginner");

    const advancedQuiz = await provider.generateAdaptiveQuiz(sampleTopic, 85, 2);
    expect(advancedQuiz.length).toBe(2);
    expect(advancedQuiz[0].difficulty).toBe("advanced");
  });
});

