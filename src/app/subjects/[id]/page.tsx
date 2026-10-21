"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  Sparkles,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { repository } from "@/lib/storage";
import { Subject, Topic, TopicMastery } from "@/types";

export default function SubjectDetailPage() {
  const params = useParams();
  const subjectSlug = params?.id as string;

  const [subject, setSubject] = useState<Subject | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [masteryList, setMasteryList] = useState<TopicMastery[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectData = async () => {
      setIsLoading(true);
      const sub = await repository.getSubjectBySlug(subjectSlug);
      if (sub) {
        setSubject(sub);
        const [tList, mList] = await Promise.all([
          repository.getTopicsBySubject(sub.id),
          repository.getAllMastery(),
        ]);
        setTopics(tList);
        setMasteryList(mList);
      }
      setIsLoading(false);
    };

    fetchSubjectData();
  }, [subjectSlug]);

  if (isLoading || !subject) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <p className="text-xs text-slate-500">Loading syllabus topics...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-slate-50/60 dark:bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
        <Link
          href="/subjects"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Subject Library
        </Link>

        {/* Subject Header */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2">
                {subject.difficulty_level.toUpperCase()} CURRICULUM
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {subject.title}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                {subject.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-semibold text-slate-400">Mastery</span>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {subject.mastery_percentage || 0}%
              </p>
            </div>
          </div>
        </div>

        {/* Topic List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Syllabus Topics & Diagnostic Status
            </h2>
            <span className="text-xs text-slate-500">
              {topics.length} Modules in Sequence
            </span>
          </div>

          {topics.map((topic, index) => {
            const mastery = masteryList.find((m) => m.topic_id === topic.id);
            const score = mastery ? mastery.mastery_score : 0;
            const band = mastery ? mastery.band : "unseen";

            const getBandBadge = () => {
              if (band === "mastered") return <Badge variant="success">Mastered ({score}%)</Badge>;
              if (band === "practice") return <Badge variant="default">Practice ({score}%)</Badge>;
              if (band === "review") return <Badge variant="warning">Review ({score}%)</Badge>;
              if (band === "relearn") return <Badge variant="danger">Relearn ({score}%)</Badge>;
              return <Badge variant="secondary">Unassessed</Badge>;
            };

            return (
              <Card key={topic.id} hoverEffect className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-center">
                        {index + 1}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">
                        {topic.title}
                      </h3>
                      {getBandBadge()}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {topic.description}
                    </p>

                    {/* Learning Objectives Preview */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {topic.learning_objectives.slice(0, 2).map((obj, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md"
                        >
                          <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    <Link href={`/learn/${topic.id}`}>
                      <Button size="sm" variant="outline">
                        Learn Concept
                      </Button>
                    </Link>
                    <Link href={`/assessment/${topic.id}`}>
                      <Button size="sm" variant="primary">
                        Take Quiz
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
