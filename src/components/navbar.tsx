"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, BookOpen, Calendar, BarChart3, BookmarkCheck, Settings, LogOut, Menu, X, Sparkles } from "lucide-react";
import { repository } from "@/lib/storage";
import { UserProfile } from "@/types";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    repository.getUserProfile().then(setUser);
  }, [pathname]);

  const isPublicPage = pathname === "/" || pathname === "/login" || pathname === "/register" || pathname === "/forgot-password";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={isPublicPage ? "/" : "/dashboard"} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-soft group-hover:shadow-glow transition-all duration-300">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-100 dark:to-slate-200 bg-clip-text text-transparent">
              Knowvexa<span className="text-indigo-600 dark:text-indigo-400 font-extrabold">.ai</span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase -mt-1">
              Adaptive Learning
            </span>
          </div>
        </Link>

        {/* Public Header Navigation */}
        {isPublicPage ? (
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#curriculum" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white transition-colors">
              Curriculum
            </Link>
            <Link href="/#mastery-system" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white transition-colors">
              Mastery Engine
            </Link>
            <Link href="/#faq" className="text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-white transition-colors">
              FAQ
            </Link>
          </nav>
        ) : (
          /* Student Portal Quick Links */
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-slate-900/70 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname === "/dashboard"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/subjects"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname.startsWith("/subjects") || pathname.startsWith("/learn")
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Subjects
            </Link>
            <Link
              href="/study-plan"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname === "/study-plan"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Study Plan
            </Link>
            <Link
              href="/progress"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname === "/progress"
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              Analytics
            </Link>
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {isPublicPage ? (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-xs transition-all active:scale-[0.98]"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  {user?.display_name ? user.display_name.charAt(0) : "A"}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline">
                  {user?.display_name || "Alex Rivera"}
                </span>
              </Link>
              <Link
                href="/"
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-3">
          {isPublicPage ? (
            <div className="flex flex-col space-y-2">
              <Link href="/#features" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Features
              </Link>
              <Link href="/#curriculum" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Curriculum
              </Link>
              <Link href="/#faq" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                FAQ
              </Link>
              <div className="pt-2 flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-sm font-medium border border-slate-200 rounded-xl">
                  Sign In
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl">
                  Get Started
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-1">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-500" /> Dashboard
              </Link>
              <Link href="/subjects" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" /> Subjects & Topics
              </Link>
              <Link href="/study-plan" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" /> Study Planner
              </Link>
              <Link href="/progress" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" /> Analytics
              </Link>
              <Link href="/resources" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-indigo-500" /> Learning Resources
              </Link>
              <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 text-sm font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                <Settings className="w-4 h-4 text-indigo-500" /> Settings
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
