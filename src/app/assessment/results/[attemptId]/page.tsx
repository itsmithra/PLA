"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { repository } from "@/lib/storage";
import { QuizAttemptResult, Topic } from "@/types";

export default function AssessmentResultsPage() {
  const params = useParams();
  const attemptId = params?.attemptId as string;

  const [attempt, setAttempt] = useState<QuizAttemptResult | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      setIsLoading(true);
      const att = await repository.getAttemptById(attemptId);
      if (att) {
        setAttempt(att);
        const t = await repository.getTopicById(att.topic_id);
        setTopic(t);
      }
      setIsLoading(false);
    };

    loadResult();
  }, [attemptId]);

  if (isLoading || !attempt) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <p className="text-xs text-slate-500">Loading assessment results...</p>
      </div>
    );
  }

  const scoreDelta = attempt.mastery_update.new_score - attempt.mastery_update.previous_score;

  return (
    <div className="min-h-[calc(100vh-8rem)] py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Header Summary */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Diagnostic Assessment Complete</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          {topic?.title || "Topic Assessment"} Results
        </h1>
        <p className="text-xs text-slate-500">
          Completed on {new Date(attempt.completed_at).toLocaleDateString()} in {Math.round(attempt.time_spent_seconds)} seconds
        </p>
      </div>

      {/* Main Score & Mastery Delta Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center space-y-2 flex flex-col justify-center">
          <span className="text-xs font-semibold text-slate-500">Total Score</span>
          <div className="text-4xl font-black text-slate-900 dark:text-white">
            {attempt.score} <span className="text-lg font-medium text-slate-400">/ {attempt.max_score}</span>
          </div>
          <Badge
            variant={attempt.passed ? "success" : "danger"}
            size="md"
            className="mx-auto"
          >
            {attempt.percentage}% • {attempt.passed ? "Passed" : "Needs Review"}
          </Badge>
        </Card>

        {/* Dynamic Mastery Engine Update */}
        <Card className="md:col-span-2 p-6 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/40 border-indigo-200/80 dark:border-indigo-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Mastery Engine Recalibration
            </span>
            <Badge variant="purple" size="sm">
              Band: {attempt.mastery_update.band.toUpperCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400">Previous Mastery</span>
              <p className="text-xl font-bold text-slate-600 dark:text-slate-400">
                {attempt.mastery_update.previous_score}%
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-indigo-500" />
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400">New Calibrated Score</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {attempt.mastery_update.new_score}%
              </p>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ml-auto ${
                scoreDelta >= 0
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
              }`}
            >
              {scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta} pts
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
            <strong>Pedagogical Recommendation:</strong> {attempt.mastery_update.recommendation}
          </p>
        </Card>
      </div>

      {/* Question by Question Detailed Feedback */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Question-by-Question Review & Conceptual Explanations
        </h2>

        {attempt.responses.map((resp, i) => (
          <Card
            key={resp.question_id}
            className={`p-5 space-y-3 border-l-4 ${
              resp.is_correct ? "border-l-emerald-500" : "border-l-rose-500"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Question {i + 1}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {resp.question_text}
                </h3>
              </div>
              {resp.is_correct ? (
                <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold shrink-0">
                  <CheckCircle2 className="w-4 h-4" /> Correct
                </div>
              ) : (
                <div className="flex items-center gap-1 text-rose-600 text-xs font-bold shrink-0">
                  <XCircle className="w-4 h-4" /> Incorrect
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div
                className={`p-3 rounded-xl border ${
                  resp.is_correct
                    ? "bg-emerald-50/50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-200"
                    : "bg-rose-50/50 border-rose-200 text-rose-900 dark:bg-rose-950/20 dark:border-rose-900 dark:text-rose-200"
                }`}
              >
                <span className="font-semibold block text-[10px] uppercase tracking-wider opacity-70">
                  Your Answer
                </span>
                <span className="font-bold">{resp.user_answer}</span>
              </div>

              {!resp.is_correct && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                  <span className="font-semibold block text-[10px] uppercase tracking-wider text-slate-400">
                    Correct Concept
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {resp.correct_answer}
                  </span>
                </div>
              )}
            </div>

            {/* Explanation box */}
            <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              💡 <strong>Explanation:</strong> {resp.explanation}
            </div>
          </Card>
        ))}
      </div>

      {/* Follow-up navigation */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href={`/assessment/${attempt.topic_id}`}>
          <Button variant="outline" size="md">
            <RotateCcw className="w-4 h-4 mr-1" /> Retake Diagnostic
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/study-plan">
            <Button variant="secondary" size="md">
              <Calendar className="w-4 h-4 mr-1" /> Revised Study Plan
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="md">
              Return to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
