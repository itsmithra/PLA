"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Sparkles,
  FileText,
  Share2,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { repository } from "@/lib/storage";
import { getAIProvider } from "@/lib/ai/provider";
import { Topic, TopicMastery, LearningResource } from "@/types";

export default function LearnTopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params?.topicId as string;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [mastery, setMastery] = useState<TopicMastery | null>(null);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [activeHintIndex, setActiveHintIndex] = useState<number | null>(null);
  const [activeAnswerIndex, setActiveAnswerIndex] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [aiSummary, setAiSummary] = useState<{ summary: string; keyTakeaways: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTopic = async () => {
      setIsLoading(true);
      const t = await repository.getTopicById(topicId);
      if (t) {
        setTopic(t);
        const [m, res] = await Promise.all([
          repository.getTopicMastery(t.id),
          repository.getResources(t.id),
        ]);
        setMastery(m);
        setResources(res);

        // Fetch AI Summary
        const provider = getAIProvider();
        provider.generateTopicSummary(t).then((s) => {
          setAiSummary({ summary: s.summary, keyTakeaways: s.keyTakeaways });
        });
      }
      setIsLoading(false);
    };

    loadTopic();
  }, [topicId]);

  const handleMarkAsCompleted = async () => {
    setIsCompleted(true);
    // Find task in study plan if active and mark done
    const plan = await repository.getOrGenerateStudyPlan();
    const task = plan.tasks.find((t) => t.topic_id === topic?.id);
    if (task) {
      await repository.updateTaskStatus(task.id, "completed");
    }
  };

  if (isLoading || !topic) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <p className="text-xs text-slate-500">Loading learning module...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-slate-50/60 dark:bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-8">
        <Link
          href={`/subjects/${topic.subject_id}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Subject Syllabus
        </Link>

        {/* Module Header */}
        <div className="space-y-3 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">
              {topic.difficulty.toUpperCase()}
            </Badge>
            {mastery && (
              <Badge variant={mastery.mastery_score >= 80 ? "success" : "warning"} size="sm">
                Current Mastery: {mastery.mastery_score}% ({mastery.band})
              </Badge>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {topic.title}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {topic.description}
          </p>
        </div>

        {/* 1. LEARNING OBJECTIVES */}
        <Card className="bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/70 dark:border-indigo-800/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Core Learning Objectives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {topic.learning_objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* 2. CONCEPT EXPLANATION */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Concept Explanation & Theoretical Grounding
          </h2>
          <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-line text-sm leading-relaxed bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft">
            {topic.concept_explanation}
          </div>
        </div>

        {/* 3. WORKED EXAMPLE */}
        {topic.worked_example && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Worked Example & Step-by-Step Breakdown
            </h2>
            <Card className="border-amber-200/60 dark:border-amber-800/40 bg-amber-50/20 dark:bg-amber-950/10">
              <CardContent className="p-6 space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    The Problem
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                    {topic.worked_example.problem}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                    Synthesized Solution
                  </span>
                  <pre className="mt-1 p-4 rounded-xl bg-slate-900 text-indigo-200 font-mono text-xs overflow-x-auto">
                    <code>{topic.worked_example.solution}</code>
                  </pre>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Key Execution Steps
                  </span>
                  <ol className="mt-2 space-y-1.5 list-decimal list-inside text-xs text-slate-600 dark:text-slate-300">
                    {topic.worked_example.key_steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 4. COMMON MISTAKES */}
        {topic.common_mistakes && topic.common_mistakes.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              Common Pitfalls & Examination Traps
            </h2>
            <div className="space-y-2">
              {topic.common_mistakes.map((mistake, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 flex items-start gap-3"
                >
                  <span className="text-xs font-bold text-rose-600">✕</span>
                  <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
                    {mistake}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. PRACTICE QUESTIONS WITH TOGGLEABLE HINTS & ANSWERS */}
        {topic.practice_questions && topic.practice_questions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              Self-Guided Practice Questions
            </h2>
            <div className="space-y-3">
              {topic.practice_questions.map((pq, i) => (
                <Card key={i} className="p-4 space-y-3">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    Q{i + 1}: {pq.prompt}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveHintIndex(activeHintIndex === i ? null : i)}
                      className="text-xs"
                    >
                      {activeHintIndex === i ? "Hide Hint" : "View Hint"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveAnswerIndex(activeAnswerIndex === i ? null : i)}
                      className="text-xs text-indigo-600 hover:text-indigo-700"
                    >
                      {activeAnswerIndex === i ? "Hide Sample Answer" : "Reveal Answer"}
                    </Button>
                  </div>

                  {activeHintIndex === i && (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 text-xs border border-amber-200/60">
                      💡 <strong>Hint:</strong> {pq.hint}
                    </div>
                  )}

                  {activeAnswerIndex === i && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 text-xs border border-emerald-200/60">
                      ✓ <strong>Sample Answer:</strong> {pq.sample_answer}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 6. VERIFIED LEARNING RESOURCES */}
        {resources.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Curated Documentation & References
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resources.map((res) => (
                <a
                  key={res.id}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="secondary" size="sm">{res.resource_type}</Badge>
                      <span className="text-[10px] text-slate-400">{res.author}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {res.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {res.summary}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 mt-2 inline-flex items-center gap-1">
                    Read Documentation <ArrowRight className="w-3 h-3" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 7. ACTION CONTROLS & RECOMMENDED NEXT ACTIVITY */}
        <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Ready to Validate Your Comprehension?
            </h3>
            <p className="text-xs text-slate-500">
              Take the calibrated quiz to update your topic mastery score on your dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant={isCompleted ? "secondary" : "outline"}
              size="md"
              onClick={handleMarkAsCompleted}
              className="flex-1 sm:flex-none"
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />
                  Marked as Read
                </>
              ) : (
                "Mark as Completed"
              )}
            </Button>

            <Link href={`/assessment/${topic.id}`} className="flex-1 sm:flex-none">
              <Button variant="primary" size="md" className="w-full">
                Take Diagnostic Quiz <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
