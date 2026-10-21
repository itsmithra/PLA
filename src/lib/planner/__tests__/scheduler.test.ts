import { describe, it, expect } from "vitest";
import { generateStudyPlan } from "../scheduler";
import { Topic, TopicMastery } from "@/types";

describe("Study Planner Scheduler", () => {
  const mockTopics: Topic[] = [
    {
      id: "py-basics",
      subject_id: "python",
      title: "Python Syntax and Variables",
      slug: "syntax-variables",
      description: "Fundamental syntax",
      difficulty: "beginner",
      order_index: 1,
      learning_objectives: ["Variables", "Data Types"],
      concept_explanation: "Variables store data.",
      worked_example: { problem: "x = 5", solution: "x is 5", key_steps: ["Assign"] },
      common_mistakes: ["Using keywords as names"],
      practice_questions: [],
      prerequisites: [],
    },
    {
      id: "py-control",
      subject_id: "python",
      title: "Control Flow (If/Else, Loops)",
      slug: "control-flow",
      description: "Conditionals and loops",
      difficulty: "beginner",
      order_index: 2,
      learning_objectives: ["Loops", "Conditionals"],
      concept_explanation: "Loops repeat execution.",
      worked_example: { problem: "for i in range(5)", solution: "Prints 0 to 4", key_steps: ["Loop"] },
      common_mistakes: ["Infinite loop"],
      practice_questions: [],
      prerequisites: ["py-basics"],
    },
    {
      id: "py-functions",
      subject_id: "python",
      title: "Functions and Scope",
      slug: "functions-scope",
      description: "Reusable logic",
      difficulty: "intermediate",
      order_index: 3,
      learning_objectives: ["Functions", "Scope"],
      concept_explanation: "Functions encapsulate logic.",
      worked_example: { problem: "def add(a, b): return a + b", solution: "Sum", key_steps: ["Define"] },
      common_mistakes: ["Modifying global without declaration"],
      practice_questions: [],
      prerequisites: ["py-control"],
    },
  ];

  it("prioritizes weak topics (score < 40) over competent ones", () => {
    const masteryList: TopicMastery[] = [
      {
        id: "m1",
        user_id: "u1",
        topic_id: "py-basics",
        mastery_score: 90,
        evidence_count: 3,
        last_assessed_at: new Date().toISOString(),
        band: "mastered",
        recommendation: "Done",
      },
      {
        id: "m2",
        user_id: "u1",
        topic_id: "py-control",
        mastery_score: 30, // weak
        evidence_count: 2,
        last_assessed_at: new Date().toISOString(),
        band: "relearn",
        recommendation: "Relearn",
      },
      {
        id: "m3",
        user_id: "u1",
        topic_id: "py-functions",
        mastery_score: 70, // competent
        evidence_count: 2,
        last_assessed_at: new Date().toISOString(),
        band: "practice",
        recommendation: "Practice",
      },
    ];

    const plan = generateStudyPlan({
      userId: "u1",
      dailyMinutes: 60,
      topics: mockTopics,
      masteryList,
    });

    expect(plan.tasks.length).toBeGreaterThan(0);
    // Weak topic should be highest priority task
    expect(plan.tasks[0].topic_id).toBe("py-control");
    expect(plan.tasks[0].priority).toBe("high");
    expect(plan.tasks[0].activity_type).toBe("learn");
  });

  it("strictly respects the dailyMinutes limit", () => {
    const plan = generateStudyPlan({
      userId: "u1",
      dailyMinutes: 35, // small budget
      topics: mockTopics,
      masteryList: [],
    });

    const totalMinutes = plan.tasks.reduce((sum, t) => sum + t.estimated_minutes, 0);
    expect(totalMinutes).toBeLessThanOrEqual(35);
  });

  it("deprioritizes advanced topics whose prerequisites are not yet mastered", () => {
    // py-basics is weak (25%), so py-control (which requires py-basics) should not come before py-basics
    const masteryList: TopicMastery[] = [
      {
        id: "m1",
        user_id: "u1",
        topic_id: "py-basics",
        mastery_score: 25,
        evidence_count: 1,
        last_assessed_at: new Date().toISOString(),
        band: "relearn",
        recommendation: "Relearn",
      },
    ];

    const plan = generateStudyPlan({
      userId: "u1",
      dailyMinutes: 45,
      topics: mockTopics,
      masteryList,
    });

    expect(plan.tasks[0].topic_id).toBe("py-basics");
  });
});
