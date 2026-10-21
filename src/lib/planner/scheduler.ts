import { Topic, TopicMastery, StudyTask, ActivityType, TaskPriority } from "@/types";

export interface PlannerInput {
  userId: string;
  dailyMinutes: number; // e.g. 45 or 60
  targetExamDate?: string | null;
  topics: Topic[];
  masteryList: TopicMastery[];
  existingTasks?: StudyTask[];
  currentDate?: string;
}

export interface GeneratedPlanResult {
  planId: string;
  userId: string;
  totalPlannedMinutes: number;
  dailyLimit: number;
  tasks: StudyTask[];
  summary: {
    urgentTopicsCount: number;
    reviewTopicsCount: number;
    newTopicsCount: number;
    revisionScheduledCount: number;
  };
}

/**
 * Deterministic, topologically aware study plan generator.
 *
 * Algorithm Steps:
 * 1. Filter out mastered topics unless due for spaced revision (> 7 days).
 * 2. Prerequisite Check: If topic has unmastered prerequisites, prioritize prerequisites first!
 * 3. Priority Scoring:
 *    - Exam proximity factor: If exam is in <= 14 days, prioritize weak assessed topics.
 *    - Mastery gap: topics with score < 40 get highest priority (+50 pts).
 *    - Topics with score 40-59 get (+35 pts).
 *    - Incomplete/postponed tasks from previous session get carry-over boost (+20 pts).
 * 4. Task Bin-Packing:
 *    Greedily schedule activities (learn, quiz, practice, revision) such that:
 *    Sum(estimated_minutes) <= dailyMinutes.
 *    Never exceed the daily budget unless explicitly overridden.
 */
