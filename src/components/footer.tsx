import React from "react";
import Link from "next/link";
import { BrainCircuit, ShieldCheck, Cpu, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">
                Knowvexa<span className="text-indigo-600">.ai</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Adaptive personalized learning platform engineered for university exams, concept mastery, and algorithmic knowledge retention.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Curriculum Tracks
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/subjects/python-programming" className="hover:text-indigo-600">Python Programming</Link></li>
              <li><Link href="/subjects/sql-databases" className="hover:text-indigo-600">SQL & Relational Databases</Link></li>
              <li><Link href="/subjects/probability-statistics" className="hover:text-indigo-600">Probability & Statistics</Link></li>
              <li><Link href="/subjects/data-science-fundamentals" className="hover:text-indigo-600">Data Science Fundamentals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Adaptive Architecture
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Supabase RLS Protected</li>
              <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-indigo-500" /> Deterministic Mastery Engine</li>
              <li className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-purple-500" /> Gemini API AI Guidance</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Legal & Verification
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
              All quiz scoring, mastery calculations, and study schedules execute on server-side logic with verified Zod schemas.
            </p>
            <span className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} Knowvexa AI. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
