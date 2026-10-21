"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { repository, DEFAULT_DEMO_USER } from "@/lib/storage";
import { UserProfile } from "@/types";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [targetGoal, setTargetGoal] = useState("");
  const [targetExamDate, setTargetExamDate] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    repository.getUserProfile().then((u) => {
      setProfile(u);
      setDisplayName(u.display_name);
      setDailyMinutes(u.daily_minutes);
      setTargetGoal(u.target_goal);
      setTargetExamDate(u.target_exam_date || "");
      setIsLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await repository.saveUserProfile({
      display_name: displayName,
      daily_minutes: dailyMinutes,
      target_goal: targetGoal,
      target_exam_date: targetExamDate,
    });
    // Trigger plan re-alignment with updated minutes
    await repository.regenerateStudyPlan();
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = async () => {
    if (confirm("Reset local demonstration progress back to initial baseline?")) {
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
      await repository.saveUserProfile(DEFAULT_DEMO_USER);
      await repository.regenerateStudyPlan();
      window.location.reload();
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <p className="text-xs text-slate-500">Loading user preferences...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-slate-50/60 dark:bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6">
        <div className="pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Account & Learning Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tune your study time commitment, target exam deadline, and academic goals.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Preferences saved! Your daily study plan has been re-calibrated.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Your university identity in Knowvexa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Full Name / Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Registered Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Track
                </label>
                <input
                  type="text"
                  value={profile.course_track}
                  disabled
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pacing & Exam Schedules</CardTitle>
              <CardDescription>
                Controls how many minutes Knowvexa schedules each day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Daily Study Budget
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
              </div>

              <Input
                label="Target Exam or Assessment Date"
                type="date"
                value={targetExamDate}
                onChange={(e) => setTargetExamDate(e.target.value)}
              />

              <Input
                label="Target Goal"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="e.g. Master Foundations, Score > 90%"
              />

              <div className="pt-2">
                <Button type="submit" variant="primary" size="md" isLoading={isSaving}>
                  <Save className="w-4 h-4 mr-1" /> Save & Recalibrate Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Demo Mode Reset */}
        <Card className="border-rose-200/60 dark:border-rose-900/40">
          <CardHeader>
            <CardTitle className="text-rose-600">Reset Local Demonstration Data</CardTitle>
            <CardDescription>
              Clears browser local storage and restores the factory seed dataset.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleResetData}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Reset to Initial Demo State
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
