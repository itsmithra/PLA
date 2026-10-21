"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrainCircuit, ArrowRight, Sparkles, Lock, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { repository, DEFAULT_DEMO_USER } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      // Check or save profile locally for demo/development
      await repository.saveUserProfile({
        email,
        display_name: email.split("@")[0],
      });
      router.push("/dashboard");
    } catch {
      setError("Unable to sign in. Please verify your credentials or use the demo login.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setIsLoading(true);
    await repository.saveUserProfile(DEFAULT_DEMO_USER);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 items-center justify-center text-white shadow-soft mb-2">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Sign In to Knowvexa AI
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your personalized learning curriculum and study schedule
          </p>
        </div>

        {/* Quick Demo Access Callout */}
        <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Instant Demo Evaluation</span>
          </div>
          <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
            Skip registration and inspect the pre-seeded student account (Alex Rivera) with real quiz attempts, analytics, and schedules.
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            onClick={handleQuickDemoLogin}
            isLoading={isLoading}
          >
            One-Click Demo Student Sign In
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="University or Personal Email"
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="md"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                Sign In with Credentials
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don&apos;t have an account yet?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
