"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCode2,
  Database,
  Binary,
  LineChart,
  ArrowRight,
  BookOpen,
  Clock,
  Sparkles,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { repository } from "@/lib/storage";
import { Subject } from "@/types";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    repository.getSubjects().then((subs) => {
      setSubjects(subs);
      setIsLoading(false);
    });
  }, []);

  const getSubjectIcon = (id: string) => {
    if (id === "python") return <FileCode2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
    if (id === "sql") return <Database className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />;
    if (id === "prob-stats") return <Binary className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
    return <LineChart className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
  };

  return (
    <div className="flex-1 flex bg-slate-50/60 dark:bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800/80 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Curriculum & Subjects
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a domain to inspect module prerequisites, concept explanations, and diagnostic quizzes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((sub) => {
            const mastery = sub.mastery_percentage || 0;

            return (
              <Card key={sub.id} hoverEffect className="flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {getSubjectIcon(sub.id)}
                    </div>
                    <Badge variant="secondary" size="md">
                      {sub.difficulty_level.toUpperCase()} • ~{sub.estimated_hours}h
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {sub.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">
                        Subject Mastery
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {mastery}%
                      </span>
                    </div>
                    <Progress value={mastery} size="sm" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 mt-6 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    {sub.total_topics} Topics & Practice Sets
                  </span>
                  <Link href={`/subjects/${sub.slug}`}>
                    <Button size="sm" variant="primary">
                      Explore Topics <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
