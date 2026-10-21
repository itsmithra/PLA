"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  RotateCcw,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Sliders,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { repository } from "@/lib/storage";
import { StudyPlan, StudyTask, UserProfile } from "@/types";

export default function StudyPlanPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadPlan = async () => {
    setIsLoading(true);
    const [u, p] = await Promise.all([
      repository.getUserProfile(),
      repository.getOrGenerateStudyPlan(),
    ]);
    setUser(u);
    setStudyPlan(p);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const handleUpdateStatus = async (taskId: string, newStatus: StudyTask["status"]) => {
    const updated = await repository.updateTaskStatus(taskId, newStatus);
    setStudyPlan(updated);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    const updated = await repository.regenerateStudyPlan();
    setStudyPlan(updated);
    setIsRegenerating(false);
  };

  if (isLoading || !studyPlan || !user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <p className="text-xs text-slate-500">Loading personalized study plan...</p>
      </div>
    );
  }

  const totalPlannedMinutes = studyPlan.tasks.reduce(
    (sum, t) => sum + (t.status !== "postponed" ? t.estimated_minutes : 0),
    0
  );
  const completedMinutes = studyPlan.tasks
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.estimated_minutes, 0);

  return (
    <div className="flex-1 flex bg-slate-50/60 dark:bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 dark:border-slate-800/80 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Daily & Weekly Study Planner
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calibrated to your {user.daily_minutes} min/day limit, prioritizing unmastered prerequisites and upcoming exam dates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <Sliders className="w-3.5 h-3.5 mr-1" /> Adjust Time Budget
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRegenerate}
              isLoading={isRegenerating}
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Re-Optimize Plan
            </Button>
          </div>
        </div>

        {/* Budget Summary Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <span className="text-xs font-semibold text-slate-500">Planned Today</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalPlannedMinutes} <span className="text-sm font-medium text-slate-400">/ {user.daily_minutes} mins</span>
            </div>
            <p className="text-[11px] text-indigo-600 font-medium mt-1">
              {totalPlannedMinutes <= user.daily_minutes ? "Within healthy budget" : "Exceeds daily target"}
            </p>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-semibold text-slate-500">Completed Today</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {completedMinutes} mins
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {studyPlan.tasks.filter((t) => t.status === "completed").length} Tasks Finished
            </p>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-semibold text-slate-500">Scheduling Heuristic</span>
            <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
              Topological Ordering
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Prerequisites before advanced modules
            </p>
          </Card>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Scheduled Learning Blocks
            </h2>
            <span className="text-xs text-slate-400">
              {studyPlan.tasks.length} Total Blocks
            </span>
          </div>

          <div className="space-y-3">
            {studyPlan.tasks.map((task) => {
              const isCompleted = task.status === "completed";
              const isPostponed = task.status === "postponed";

              return (
                <Card
                  key={task.id}
                  className={`p-5 transition-all ${
                    isCompleted
                      ? "bg-slate-50 dark:bg-slate-900/40 opacity-60 border-slate-200/50"
                      : isPostponed
                      ? "bg-amber-50/20 dark:bg-amber-950/20 border-amber-200/50"
                      : "bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-bold text-base ${
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
                          {task.priority.toUpperCase()} PRIORITY
                        </Badge>
                        <Badge variant="secondary" size="sm">
                          {task.activity_type.toUpperCase()} • {task.estimated_minutes} MINS
                        </Badge>
                        {isPostponed && (
                          <Badge variant="warning" size="sm">Postponed</Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {task.reason}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!isCompleted ? (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdateStatus(task.id, "completed")}
                            className="text-xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Complete
                          </Button>

                          {!isPostponed ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(task.id, "postponed")}
                              className="text-xs text-amber-600"
                            >
                              Postpone
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(task.id, "pending")}
                              className="text-xs"
                            >
                              Resume
                            </Button>
                          )}

                          <Link
                            href={
                              task.activity_type === "quiz"
                                ? `/assessment/${task.topic_id}`
                                : `/learn/${task.topic_id}`
                            }
                          >
                            <Button size="sm" variant="primary" className="text-xs">
                              Start <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </Link>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateStatus(task.id, "pending")}
                          className="text-xs text-slate-400"
                        >
                          Mark as Incomplete
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