export function generateStudyPlan(input: PlannerInput): GeneratedPlanResult {
  const now = input.currentDate ? new Date(input.currentDate) : new Date();
  const dailyLimit = Math.max(15, input.dailyMinutes || 45);

  const masteryMap = new Map<string, TopicMastery>();
  input.masteryList.forEach((m) => masteryMap.set(m.topic_id, m));

  // Determine days remaining until exam
  let daysToExam: number | null = null;
  if (input.targetExamDate) {
    const examDate = new Date(input.targetExamDate);
    const diff = (examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    daysToExam = Math.max(0, Math.round(diff));
  }

  // Check which topics are mastered (score >= 80)
  const isMastered = (topicId: string) => {
    const m = masteryMap.get(topicId);
    return m ? m.mastery_score >= 80 : false;
  };

  // Score candidate topics
  interface Candidate {
    topic: Topic;
    masteryScore: number;
    evidenceCount: number;
    hasUnmetPrereqs: boolean;
    unmetPrereqIds: string[];
    priorityScore: number;
    recommendedActivity: ActivityType;
    estimatedMinutes: number;
    reason: string;
  }

  const candidates: Candidate[] = [];

  for (const topic of input.topics) {
    const mastery = masteryMap.get(topic.id);
    const score = mastery ? mastery.mastery_score : 0;
    const evidence = mastery ? mastery.evidence_count : 0;
    const lastAssessed = mastery ? new Date(mastery.last_assessed_at) : null;

    // Check prerequisites
    const unmetPrereqs = (topic.prerequisites || []).filter((pId) => !isMastered(pId));
    const hasUnmetPrereqs = unmetPrereqs.length > 0;

    let priority = 0;
    let activity: ActivityType = "learn";
    let estMin = 25;
    let reason = "";

    if (hasUnmetPrereqs) {
      // Defer topic until prerequisite is tackled
      priority -= 50;
    }

    if (evidence === 0) {
      // Unseen topic
      priority += 40;
      activity = "learn";
      estMin = 25;
      reason = "New topic in syllabus: master core principles and worked examples.";
    } else if (score < 40) {
      // Relearn band - highest urgency
      priority += 75;
      activity = "learn";
      estMin = 30;
      reason = `Critical knowledge gap (Mastery: ${score}%). Relearn fundamental concepts.`;
    } else if (score < 60) {
      // Review band
      priority += 55;
      activity = "practice";
      estMin = 20;
      reason = `Developing comprehension (Mastery: ${score}%). Solve guided exercises.`;
    } else if (score < 80) {
      // Practice band
      priority += 35;
      activity = "quiz";
      estMin = 15;
      reason = `Competent (Mastery: ${score}%). Complete speed quiz to reach mastery threshold.`;
    } else {
      // Mastered band: check for spaced repetition
      const daysSince = lastAssessed
        ? (now.getTime() - lastAssessed.getTime()) / (1000 * 60 * 60 * 24)
        : 0;

      if (daysSince >= 7) {
        priority += 25;
        activity = "revision";
        estMin = 15;
        reason = `Spaced retention revision (${Math.round(daysSince)} days since last assessment).`;
      } else {
        // Skip mastered topics recently reviewed
        continue;
      }
    }

    // Boost priority if exam is imminent (within 14 days)
    if (daysToExam !== null && daysToExam <= 14) {
      if (score < 60) {
        priority += 30;
        reason += ` [Upcoming exam in ${daysToExam} days]`;
      }
    }

    // Carry-over check from existing postponed or incomplete tasks
    const existing = input.existingTasks?.find(
      (t) => t.topic_id === topic.id && (t.status === "postponed" || t.status === "pending")
    );
    if (existing) {
      priority += 15;
    }

    candidates.push({
      topic,
      masteryScore: score,
      evidenceCount: evidence,
      hasUnmetPrereqs,
      unmetPrereqIds: unmetPrereqs,
      priorityScore: priority,
      recommendedActivity: activity,
      estimatedMinutes: estMin,
      reason,
    });
  }

  // Sort candidates by priority score descending
  candidates.sort((a, b) => b.priorityScore - a.priorityScore);

  // Greedily fit into dailyMinutes budget
  const selectedTasks: StudyTask[] = [];
  let allocatedMinutes = 0;
  const planId = `plan_${Date.now()}`;
  const todayStr = now.toISOString().split("T")[0];

  let urgentCount = 0;
  let reviewCount = 0;
  let newCount = 0;
  let revisionCount = 0;

  for (const c of candidates) {
    if (allocatedMinutes + c.estimatedMinutes <= dailyLimit) {
      let priorityLevel: TaskPriority = "medium";
      if (c.priorityScore >= 60) priorityLevel = "high";
      else if (c.priorityScore <= 25) priorityLevel = "low";

      if (c.masteryScore < 40) urgentCount++;
      else if (c.masteryScore < 60) reviewCount++;
      else if (c.evidenceCount === 0) newCount++;
      else if (c.recommendedActivity === "revision") revisionCount++;

      selectedTasks.push({
        id: `task_${c.topic.id}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 5)}`,
        plan_id: planId,
        topic_id: c.topic.id,
        topic_title: c.topic.title,
        subject_title: c.topic.subject_id,
        activity_type: c.recommendedActivity,
        estimated_minutes: c.estimatedMinutes,
        priority: priorityLevel,
        reason: c.reason,
        status: "pending",
        due_date: todayStr,
      });

      allocatedMinutes += c.estimatedMinutes;
    }
  }

  // If time remains and no tasks selected (e.g. dailyLimit is small or all topics mastered),
  // pick at least 1 quick 15-minute practice or revision task
  if (selectedTasks.length === 0 && candidates.length > 0) {
    const top = candidates[0];
    selectedTasks.push({
      id: `task_${top.topic.id}_${Date.now().toString(36)}`,
      plan_id: planId,
      topic_id: top.topic.id,
      topic_title: top.topic.title,
      subject_title: top.topic.subject_id,
      activity_type: top.recommendedActivity,
      estimated_minutes: Math.min(dailyLimit, top.estimatedMinutes),
      priority: "medium",
      reason: top.reason,
      status: "pending",
      due_date: todayStr,
    });
    allocatedMinutes += Math.min(dailyLimit, top.estimatedMinutes);
  }

  return {
    planId,
    userId: input.userId,
    totalPlannedMinutes: allocatedMinutes,
    dailyLimit,
    tasks: selectedTasks,
    summary: {
      urgentTopicsCount: urgentCount,
      reviewTopicsCount: reviewCount,
      newTopicsCount: newCount,
      revisionScheduledCount: revisionCount,
    },
  };
}
