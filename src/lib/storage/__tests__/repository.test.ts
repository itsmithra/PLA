import { describe, it, expect, beforeEach } from "vitest";
import { repository } from "../index";

describe("Data Repository and Quiz Workflow", () => {
  it("never returns correct answers in getClientQuestions", async () => {
    const questions = await repository.getClientQuestions("py-control-flow");
    expect(questions.length).toBeGreaterThan(0);
    questions.forEach((q: any) => {
      expect(q.correct_answer).toBeUndefined();
      expect(q.explanation).toBeUndefined();
    });
  });

  it("accurately scores submitted quiz and updates topic mastery deterministically", async () => {
    const priorMastery = await repository.getTopicMastery("py-control-flow");
    const priorScore = priorMastery ? priorMastery.mastery_score : 0;

    // Submit perfect answers for py-control-flow
    const result = await repository.submitQuizAttempt({
      assessment_id: "diag-py-1",
      topic_id: "py-control-flow",
      answers: {
        q_py_cf_1: "True",
        q_py_cf_2: "False",
        q_py_cf_3: "[2, 6, 10]",
      },
      time_spent_seconds: 90,
    });

    expect(result.score).toBe(30);
    expect(result.max_score).toBe(30);
    expect(result.percentage).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.responses.length).toBe(3);
    expect(result.responses.every((r) => r.is_correct)).toBe(true);

    // Verify mastery update
    const updatedMastery = await repository.getTopicMastery("py-control-flow");
    expect(updatedMastery).not.toBeNull();
    expect(updatedMastery!.mastery_score).toBeGreaterThanOrEqual(priorScore);
    expect(updatedMastery!.evidence_count).toBeGreaterThan(0);
    expect(updatedMastery!.band).toBe("mastered");
  });

  it("handles incorrect submissions safely without crash and penalizes score", async () => {
    const result = await repository.submitQuizAttempt({
      assessment_id: "diag-py-2",
      topic_id: "py-control-flow",
      answers: {
        q_py_cf_1: "False", // Incorrect
        q_py_cf_2: "True",  // Incorrect
        q_py_cf_3: "[1, 3, 5]", // Incorrect
      },
      time_spent_seconds: 45,
    });

    expect(result.percentage).toBe(0);
    expect(result.passed).toBe(false);
    expect(result.responses.every((r) => !r.is_correct)).toBe(true);
  });

  it("generates deterministic study plan respecting daily minutes", async () => {
    const plan = await repository.regenerateStudyPlan();
    expect(plan.tasks.length).toBeGreaterThan(0);
    const totalMin = plan.tasks.reduce((sum, t) => sum + t.estimated_minutes, 0);
    expect(totalMin).toBeLessThanOrEqual(plan.daily_minutes_limit);
  });
});
