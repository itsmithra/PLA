"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BrainCircuit,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { repository } from "@/lib/storage";
import { SEED_SUBJECTS } from "@/data/seed-data";
import { UserProfile } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [displayName, setDisplayName] = useState("");
  const [educationLevel, setEducationLevel] = useState("Undergraduate (3rd Year)");
  const [courseTrack, setCourseTrack] = useState("Computer Science & AI");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["python", "sql"]);
  const [confidenceLevels, setConfidenceLevels] = useState<Record<string, number>>({
    python: 3,
    sql: 3,
    "prob-stats": 2,
    "data-science": 3,
  });
  const [targetExamDate, setTargetExamDate] = useState("2026-11-20");
  const [targetGoal, setTargetGoal] = useState("Score > 90% in Semester Exams & Technical Interviews");
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [preferredFormat, setPreferredFormat] = useState<UserProfile["preferred_format"]>("problem_solving");

  useEffect(() => {
    repository.getUserProfile().then((u) => {
      if (u) {
        if (u.display_name) setDisplayName(u.display_name);
        if (u.education_level) setEducationLevel(u.education_level);
        if (u.course_track) setCourseTrack(u.course_track);
        if (u.selected_subjects && u.selected_subjects.length > 0) setSelectedSubjects(u.selected_subjects);
        if (u.daily_minutes) setDailyMinutes(u.daily_minutes);
      }
    });
  }, []);

  const toggleSubject = (subId: string) => {
    if (selectedSubjects.includes(subId)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((id) => id !== subId));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subId]);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await repository.saveUserProfile({
        display_name: displayName || "Student",
        education_level: educationLevel,
        course_track: courseTrack,
        selected_subjects: selectedSubjects,
        confidence_levels: confidenceLevels,
        target_exam_date: targetExamDate,
        target_goal: targetGoal,
        daily_minutes: dailyMinutes,
        preferred_format: preferredFormat,
        onboarding_completed: true,
      });

      // Generate initial study plan based on onboarding preferences
      await repository.regenerateStudyPlan();
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
      {/* Progress header */}
      <div className="mb-8 space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curriculum Calibration • Step {step} of 3</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Configure Your Learning Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Knowvexa AI adapts topic prioritization, question difficulty, and daily schedules to these parameters.
        </p>

        {/* Step progress pills */}
        <div className="flex justify-center gap-2 pt-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 w-16 rounded-full transition-all duration-300 ${
                s <= step ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
              }`}
            />
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="p-6 sm:p-8">
          {/* STEP 1: Academic Track */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  Academic Background & Track
                </h3>
                <p className="text-xs text-slate-500">
                  Tell us where you are studying so we can calibrate baseline difficulty.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Display Name"
                  placeholder="e.g. Alex Rivera"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Current Education Level
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Undergraduate (1st / 2nd Year)">Undergraduate (1st / 2nd Year)</option>
                    <option value="Undergraduate (3rd Year)">Undergraduate (3rd Year)</option>
                    <option value="Undergraduate (Final Year)">Undergraduate (Final Year)</option>
                    <option value="Graduate / Master's Student">Graduate / Master&apos;s Student</option>
                    <option value="Self-Learner / Career Transitioner">Self-Learner / Career Transitioner</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Degree Track or Specialization
                  </label>
                  <select
                    value={courseTrack}
                    onChange={(e) => setCourseTrack(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Computer Science & AI">Computer Science & AI</option>
                    <option value="Data Science & Machine Learning">Data Science & Machine Learning</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="General Engineering & Mathematics">General Engineering & Mathematics</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="primary" onClick={() => setStep(2)}>
                  Continue to Subjects <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Subject Selection & Initial Confidence */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Select Subjects & Initial Confidence
                </h3>
                <p className="text-xs text-slate-500">
                  Select the subjects you need to prepare for, and rate your current confidence (1 = Beginner, 5 = High).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SEED_SUBJECTS.map((sub) => {
                  const isSelected = selectedSubjects.includes(sub.id);
                  const confidence = confidenceLevels[sub.id] || 3;

                  return (
                    <div
                      key={sub.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <button
                          type="button"
                          onClick={() => toggleSubject(sub.id)}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 text-left"
                        >
                          {sub.title}
                        </button>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSubject(sub.id)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                      </div>

                      <p className="text-[11px] text-slate-500 mb-3 leading-snug">
                        {sub.description.substring(0, 85)}...
                      </p>

                      {isSelected && (
                        <div className="space-y-1 pt-2 border-t border-indigo-100 dark:border-indigo-900/50">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                            <span>Self-Assessed Confidence</span>
                            <span className="text-indigo-600 dark:text-indigo-400">{confidence}/5</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={confidence}
                            onChange={(e) =>
                              setConfidenceLevels({
                                ...confidenceLevels,
                                [sub.id]: parseInt(e.target.value),
                              })
                            }
                            className="w-full accent-indigo-600 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button variant="primary" onClick={() => setStep(3)}>
                  Continue to Study Schedule <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Goals & Daily Study Time */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-600" />
                  Target Goal & Daily Time Commitment
                </h3>
                <p className="text-xs text-slate-500">
                  We schedule tasks so that you never exceed your daily minute budget.
                </p>
              </div>

              <div className="space-y-5">
                <Input
                  label="Target Exam or Semester Finish Date"
                  type="date"
                  value={targetExamDate}
                  onChange={(e) => setTargetExamDate(e.target.value)}
                />

                <Input
                  label="Target Goal or Grade Standard"
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  placeholder="e.g. Score > 90% or Clear Technical Assessments"
                />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      Available Daily Study Time
                    </label>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {dailyMinutes} Minutes / Day
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="180"
                    step="10"
                    value={dailyMinutes}
                    onChange={(e) => setDailyMinutes(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>20 min (Quick Review)</span>
                    <span>60 min (Recommended)</span>
                    <span>180 min (Intensive Prep)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Preferred Learning Format
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "problem_solving", label: "Problems & Quizzes" },
                      { id: "interactive", label: "Interactive Code" },
                      { id: "reading", label: "Concise Readings" },
                      { id: "visual", label: "Worked Diagrams" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setPreferredFormat(f.id as any)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                          preferredFormat === f.id
                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold"
                            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button variant="primary" onClick={handleFinish} isLoading={isLoading}>
                  Generate Calibrated Plan <CheckCircle2 className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
