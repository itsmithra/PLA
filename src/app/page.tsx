import React from "react";
import Link from "next/link";
import {
  BrainCircuit,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BarChart3,
  CalendarCheck,
  ShieldCheck,
  Cpu,
  Target,
  BookOpen,
  FileCode2,
  Database,
  Binary,
  LineChart,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SEED_SUBJECTS } from "@/data/seed-data";

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Intelligent Curriculum Adaptation for Semester Exams</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl leading-[1.12]">
          Learn smarter. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">
            Grow faster.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Knowvexa AI analyzes your diagnostic assessments, pinpoints exact knowledge gaps, and synthesizes a calibrated daily study plan that adapts in real time to your exam schedule.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto group">
              Start Free Diagnostic
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Explore Demo Workspace
            </Button>
          </Link>
        </div>

        {/* Value Highlights */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-10 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Deterministic Mastery Scoring (0–100)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Prerequisite-Aware Scheduling</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Server-Scored Quiz Security</span>
          </div>
        </div>

        {/* 2. INTERACTIVE DASHBOARD PREVIEW */}
        <div className="mt-16 w-full max-w-5xl rounded-3xl p-3 bg-gradient-to-b from-slate-200/80 via-slate-100 to-slate-200/40 dark:from-slate-800/80 dark:via-slate-900 dark:to-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-card">
          <div className="rounded-2xl bg-white dark:bg-slate-950 p-6 sm:p-8 text-left border border-slate-100 dark:border-slate-900 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Student Learning Dashboard Preview
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Alex Rivera • Computer Science & AI
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="purple" size="md">Upcoming Exam: 24 Days</Badge>
                <Badge variant="success" size="md">4-Day Study Streak</Badge>
              </div>
            </div>

            {/* Metric preview cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                <p className="text-xs text-slate-500 font-medium">Daily Target</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">60 Min</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">45m scheduled today</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                <p className="text-xs text-slate-500 font-medium">Average Quiz Score</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">82%</p>
                <p className="text-[11px] text-indigo-600 font-medium mt-1">Based on 12 attempts</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                <p className="text-xs text-slate-500 font-medium">Mastered Modules</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">7 / 16</p>
                <p className="text-[11px] text-purple-600 font-medium mt-1">Score ≥ 80</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                <p className="text-xs text-slate-500 font-medium">High Urgency Tasks</p>
                <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">2 Pending</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">SQL & Prob Stats</p>
              </div>
            </div>

            {/* Sample task item */}
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="danger" size="sm">High Priority</Badge>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">SQL & Relational Databases</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Review: SQL Query Execution & Three-Valued Logic
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recommended because quiz accuracy was 45% (Band: Review). 20 min guided exercises.
                </p>
              </div>
              <Link href="/login">
                <Button size="sm">Launch Session</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ADAPTIVE CYCLE / HOW IT WORKS */}
      <section id="features" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="default" className="mb-3">The Adaptive Architecture</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              How Knowvexa Personalizes Your Syllabus
            </h2>
            <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
              Unlike static course playlists, Knowvexa treats your learning like an evolving graph where evidence shifts your daily plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card hoverEffect>
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Diagnostic Assessment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Take calibrated multi-choice and problem-solving quizzes with questions generated from real course objectives.
              </p>
            </Card>

            <Card hoverEffect>
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-base mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Mastery Band Categorization
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Scores feed our deterministic Bayesian-inspired mastery rule: Relearn (0–39), Review (40–59), Practice (60–79), or Mastered (80–100).
              </p>
            </Card>

            <Card hoverEffect>
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-base mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Topological Daily Planner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Generates daily study blocks respecting prerequisite sequences and your daily available time limit without cognitive overload.
              </p>
            </Card>

            <Card hoverEffect>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-base mb-4">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                Spaced Revision & Recall
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Mastered concepts trigger scheduled 7-day recall quizzes to prevent temporal decay before midterms and finals.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. CURRICULUM SECTION */}
      <section id="curriculum" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="purple" className="mb-3">Pre-Seeded College Syllabus</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Engineered for Core Technical Degrees
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300">
            High-yield, educationally verified topics with step-by-step worked examples, pitfalls, and verified questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SEED_SUBJECTS.map((sub) => {
            const getIcon = () => {
              if (sub.id === "python") return <FileCode2 className="w-6 h-6 text-indigo-600" />;
              if (sub.id === "sql") return <Database className="w-6 h-6 text-cyan-600" />;
              if (sub.id === "prob-stats") return <Binary className="w-6 h-6 text-purple-600" />;
              return <LineChart className="w-6 h-6 text-emerald-600" />;
            };

            return (
              <Card key={sub.id} hoverEffect className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {getIcon()}
                    </div>
                    <Badge variant="secondary" size="md">
                      {sub.difficulty_level.toUpperCase()} • ~{sub.estimated_hours}h
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {sub.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {sub.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {sub.total_topics} Modules & Question Banks
                  </span>
                  <Link href={`/subjects/${sub.slug}`} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
                    Explore Syllabus <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. MASTERY ENGINE SECTION */}
      <section id="mastery-system" className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="purple">Transparent Mastery Model</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                No Black Boxes. <br />
                Deterministic Mastery Scoring.
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                A single lucky guess shouldn’t mark a subject as learned, and one bad day shouldn’t erase your hard work.
                Knowvexa calculates mastery on a 0–100 scale using an adaptive evidence-weighting formula:
              </p>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-indigo-300">
                α = max(0.20, 1 / √(evidence_count + 1))<br />
                M_new = (1 - α) * M_prior + α * S_attempt_adjusted
              </div>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Early quizzes rapidly establish baseline; subsequent attempts require consistent evidence.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Temporal decay gradually adjusts mastery if a topic is left unpracticed for over 14 days.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Transparent unit tests guarantee repeatable behavior.</span>
                </li>
              </ul>
            </div>

            {/* Mastery Bands Graphic */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div>
                    <h4 className="font-bold text-sm">0 – 39: Relearn Fundamentals</h4>
                    <p className="text-xs text-slate-400">Re-study core definitions and worked examples</p>
                  </div>
                </div>
                <Badge variant="danger">High Urgency</Badge>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div>
                    <h4 className="font-bold text-sm">40 – 59: Review & Guided Practice</h4>
                    <p className="text-xs text-slate-400">Address partial comprehension with step hints</p>
                  </div>
                </div>
                <Badge variant="warning">Review</Badge>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div>
                    <h4 className="font-bold text-sm">60 – 79: Additional Questions</h4>
                    <p className="text-xs text-slate-400">Build speed and test edge cases under time limits</p>
                  </div>
                </div>
                <Badge variant="default">Competent</Badge>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <div>
                    <h4 className="font-bold text-sm">80 – 100: Mastered</h4>
                    <p className="text-xs text-slate-400">Scheduled for spaced retention revision</p>
                  </div>
                </div>
                <Badge variant="success">Mastered</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <Badge variant="default" className="mb-2">Frequently Asked Questions</Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Everything You Need To Know
          </h2>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Can I use Knowvexa without a paid Supabase or Gemini subscription?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes! Knowvexa features an offline demonstration mode with pre-seeded datasets, full client-side persistence, and deterministic AI fallbacks. You can test the complete assessment, scoring, study planning, and analytics flow without spending a dime.
            </p>
          </Card>

          <Card>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Are quiz answers sent to the browser during the quiz?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Never. In compliance with security standards, questions sent to the client omit correct answers and explanations. Grading occurs exclusively on the server, preventing answer inspection via browser devtools.
            </p>
          </Card>

          <Card>
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              How does the daily study planner calculate what I should study?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              The scheduler factors in your available daily minutes, upcoming exam dates, prerequisite graph relationships, and weak topics (mastery &lt; 60). It prioritizes fundamental gaps first and guarantees that your allocated time never exceeds your preferred limit.
            </p>
          </Card>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-tr from-indigo-900 via-indigo-950 to-purple-950 text-white shadow-glow">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to master your university subjects?
          </h2>
          <p className="text-indigo-200 text-base max-w-xl mx-auto mb-8">
            Create your learning profile in under 2 minutes, take your first diagnostic quiz, and receive your personalized study schedule today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto bg-white text-indigo-950 hover:bg-slate-100 font-bold">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-indigo-400/40 bg-indigo-900/40 hover:bg-indigo-900/60">
                Log In as Demo Student
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
