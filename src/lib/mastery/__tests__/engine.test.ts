import { describe, it, expect } from "vitest";
import { calculateMasteryUpdate, getMasteryBand, getBandRecommendation } from "../engine";

describe("Mastery Engine", () => {
  it("establishes accurate baseline on initial assessment without prior evidence", () => {
    const result = calculateMasteryUpdate({
      currentMastery: null,
      attemptPercentage: 75,
    });

    expect(result.previousScore).toBe(0);
    expect(result.newScore).toBe(75);
    expect(result.evidenceCount).toBe(1);
    expect(result.band).toBe("practice");
    expect(result.recommendation).toContain("Practice with additional questions");
  });

  it("handles 0-39 relearn band correctly", () => {
    const result = calculateMasteryUpdate({
      currentMastery: null,
      attemptPercentage: 25,
    });

    expect(result.band).toBe("relearn");
    expect(result.recommendation).toContain("Relearn fundamentals");
  });

  it("handles 40-59 review band correctly", () => {
    const result = calculateMasteryUpdate({
      currentMastery: null,
      attemptPercentage: 55,
    });

    expect(result.band).toBe("review");
    expect(result.recommendation).toContain("Review concepts");
  });

  it("handles 80-100 mastered band correctly", () => {
    const result = calculateMasteryUpdate({
      currentMastery: null,
      attemptPercentage: 92,
    });

    expect(result.band).toBe("mastered");
    expect(result.recommendation).toContain("Attempt advanced challenges");
  });

  it("applies weighted update when evidence accumulates (single attempt does not shift mastery 100%)", () => {
    const prior = {
      mastery_score: 85,
      evidence_count: 3,
      last_assessed_at: new Date().toISOString(),
    };

    // Student has an off-day and scores 40%
    const result = calculateMasteryUpdate({
      currentMastery: prior,
      attemptPercentage: 40,
    });

    // Score should decrease, but not plummet directly to 40
    expect(result.previousScore).toBe(85);
    expect(result.newScore).toBeLessThan(85);
    expect(result.newScore).toBeGreaterThan(50);
    expect(result.evidenceCount).toBe(4);
  });

  it("gradually increases mastery as multiple successful quizzes are recorded", () => {
    let current = {
      mastery_score: 30,
      evidence_count: 1,
      last_assessed_at: new Date().toISOString(),
    };

    // Attempt 1: 80%
    const update1 = calculateMasteryUpdate({
      currentMastery: current,
      attemptPercentage: 80,
    });
    expect(update1.newScore).toBeGreaterThan(30);

    current = {
      mastery_score: update1.newScore,
      evidence_count: update1.evidenceCount,
      last_assessed_at: new Date().toISOString(),
    };

    // Attempt 2: 90%
    const update2 = calculateMasteryUpdate({
      currentMastery: current,
      attemptPercentage: 90,
    });
    expect(update2.newScore).toBeGreaterThan(update1.newScore);
  });

  it("applies advanced difficulty bonus on high performance", () => {
    const prior = {
      mastery_score: 70,
      evidence_count: 2,
      last_assessed_at: new Date().toISOString(),
    };

    const regularResult = calculateMasteryUpdate({
      currentMastery: prior,
      attemptPercentage: 85,
      questionDifficulties: ["beginner", "beginner"],
    });

    const hardResult = calculateMasteryUpdate({
      currentMastery: prior,
      attemptPercentage: 85,
      questionDifficulties: ["advanced", "advanced"],
    });

    expect(hardResult.newScore).toBeGreaterThanOrEqual(regularResult.newScore);
  });

  it("handles temporal decay when last attempt was more than 14 days ago", () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const result = calculateMasteryUpdate({
      currentMastery: {
        mastery_score: 90,
        evidence_count: 5,
        last_assessed_at: thirtyDaysAgo,
      },
      attemptPercentage: 80,
    });

    expect(result.newScore).toBeLessThan(90);
  });
});
