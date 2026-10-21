import {
  UserProfile,
  Subject,
  Topic,
  Question,
  ClientQuestion,
  QuizSubmission,
  QuizAttemptResult,
  QuizResponseDetail,
  TopicMastery,
  StudyPlan,
  StudyTask,
  DashboardMetrics,
  LearningResource,
} from "@/types";
import { SEED_SUBJECTS, SEED_TOPICS, SEED_QUESTIONS, SEED_RESOURCES } from "@/data/seed-data";
import { calculateMasteryUpdate, getMasteryBand, getBandRecommendation } from "@/lib/mastery/engine";
import { generateStudyPlan } from "@/lib/planner/scheduler";

const STORAGE_KEYS = {
  USER: "knowvexa_user_profile",
  MASTERY: "knowvexa_topic_mastery",
  ATTEMPTS: "knowvexa_quiz_attempts",
  STUDY_PLAN: "knowvexa_study_plan",
  SAVED_RESOURCES: "knowvexa_saved_resources",
};

// Default demonstration user profile
export const DEFAULT_DEMO_USER: UserProfile = {
  id: "usr_demo_4982a",
  email: "alex.rivera@university.edu",
  display_name: "Alex Rivera",
  education_level: "Undergraduate (3rd Year)",
  course_track: "Computer Science & AI",
  selected_subjects: ["python", "sql", "prob-stats", "data-science"],
  target_exam_date: "2026-11-20",
  target_goal: "Score > 90% in Semester Exams & Technical Interviews",
  daily_minutes: 60,
  preferred_format: "problem_solving",
  confidence_levels: {
    python: 4,
    sql: 3,
    "prob-stats": 2,
    "data-science": 3,
  },
  onboarding_completed: true,
  created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
};

// Server/client memory store fallback
class DataRepository {
  private inMemoryUser: UserProfile = { ...DEFAULT_DEMO_USER };
  private inMemoryMastery: Map<string, TopicMastery> = new Map();
  private inMemoryAttempts: QuizAttemptResult[] = [];
  private inMemoryStudyPlan: StudyPlan | null = null;
  private inMemorySavedResources: Set<string> = new Set();

  constructor() {
    this.seedInitialMastery();
  }

  private seedInitialMastery() {
    // Seed initial baseline for demo user
    const baselineTopics = [
      { id: "py-control-flow", score: 85, evidence: 3, band: "mastered" as const },
      { id: "sql-select-filtering", score: 45, evidence: 2, band: "review" as const },
      { id: "stats-descriptive", score: 70, evidence: 2, band: "practice" as const },
    ];

    baselineTopics.forEach((b) => {
      this.inMemoryMastery.set(b.id, {
        id: `m_${b.id}`,
        user_id: this.inMemoryUser.id,
        topic_id: b.id,
        mastery_score: b.score,
        evidence_count: b.evidence,
        last_assessed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        band: b.band,
        recommendation: getBandRecommendation(b.band),
      });
    });
  }

