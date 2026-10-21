"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Flame,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  RotateCcw,
  BookOpen,
  Calendar,
  Layers,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sidebar } from "@/components/sidebar";
import { DemoBadge } from "@/components/demo-badge";
import { repository } from "@/lib/storage";
import { getAIProvider } from "@/lib/ai/provider";
import { UserProfile, DashboardMetrics, StudyPlan, AIRecommendation, Topic } from "@/types";
import { SEED_TOPICS } from "@/data/seed-data";

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [aiRec, setAiRec] = useState<AIRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [u, m, p] = await Promise.all([
        repository.getUserProfile(),
        repository.getDashboardMetrics(),
        repository.getOrGenerateStudyPlan(),
      ]);

      setUser(u);
      setMetrics(m);
      setStudyPlan(p);

      // AI Recommendation
      const provider = getAIProvider();
      const mastery = await repository.getAllMastery();
      const attempts = await repository.getQuizAttempts();
      const rec = await provider.generateStudyRecommendations({
        profile: u,
        masteryList: mastery,
        recentAttempts: attempts,
        topics: SEED_TOPICS,
      });
      setAiRec(rec);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    const updatedPlan = await repository.updateTaskStatus(taskId, newStatus as any);
    setStudyPlan(updatedPlan);
    const updatedMetrics = await repository.getDashboardMetrics();
    setMetrics(updatedMetrics);
  };

  const handleRegeneratePlan = async () => {
    const newPlan = await repository.regenerateStudyPlan();
    setStudyPlan(newPlan);
    const m = await repository.getDashboardMetrics();
    setMetrics(m);
  };

  if (isLoading || !user || !metrics || !studyPlan) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white animate-pulse">
            <BrainCircuit className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-xs font-semibold text-slate-500">Loading student analytics...</p>
        </div>
      </div>
    );
  }

  // Calculate days until exam
  let daysToExam: number | null = null;
  if (user.target_exam_date) {
    const diff = (new Date(user.target_exam_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    daysToExam = Math.max(0, Math.round(diff));
  }

  return (
    <div className="flex-1 flex bg-slate-50/60 dark:bg-slate-950">
      <Sidebar streakDays={metrics.current_streak_days} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
        {/* Welcome & Goal Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200/80 dark:border-slate-800/80 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Welcome back, {user.display_name}!
              </h1>
              <span className="text-xl">👋</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.course_track} • Daily Target: {user.daily_minutes} mins • Goal: {user.target_goal}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {daysToExam !== null && (
              <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Exam in {daysToExam} Days</span>
              </div>
            )}
            <Link href="/study-plan">
              <Button size="sm" variant="primary">
                View Full Planner
              </Button>
            </Link>
          </div>
        </div>

        {/* Demo Mode Notice */}
        <DemoBadge />

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Current Streak</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics.current_streak_days} Days
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Consistent Daily Study</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Quiz Accuracy</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics.average_quiz_accuracy}%
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Across {metrics.assessed_topics_count} Assessed Topics
            </p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Study Time</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics.total_study_minutes} Mins
            </div>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">Cumulative Time</p>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500">Daily Tasks</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics.completed_tasks_count} / {metrics.total_tasks_count}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {metrics.total_tasks_count > 0 && metrics.completed_tasks_count === metrics.total_tasks_count
                ? "All tasks completed!"
                : "Tasks remaining today"}
            </p>
          </Card>
        </div>

        {/* AI Tutor Insights Box */}
        {aiRec && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-400/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">AI Personalized Guidance</h3>
                  <span className="text-[10px] text-indigo-300">
                    {aiRec.is_mock ? "Rule-Grounded Demo Engine" : "Gemini Generative Engine"}
                  </span>
                </div>
              </div>
              <Badge variant="purple" size="sm">Active Syllabus Plan</Badge>
            </div>

            <p className="text-xs text-indigo-100 leading-relaxed">{aiRec.summary}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-indigo-800/60">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Demonstrated Strengths
                </span>
                <ul className="mt-1 space-y-1 text-xs text-indigo-200">
                  {aiRec.strengths.slice(0, 2).map((s, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Priority Knowledge Gaps
                </span>
                <ul className="mt-1 space-y-1 text-xs text-indigo-200">
                  {aiRec.knowledge_gaps.slice(0, 2).map((g, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-[11px] text-indigo-300/80 italic pt-1">
              &quot;{aiRec.motivational_insight}&quot;
            </p>
          </div>
        )}

        {/* Main 2-Column Split: Today's Tasks & Subject Mastery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: Today's Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Today&apos;s Calibrated Tasks</CardTitle>
                  <CardDescription>
                    Deterministic schedule tailored to {user.daily_minutes} min daily budget.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegeneratePlan}
                  title="Recalculate tasks based on latest quiz results"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Re-sync
                </Button>
              </CardHeader>

              <CardContent className="space-y-3 pt-2">
                {studyPlan.tasks.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      You are all caught up for today!
                    </p>
                    <p className="text-xs text-slate-500">
                      Take a diagnostic quiz or explore syllabus topics to add tasks.
                    </p>
                  </div>
                ) : (
                  studyPlan.tasks.map((task) => {
                    const isCompleted = task.status === "completed";

                    return (
                      <div
                        key={task.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isCompleted
                            ? "bg-slate-50 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-60"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <button
                              type="button"
                              onClick={() => handleToggleTask(task.id, task.status)}
                              className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                isCompleted
                                  ? "bg-emerald-600 border-emerald-600 text-white"
                                  : "border-slate-300 dark:border-slate-700 hover:border-indigo-500"
                              }`}
                            >
                              {isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </button>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`font-bold text-sm ${
                                    isCompleted ? "line-through text-slate-400" : "text-slate-900 dark:text-white"
                                  }`}
                                >
                                  {task.topic_title}
                                </span>
                                <Badge
                                  variant={
                                    task.priority === "high"
                                      ? "danger"
                                      : task.priority === "medium"
                                      ? "warning"
                                      : "default"
                                  }
                                  size="sm"
                                >
                                  {task.activity_type.toUpperCase()} • {task.estimated_minutes}m
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {task.reason}
                              </p>
                            </div>
                          </div>

                          {!isCompleted && (
                            <Link href={`/learn/${task.topic_id}`}>
                              <Button size="sm" variant="outline" className="shrink-0 text-xs">
                                Start
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Weakest Assessed Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Priority Knowledge Gaps
                </CardTitle>
                <CardDescription>
                  Topics with mastery &lt; 75 requiring targeted review before exams.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {metrics.weakest_topics.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">
                    No weak topics identified yet. Complete diagnostic quizzes to calibrate your gaps.
                  </p>
                ) : (
                  metrics.weakest_topics.map((t) => (
                    <div
                      key={t.topic_id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          {t.subject_title}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {t.topic_title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Progress value={t.mastery_score} size="sm" className="w-24" colorVariant="amber" />
                          <span className="text-[11px] font-bold text-amber-600">{t.mastery_score}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/learn/${t.topic_id}`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            Study Concept
                          </Button>
                        </Link>
                        <Link href={`/assessment/${t.topic_id}`}>
                          <Button size="sm" variant="primary" className="text-xs">
                            Take Quiz
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT 1 COLUMN: Subject Mastery & Recent Attempts */}
          <div className="space-y-6">
            {/* Subject Mastery Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Mastery</CardTitle>
                <CardDescription>Progress towards exam readiness</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {metrics.subject_mastery.map((sub) => (
                  <div key={sub.subject_id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <Link href={`/subjects/${sub.subject_id}`} className="font-bold hover:text-indigo-600">
                        {sub.subject_title}
                      </Link>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {sub.percentage}%
                      </span>
                    </div>
                    <Progress value={sub.percentage} size="sm" />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{sub.mastered_count} Mastered</span>
                      <span>{sub.topics_count} Total Topics</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Assessment Attempts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Quiz Attempts</CardTitle>
                <CardDescription>Persisted results and explanations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {metrics.recent_attempts.length === 0 ? (
                  <div className="text-center py-4 text-xs text-slate-500">
                    No quizzes attempted yet. Take your first diagnostic quiz!
                  </div>
                ) : (
                  metrics.recent_attempts.map((att) => (
                    <Link
                      key={att.id}
                      href={`/assessment/results/${att.id}`}
                      className="block p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
                          {att.topic_title}
                        </span>
                        <Badge variant={att.passed ? "success" : "danger"} size="sm">
                          {att.percentage}%
                        </Badge>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Score: {att.score}/{att.max_score}</span>
                        <span>{new Date(att.completed_at).toLocaleDateString()}</span>
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
