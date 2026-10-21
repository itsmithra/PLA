"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { repository } from "@/lib/storage";
import { DashboardMetrics, TopicMastery, Subject } from "@/types";
import { SEED_TOPICS } from "@/data/seed-data";

export default function ProgressPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [masteryList, setMasteryList] = useState<TopicMastery[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      setIsLoading(true);
      const [m, mList, subs] = await Promise.all([
        repository.getDashboardMetrics(),
        repository.getAllMastery(),
        repository.getSubjects(),
      ]);
      setMetrics(m);
      setMasteryList(mList);
      setSubjects(subs);
      setIsLoading(false);
    };

    loadProgress();
  }, []);

  if (isLoading || !metrics) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <p className="text-xs text-slate-500">Loading learning analytics...</p>
      </div>
    );
  }

  // Mastery band count
  const bands = {
    mastered: masteryList.filter((m) => m.band === "mastered").length,
    practice: masteryList.filter((m) => m.band === "practice").length,
    review: masteryList.filter((m) => m.band === "review").length,
    relearn: masteryList.filter((m) => m.band === "relearn").length,
  };

  return (
    <div className="flex-1 flex bg-slate-50/60 dark:bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        <div className="pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Learning Analytics & Mastery Distribution
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real data compiled from your diagnostic evaluations, accuracy rates, and syllabus coverage.
          </p>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <span className="text-xs font-semibold text-slate-500">Average Accuracy</span>
            <div className="text-2xl font-black text-indigo-600 mt-1">
              {metrics.average_quiz_accuracy}%
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Across all quizzes</p>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-semibold text-slate-500">Assessed Modules</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {metrics.assessed_topics_count}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">With recorded evidence</p>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-semibold text-slate-500">Mastered (≥ 80%)</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {bands.mastered}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Ready for exams</p>
          </Card>

          <Card className="p-4">
            <span className="text-xs font-semibold text-slate-500">Total Study Time</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {metrics.total_study_minutes}m
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Logged study minutes</p>
          </Card>
        </div>

        {/* Mastery Band Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Mastery Band Distribution</CardTitle>
            <CardDescription>
              Categorized according to Knowvexa deterministic thresholds
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/60">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300">0 – 39: Relearn</span>
                <p className="text-2xl font-black text-rose-600 mt-1">{bands.relearn}</p>
                <span className="text-[11px] text-rose-500">Urgent review</span>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/60">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300">40 – 59: Review</span>
                <p className="text-2xl font-black text-amber-600 mt-1">{bands.review}</p>
                <span className="text-[11px] text-amber-500">Guided exercises</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/60">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300">60 – 79: Practice</span>
                <p className="text-2xl font-black text-blue-600 mt-1">{bands.practice}</p>
                <span className="text-[11px] text-blue-500">Speed quizzes</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">80 – 100: Mastered</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">{bands.mastered}</p>
                <span className="text-[11px] text-emerald-500">Spaced recall</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity Visualizer */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Study Rhythm</CardTitle>
            <CardDescription>Minutes dedicated each day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-40 pt-4 px-2 sm:px-8">
              {metrics.weekly_activity.map((item) => {
                const maxMin = 65;
                const heightPct = Math.round((item.minutes / maxMin) * 100);

                return (
                  <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                    <span className="text-[10px] font-bold text-slate-500">{item.minutes}m</span>
                    <div className="w-8 sm:w-12 bg-slate-100 dark:bg-slate-800 rounded-t-lg h-28 flex items-end overflow-hidden">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t-lg transition-all duration-500"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Subject Breakdown List */}
        <Card>
          <CardHeader>
            <CardTitle>Subject-by-Subject Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics.subject_mastery.map((sub) => (
              <div key={sub.subject_id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {sub.subject_title}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {sub.mastered_count} of {sub.topics_count} modules mastered
                    </span>
                  </div>
                  <Badge variant="purple" size="md">{sub.percentage}% Overall</Badge>
                </div>
                <Progress value={sub.percentage} size="sm" />
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
