export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

export type QuestionType = "mcq" | "true_false" | "short_answer";

export type ActivityType = "learn" | "quiz" | "revision" | "practice";

export type TaskPriority = "high" | "medium" | "low";

export type TaskStatus = "pending" | "in_progress" | "completed" | "postponed";

export type MasteryBand = "unseen" | "relearn" | "review" | "practice" | "mastered";

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  education_level: string; // e.g. "College Sophomore", "Undergraduate", "Self-Taught"
  course_track: string; // e.g. "Computer Science & AI", "Data Science", "General Engineering"
  selected_subjects: string[]; // subject slugs or IDs
  target_exam_date?: string | null;
  target_goal: string; // e.g. "Score > 90%", "Master Foundations", "Prepare for Technical Interviews"
  daily_minutes: number; // e.g. 45, 60, 90
  preferred_format: "interactive" | "reading" | "problem_solving" | "visual";
  confidence_levels: Record<string, number>; // subject_id -> 1..5
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  difficulty_level: DifficultyLevel;
  estimated_hours: number;
  total_topics?: number;
  mastery_percentage?: number;
}

export interface Topic {
  id: string;
  subject_id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: DifficultyLevel;
  order_index: number;
  learning_objectives: string[];
  concept_explanation: string;
  worked_example: {
    problem: string;
    solution: string;
    key_steps: string[];
  };
  common_mistakes: string[];
  practice_questions: {
    prompt: string;
    hint: string;
    sample_answer: string;
  }[];
  prerequisites: string[]; // topic IDs
  related_topics?: string[];
  created_at?: string;
}

export interface Question {
  id: string;
  topic_id: string;
  question_text: string;
  question_type: QuestionType;
  options?: string[]; // for mcq
  correct_answer?: string | number; // NEVER sent to client before submission
  explanation: string;
  difficulty: DifficultyLevel;
  points: number;
}

export interface ClientQuestion {
  id: string;
  topic_id: string;
  question_text: string;
  question_type: QuestionType;
  options?: string[];
  difficulty: DifficultyLevel;
  points: number;
}

export interface Assessment {
  id: string;
  topic_id: string;
  title: string;
  description: string;
  time_limit_minutes: number;
  passing_score: number; // e.g. 70
  questions: Question[];
  is_diagnostic?: boolean;
}

export interface QuizSubmission {
  attempt_id?: string;
  assessment_id: string;
  topic_id: string;
  answers: Record<string, string | number>; // question_id -> user answer
  time_spent_seconds: number;
}

export interface QuizResponseDetail {
  question_id: string;
  question_text: string;
  user_answer: string | number;
  correct_answer: string | number;
  is_correct: boolean;
  explanation: string;
}

export interface QuizAttemptResult {
  id: string;
  user_id: string;
  assessment_id: string;
  topic_id: string;
  score: number;
  max_score: number;
  percentage: number;
  passed: boolean;
  time_spent_seconds: number;
  responses: QuizResponseDetail[];
  mastery_update: {
    previous_score: number;
    new_score: number;
    band: MasteryBand;
    recommendation: string;
  };
  completed_at: string;
}

export interface TopicMastery {
  id: string;
  user_id: string;
  topic_id: string;
  mastery_score: number; // 0 to 100
  evidence_count: number;
  last_assessed_at: string;
  band: MasteryBand;
  recommendation: string;
}

export interface StudyTask {
  id: string;
  plan_id: string;
  topic_id: string;
  topic_title: string;
  subject_title: string;
  activity_type: ActivityType;
  estimated_minutes: number;
  priority: TaskPriority;
  reason: string;
  status: TaskStatus;
  due_date: string;
}

export interface StudyPlan {
  id: string;
  user_id: string;
  created_at: string;
  target_exam_date?: string | null;
  daily_minutes_limit: number;
  tasks: StudyTask[];
}

export interface LearningResource {
  id: string;
  topic_id: string;
  title: string;
  url: string;
  resource_type: "article" | "documentation" | "cheatsheet" | "interactive";
  author: string;
  summary: string;
  saved?: boolean;
}

export interface AIRecommendation {
  summary: string;
  strengths: string[];
  knowledge_gaps: string[];
  recommended_actions: {
    topic_id: string;
    topic_title: string;
    action: string;
    reason: string;
    priority: "high" | "medium" | "low";
  }[];
  motivational_insight: string;
  is_mock: boolean;
  generated_at: string;
}

export interface DashboardMetrics {
  current_streak_days: number;
  total_study_minutes: number;
  completed_tasks_count: number;
  total_tasks_count: number;
  average_quiz_accuracy: number;
  assessed_topics_count: number;
  weakest_topics: {
    topic_id: string;
    topic_title: string;
    subject_title: string;
    mastery_score: number;
    band: MasteryBand;
  }[];
  subject_mastery: {
    subject_id: string;
    subject_title: string;
    percentage: number;
    topics_count: number;
    mastered_count: number;
  }[];
  recent_attempts: {
    id: string;
    topic_title: string;
    score: number;
    max_score: number;
    percentage: number;
    passed: boolean;
    completed_at: string;
  }[];
  weekly_activity: {
    day: string;
    minutes: number;
    quizzes: number;
  }[];
}
