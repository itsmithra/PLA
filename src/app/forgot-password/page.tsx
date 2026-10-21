"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrainCircuit, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 text-indigo-600 items-center justify-center shadow-soft mb-2">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reset Your Password
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your email to receive password recovery instructions
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {submitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Recovery Email Sent
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  If an account exists for <span className="font-semibold text-slate-700 dark:text-slate-300">{email}</span>, you will receive password reset instructions.
                </p>
                <Link href="/login" className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Return to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Registered Email Address"
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" size="md" className="w-full" isLoading={isLoading}>
                  Send Password Reset Link
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
