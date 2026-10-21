"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  BrainCircuit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { repository } from "@/lib/storage";
import { ClientQuestion, Topic } from "@/types";

export default function AssessmentQuizPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params?.id as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [questions, setQuestions] = useState<ClientQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      setIsLoading(true);
      const [t, qs] = await Promise.all([
        repository.getTopicById(topicId),
        repository.getClientQuestions(topicId),
      ]);
      setTopic(t);
      setQuestions(qs);
      setIsLoading(false);
    };

    loadQuiz();
  }, [topicId]);

  // Timer interval
  useEffect(() => {
    if (isLoading || questions.length === 0) return;
    const interval = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLoading, questions.length]);

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await repository.submitQuizAttempt({
        assessment_id: `diag_${topicId}_${Date.now()}`,
        topic_id: topicId,
        answers,
        time_spent_seconds: timeSpentSeconds,
      });

      router.push(`/assessment/results/${result.id}`);
    } catch (err) {
      console.error("Quiz submission error:", err);
      setIsSubmitting(false);
    }
  };

  if (isLoading || !topic) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <p className="text-xs text-slate-500">Preparing diagnostic assessment...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 p-6">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold">No Questions Found</h2>
        <p className="text-xs text-slate-500">
          Questions for this topic are currently being populated.
        </p>
        <Link href={`/learn/${topicId}`}>
          <Button variant="outline" size="sm">Return to Topic</Button>
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full space-y-6">
      {/* Top status bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <Link
          href={`/learn/${topicId}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Lesson
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{formatTimer(timeSpentSeconds)}</span>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {answeredCount} of {questions.length} Answered
          </span>
        </div>
      </div>

      {/* Progress line */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-semibold text-slate-500">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{progressPct}% Completed</span>
        </div>
        <Progress value={progressPct} size="sm" />
      </div>

      {/* Question Card */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-soft">
        <div className="flex items-center justify-between">
          <Badge variant="purple" size="sm">
            {currentQ.difficulty.toUpperCase()} • {currentQ.points} PTS
          </Badge>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Server-Evaluated
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQ.question_text}
        </h2>

        {/* Options */}
        {currentQ.options && currentQ.options.length > 0 ? (
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = answers[currentQ.id] === option;
              const optionLetter = String.fromCharCode(65 + idx);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, option)}
                  className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 shadow-xs font-bold"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {optionLetter}
                    </span>
                    <span className="text-xs sm:text-sm leading-snug">{option}</span>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">Your Answer:</label>
            <input
              type="text"
              value={answers[currentQ.id] || ""}
              onChange={(e) => handleSelectOption(currentQ.id, e.target.value)}
              placeholder="Type your answer..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
            />
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <Button
            variant="outline"
            size="md"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          {currentIndex < questions.length - 1 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
            >
              Next Question <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={handleSubmitQuiz}
              isLoading={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Submit Diagnostic Attempt <CheckCircle2 className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
