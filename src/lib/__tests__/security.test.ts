import { describe, it, expect } from "vitest";
import { repository } from "@/lib/storage";
import { SEED_QUESTIONS } from "@/data/seed-data";
import { calculateMasteryUpdate } from "@/lib/mastery/engine";

describe("Security and Data Integrity Test Suite", () => {
  it("strictly prevents leaking correct answers or explanations before quiz submission", async () => {
    const topicId = "py-control-flow";
    const clientSafeQuestions = await repository.getClientQuestions(topicId);

    expect(clientSafeQuestions.length).toBeGreaterThan(0);
    clientSafeQuestions.forEach((q: any) => {
      // Must not possess the correct_answer property
      expect(q.correct_answer).toBeUndefined();
      // Must not leak the pedagogical explanation in client payload
      expect(q.explanation).toBeUndefined();
      // Must only contain safe client fields
      expect(q.id).toBeDefined();
      expect(q.question_text).toBeDefined();
      expect(q.question_type).toBeDefined();
      expect(q.points).toBeDefined();
    });
  });

  it("evaluates scores strictly on the engine rather than trusting client-supplied score totals", async () => {
    // Attempt to forge a high score with wrong answers
    const fraudulentSubmission = {
      assessment_id: "forged_test",
      topic_id: "py-control-flow",
      answers: {
        q_py_cf_1: "INCORRECT_ATTEMPT",
        q_py_cf_2: "INCORRECT_ATTEMPT",
        q_py_cf_3: "INCORRECT_ATTEMPT",
      },
      time_spent_seconds: 10,
    };

    const result = await repository.submitQuizAttempt(fraudulentSubmission);

    // Engine must calculate real score (0) and reject forged score
    expect(result.score).toBe(0);
    expect(result.percentage).toBe(0);
    expect(result.passed).toBe(false);
  });

  it("enforces deterministic bounds on mastery scores (never below 0 or above 100)", () => {
    // Edge case: 100% score on already 100% mastery with extreme difficulty
    const maxBound = calculateMasteryUpdate({
      currentMastery: { mastery_score: 100, evidence_count: 10, last_assessed_at: new Date().toISOString() },
      attemptPercentage: 100,
      questionDifficulties: ["advanced", "advanced"],
    });
    expect(maxBound.newScore).toBeLessThanOrEqual(100);

    // Edge case: 0% score on 0% mastery
    const minBound = calculateMasteryUpdate({
      currentMastery: { mastery_score: 0, evidence_count: 10, last_assessed_at: new Date().toISOString() },
      attemptPercentage: 0,
      questionDifficulties: ["beginner"],
    });
    expect(minBound.newScore).toBeGreaterThanOrEqual(0);
  });
});