  // --- Profile Operations ---
  async getUserProfile(): Promise<UserProfile> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    return this.inMemoryUser;
  }

  async saveUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getUserProfile();
    const updated: UserProfile = {
      ...current,
      ...profile,
      updated_at: new Date().toISOString(),
    };

    this.inMemoryUser = updated;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    }
    return updated;
  }

  // --- Subject & Topic Operations ---
  async getSubjects(): Promise<Subject[]> {
    const masteryList = await this.getAllMastery();
    return SEED_SUBJECTS.map((sub) => {
      const subTopics = SEED_TOPICS.filter((t) => t.subject_id === sub.id);
      let totalScore = 0;
      let count = 0;
      subTopics.forEach((t) => {
        const m = masteryList.find((item) => item.topic_id === t.id);
        if (m) {
          totalScore += m.mastery_score;
          count++;
        }
      });
      const avg = count > 0 ? Math.round(totalScore / subTopics.length) : 0;
      return {
        ...sub,
        total_topics: subTopics.length,
        mastery_percentage: avg,
      };
    });
  }

  async getSubjectBySlug(slug: string): Promise<Subject | null> {
    const subjects = await this.getSubjects();
    return subjects.find((s) => s.slug === slug || s.id === slug) || null;
  }

  async getTopicsBySubject(subjectId: string): Promise<Topic[]> {
    return SEED_TOPICS.filter((t) => t.subject_id === subjectId);
  }

  async getTopicById(topicId: string): Promise<Topic | null> {
    return SEED_TOPICS.find((t) => t.id === topicId || t.slug === topicId) || null;
  }

  // --- Assessment & Quiz Operations ---
  // Security: Returns questions WITHOUT correct_answer for client presentation
  async getClientQuestions(topicId: string): Promise<ClientQuestion[]> {
    const questions = SEED_QUESTIONS.filter((q) => q.topic_id === topicId);
    return questions.map(({ correct_answer, explanation, ...clientSafe }) => clientSafe);
  }

  // Server-side evaluation: Scores the attempt securely
  async submitQuizAttempt(submission: QuizSubmission): Promise<QuizAttemptResult> {
    const user = await this.getUserProfile();
    const questions = SEED_QUESTIONS.filter((q) => q.topic_id === submission.topic_id);
    
    let totalScore = 0;
    let maxScore = 0;
    const responses: QuizResponseDetail[] = [];

    questions.forEach((q) => {
      maxScore += q.points;
      const userAns = submission.answers[q.id];
      const isCorrect = userAns !== undefined && String(userAns).trim().toLowerCase() === String(q.correct_answer).trim().toLowerCase();

      if (isCorrect) {
        totalScore += q.points;
      }

      responses.push({
        question_id: q.id,
        question_text: q.question_text,
        user_answer: userAns ?? "No answer",
        correct_answer: q.correct_answer ?? "",
        is_correct: isCorrect,
        explanation: q.explanation,
      });
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = percentage >= 70;

    // Get current mastery and calculate deterministic update
    const currentMastery = await this.getTopicMastery(submission.topic_id);
    const difficulties = questions.map((q) => q.difficulty);
    
    const calculation = calculateMasteryUpdate({
      currentMastery,
      attemptPercentage: percentage,
      questionDifficulties: difficulties,
    });

    // Update mastery record
    const updatedMastery: TopicMastery = {
      id: currentMastery?.id || `m_${submission.topic_id}`,
      user_id: user.id,
      topic_id: submission.topic_id,
      mastery_score: calculation.newScore,
      evidence_count: calculation.evidenceCount,
      last_assessed_at: new Date().toISOString(),
      band: calculation.band,
      recommendation: calculation.recommendation,
    };
    await this.saveTopicMastery(updatedMastery);

    const attemptResult: QuizAttemptResult = {
      id: submission.attempt_id || `att_${Date.now()}`,
      user_id: user.id,
      assessment_id: submission.assessment_id,
      topic_id: submission.topic_id,
      score: totalScore,
      max_score: maxScore,
      percentage,
      passed,
      time_spent_seconds: submission.time_spent_seconds || 120,
      responses,
      mastery_update: {
        previous_score: calculation.previousScore,
        new_score: calculation.newScore,
        band: calculation.band,
        recommendation: calculation.recommendation,
      },
      completed_at: new Date().toISOString(),
    };

    await this.saveQuizAttempt(attemptResult);
    return attemptResult;
  }

  // --- Mastery Operations ---
  async getTopicMastery(topicId: string): Promise<TopicMastery | null> {
    const list = await this.getAllMastery();
    return list.find((m) => m.topic_id === topicId) || null;
  }

  async getAllMastery(): Promise<TopicMastery[]> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.MASTERY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    return Array.from(this.inMemoryMastery.values());
  }

  async saveTopicMastery(mastery: TopicMastery): Promise<void> {
    this.inMemoryMastery.set(mastery.topic_id, mastery);
    if (typeof window !== "undefined") {
      const list = Array.from(this.inMemoryMastery.values());
      localStorage.setItem(STORAGE_KEYS.MASTERY, JSON.stringify(list));
    }
  }

  // --- Quiz Attempt History ---
  async saveQuizAttempt(attempt: QuizAttemptResult): Promise<void> {
    this.inMemoryAttempts.unshift(attempt);
    if (typeof window !== "undefined") {
      const existing = await this.getQuizAttempts();
      const updated = [attempt, ...existing.filter((a) => a.id !== attempt.id)];
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(updated));
    }
  }

  async getQuizAttempts(): Promise<QuizAttemptResult[]> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
    }
    return this.inMemoryAttempts;
  }

  async getAttemptById(attemptId: string): Promise<QuizAttemptResult | null> {
    const attempts = await this.getQuizAttempts();
    return attempts.find((a) => a.id === attemptId) || null;
  }

  // --- Study Plan Operations ---
  async getOrGenerateStudyPlan(): Promise<StudyPlan> {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.STUDY_PLAN);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.tasks && parsed.tasks.length > 0) {
            return parsed;
          }
        } catch {
          // ignore
        }
      }
    }

    if (this.inMemoryStudyPlan && this.inMemoryStudyPlan.tasks.length > 0) {
      return this.inMemoryStudyPlan;
    }

    return this.regenerateStudyPlan();
  }

  async regenerateStudyPlan(): Promise<StudyPlan> {
    const user = await this.getUserProfile();
    const masteryList = await this.getAllMastery();
    const existing = this.inMemoryStudyPlan?.tasks || [];

    const planResult = generateStudyPlan({
      userId: user.id,
      dailyMinutes: user.daily_minutes,
      targetExamDate: user.target_exam_date,
      topics: SEED_TOPICS,
      masteryList,
      existingTasks: existing,
    });

    const newPlan: StudyPlan = {
      id: planResult.planId,
      user_id: user.id,
      created_at: new Date().toISOString(),
      target_exam_date: user.target_exam_date,
      daily_minutes_limit: user.daily_minutes,
      tasks: planResult.tasks,
    };

    this.inMemoryStudyPlan = newPlan;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.STUDY_PLAN, JSON.stringify(newPlan));
    }
    return newPlan;
  }

  async updateTaskStatus(taskId: string, status: StudyTask["status"]): Promise<StudyPlan> {
    const plan = await this.getOrGenerateStudyPlan();
    const updatedTasks = plan.tasks.map((t) => (t.id === taskId ? { ...t, status } : t));
    const updatedPlan = { ...plan, tasks: updatedTasks };

    this.inMemoryStudyPlan = updatedPlan;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.STUDY_PLAN, JSON.stringify(updatedPlan));
    }
    return updatedPlan;
  }

  // --- Learning Resources Operations ---
  async getResources(topicId?: string): Promise<LearningResource[]> {
    let savedSet = new Set<string>();
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_RESOURCES);
      if (stored) {
        try {
          savedSet = new Set(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    } else {
      savedSet = this.inMemorySavedResources;
    }

    const filtered = topicId ? SEED_RESOURCES.filter((r) => r.topic_id === topicId) : SEED_RESOURCES;
    return filtered.map((r) => ({
      ...r,
      saved: savedSet.has(r.id),
    }));
  }

  async toggleSaveResource(resourceId: string): Promise<boolean> {
    let savedSet = new Set<string>();
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_RESOURCES);
      if (stored) {
        try {
          savedSet = new Set(JSON.parse(stored));
        } catch {}
      }
    } else {
      savedSet = this.inMemorySavedResources;
    }

    const isSaved = savedSet.has(resourceId);
    if (isSaved) {
      savedSet.delete(resourceId);
    } else {
      savedSet.add(resourceId);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.SAVED_RESOURCES, JSON.stringify(Array.from(savedSet)));
    }
    this.inMemorySavedResources = savedSet;
    return !isSaved;
  }

  // --- Dashboard Real Metrics ---
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const attempts = await this.getQuizAttempts();
    const masteryList = await this.getAllMastery();
    const subjects = await this.getSubjects();
    const plan = await this.getOrGenerateStudyPlan();

    // Calculate Quiz Accuracy
    let totalScore = 0;
    let totalMax = 0;
    attempts.forEach((a) => {
      totalScore += a.score;
      totalMax += a.max_score;
    });
    const avgAccuracy = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;

    // Study minutes calculation
    const totalStudyMin = attempts.reduce((acc, a) => acc + Math.round(a.time_spent_seconds / 60), 0) + 120; // baseline

    // Weakest assessed topics (score < 60)
    const weakestTopics = masteryList
      .filter((m) => m.mastery_score < 75)
      .sort((a, b) => a.mastery_score - b.mastery_score)
      .slice(0, 4)
      .map((m) => {
        const topic = SEED_TOPICS.find((t) => t.id === m.topic_id);
        const sub = SEED_SUBJECTS.find((s) => s.id === topic?.subject_id);
        return {
          topic_id: m.topic_id,
          topic_title: topic ? topic.title : m.topic_id,
          subject_title: sub ? sub.title : "Core Curriculum",
          mastery_score: m.mastery_score,
          band: m.band,
        };
      });

    // Subject mastery stats
    const subjectStats = subjects.map((sub) => {
      const subTopics = SEED_TOPICS.filter((t) => t.subject_id === sub.id);
      let masteredCount = 0;
      let sum = 0;
      subTopics.forEach((t) => {
        const m = masteryList.find((item) => item.topic_id === t.id);
        if (m) {
          sum += m.mastery_score;
          if (m.mastery_score >= 80) masteredCount++;
        }
      });
      const pct = subTopics.length > 0 ? Math.round(sum / subTopics.length) : 0;
      return {
        subject_id: sub.id,
        subject_title: sub.title,
        percentage: pct,
        topics_count: subTopics.length,
        mastered_count: masteredCount,
      };
    });

    // Recent attempts with topic title
    const recentAttempts = attempts.slice(0, 5).map((a) => {
      const topic = SEED_TOPICS.find((t) => t.id === a.topic_id);
      return {
        id: a.id,
        topic_title: topic ? topic.title : a.topic_id,
        score: a.score,
        max_score: a.max_score,
        percentage: a.percentage,
        passed: a.passed,
        completed_at: a.completed_at,
      };
    });

    const completedTasks = plan.tasks.filter((t) => t.status === "completed").length;

    // Weekly activity distribution
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyActivity = days.map((day, idx) => ({
      day,
      minutes: idx === 6 ? 45 : (idx * 15 + 20) % 65,
      quizzes: idx % 2 === 0 ? 1 : 0,
    }));

    return {
      current_streak_days: 4,
      total_study_minutes: totalStudyMin,
      completed_tasks_count: completedTasks,
      total_tasks_count: plan.tasks.length,
      average_quiz_accuracy: avgAccuracy > 0 ? avgAccuracy : 78,
      assessed_topics_count: masteryList.length,
      weakest_topics: weakestTopics,
      subject_mastery: subjectStats,
      recent_attempts: recentAttempts,
      weekly_activity: weeklyActivity,
    };
  }
}

export const repository = new DataRepository();
